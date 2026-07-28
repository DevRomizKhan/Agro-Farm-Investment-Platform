'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { investSchema, investmentPlanSchema } from '@/schemas'
import type { InvestmentPlanFormData } from '@/schemas'
import { SUPABASE_STORAGE_BUCKETS, MAX_FILE_SIZE, ALLOWED_DOCUMENT_TYPES } from '@/constants'

import { generateFileName, calculateROI, isPlanCurrentlyActive } from '@/lib/utils'
import { addMonths } from 'date-fns'

export type InvestmentResult = {
  success: boolean
  error?: string
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

/**
 * Investor submits a pending investment request
 */
export async function createInvestmentAction(
  formData: FormData
): Promise<InvestmentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const planId = formData.get('plan_id')
  const rawAmount = formData.get('amount')
  const receiptFile = formData.get('receipt')

  // Validate
  const validated = investSchema.safeParse({ plan_id: planId, amount: rawAmount })
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }
  const { amount } = validated.data

  if (!(receiptFile instanceof File) || receiptFile.size === 0) {
    return { success: false, error: 'Bank transfer/deposit receipt file is required' }
  }
  if (!ALLOWED_DOCUMENT_TYPES.includes(receiptFile.type)) {
    return { success: false, error: 'Invalid receipt file type. Upload a JPEG, PNG, WebP image or a PDF' }
  }
  if (receiptFile.size > MAX_FILE_SIZE) {
    return { success: false, error: 'Receipt file exceeds the 5MB size limit' }
  }

  // Check KYC verification status
  const { data: kycSubmission } = await supabase
    .from('kyc_submissions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!kycSubmission) {
    return { success: false, error: 'Please complete KYC verification before investing' }
  }
  if (kycSubmission.status !== 'approved') {
    return { success: false, error: `Your KYC verification is ${kycSubmission.status}. Please wait for approval before investing.` }
  }

  // Fetch plan details to verify limits
  const { data: plan } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('id', validated.data.plan_id)
    .maybeSingle()

  if (!plan) return { success: false, error: 'Plan not found' }
  if (!isPlanCurrentlyActive(plan)) {
    return { success: false, error: 'This investment plan is not currently available' }
  }
  if (amount < Number(plan.min_amount) || amount > Number(plan.max_amount)) {
    return {
      success: false,
      error: `Investment must be between ৳${Number(plan.min_amount).toLocaleString()} and ৳${Number(plan.max_amount).toLocaleString()}`,
    }
  }

  try {
    // 1. Upload receipt to Storage
    const uniqueName = `${user.id}/receipt-${generateFileName(receiptFile.name)}`
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKETS.RECEIPTS)
      .upload(uniqueName, receiptFile, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) throw new Error(`Receipt upload failed: ${uploadError.message}`)

    const { data: { publicUrl } } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKETS.RECEIPTS)
      .getPublicUrl(uniqueName)

    // Calculate expected profit/ROI
    const expectedROI = calculateROI(amount, Number(plan.roi_percentage), Number(plan.duration_months))

    // 2. Insert Investment
    const { data: inv, error: invError } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        plan_id: validated.data.plan_id,
        amount,
        status: 'pending',
        expected_roi: expectedROI,
        receipt_url: publicUrl,
      })
      .select('id')
      .maybeSingle()

    if (invError || !inv) throw new Error(invError?.message || 'Failed to create investment')

    // 3. Create Transaction log (ledger rows are system-owned; investors have no insert policy)
    const adminSupabase = createAdminClient()
    const { error: txError } = await adminSupabase.from('transactions').insert({
      investment_id: inv.id,
      user_id: user.id,
      type: 'deposit',
      amount,
      description: `Pending deposit for ${plan.name} plan`,
    })

    if (txError) throw new Error(`Failed to record deposit transaction: ${txError.message}`)

    // Notify admins/owners
    const { data: owners } = await adminSupabase
      .from('profiles')
      .select('user_id')
      .eq('role', 'owner')

    if (owners && owners.length > 0) {
      const ownerNotifications = owners.map((owner) => ({
        user_id: owner.user_id,
        title: 'New Investment Pending',
        message: `New pending investment of ৳${amount.toLocaleString()} received for ${plan.name}.`,
        type: 'investment',
        action_url: `/admin/investments/${inv.id}`,
      }))
      await adminSupabase.from('notifications').insert(ownerNotifications)
    }

    revalidatePath('/dashboard/investments')
    revalidatePath('/admin/investments')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, 'Failed to submit investment') }

  }
}

/**
 * Approve pending investment (Owner Action)
 */
export async function approveInvestmentAction(
  investmentId: string,
  notes?: string
): Promise<InvestmentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role, id').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') return { success: false, error: 'Forbidden: Owners only' }

  // Fetch investment with plan details
  const { data: inv } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(*)')
    .eq('id', investmentId)
    .maybeSingle()

  if (!inv) return { success: false, error: 'Investment not found' }
  if (inv.status !== 'pending') return { success: false, error: 'Only pending investments can be approved' }

  const plan = (Array.isArray(inv.plan) ? inv.plan[0] : inv.plan) as
    | { name: string; roi_percentage: number; duration_months: number }
    | null
  if (!plan) return { success: false, error: 'Investment plan not found for this investment' }

  const startDate = new Date()
  const endDate = addMonths(startDate, Number(plan.duration_months))

  // Update investment status
  const { error: updateError } = await supabase
    .from('investments')
    .update({
      status: 'active',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      approved_by: profile.id,
      notes: notes || null,
      expected_roi: calculateROI(Number(inv.amount), Number(plan.roi_percentage), Number(plan.duration_months)),
      updated_at: new Date().toISOString(),
    })
    .eq('id', investmentId)
    .eq('status', 'pending')

  if (updateError) return { success: false, error: updateError.message }

  // Create notifications
  const adminSupabase = createAdminClient()
  await adminSupabase.from('notifications').insert({
    user_id: inv.user_id,
    title: 'Investment Activated! 📈',
    message: `Your investment of ৳${Number(inv.amount).toLocaleString()} for ${plan.name} is now active.`,
    type: 'investment',
    action_url: '/dashboard/investments',
  })

  revalidatePath('/admin/investments')
  revalidatePath('/dashboard/investments')
  return { success: true }
}

/**
 * Create or edit investment plan (Owner Action)
 */
export async function manageInvestmentPlanAction(
  data: InvestmentPlanFormData,
  planId?: string
): Promise<InvestmentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role, id').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') return { success: false, error: 'Forbidden: Owners only' }

  const validated = investmentPlanSchema.safeParse(data)
  if (!validated.success) return { success: false, error: validated.error.issues[0]?.message }

  try {
    if (planId) {
      // Update plan
      const { error } = await supabase
        .from('investment_plans')
        .update({
          name: validated.data.name,
          description: validated.data.description,
          min_amount: validated.data.min_amount,
          max_amount: validated.data.max_amount,
          roi_percentage: validated.data.roi_percentage,
          duration_months: validated.data.duration_months,
          is_active: validated.data.is_active,
          starts_at: validated.data.starts_at ?? null,
          ends_at: validated.data.ends_at ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId)

      if (error) throw error
    } else {
      // Insert plan
      const { data: newPlan, error: insertError } = await supabase
        .from('investment_plans')
        .insert({
          name: validated.data.name,
          description: validated.data.description || null,
          min_amount: validated.data.min_amount,
          max_amount: validated.data.max_amount,
          roi_percentage: validated.data.roi_percentage,
          duration_months: validated.data.duration_months,
          is_active: validated.data.is_active,
          starts_at: validated.data.starts_at ?? null,
          ends_at: validated.data.ends_at ?? null,
          created_by: profile.id,
        })
        .select('id')
        .maybeSingle()

      if (insertError) throw insertError
      if (!newPlan) throw new Error('Failed to create plan')
    }

    revalidatePath('/plans')
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/investments')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, 'Failed to save plan') }

  }
}

export async function deleteInvestmentPlanAction(planId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile || profile.role !== 'owner') {
      return { success: false, error: 'Unauthorized' }
    }

    // A plan referenced by any investment cannot be removed without breaking history
    const { data: linkedInvestments, error: linkedError } = await supabase
      .from('investments')
      .select('id')
      .eq('plan_id', planId)
      .limit(1)

    if (linkedError) throw linkedError

    if (linkedInvestments && linkedInvestments.length > 0) {
      return {
        success: false,
        error: 'Cannot delete a plan that has investments. Deactivate it instead to hide it from investors.',
      }
    }

    // Delete the plan
    const { error } = await supabase
      .from('investment_plans')
      .delete()
      .eq('id', planId)

    if (error) throw error

    revalidatePath('/plans')
    revalidatePath('/admin/plans')
    revalidatePath('/dashboard/investments')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, 'Failed to delete plan') }

  }
}
