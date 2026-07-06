'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { investSchema, investmentPlanSchema } from '@/schemas'
import type { InvestFormData, InvestmentPlanFormData } from '@/schemas'
import { SUPABASE_STORAGE_BUCKETS } from '@/constants'
import { generateFileName, calculateROI } from '@/lib/utils'
import { addMonths } from 'date-fns'

export type InvestmentResult = {
  success: boolean
  error?: string
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

  const planId = formData.get('plan_id') as string
  const amount = Number(formData.get('amount'))
  const receiptFile = formData.get('receipt') as File | null

  // Validate
  const validated = investSchema.safeParse({ plan_id: planId, amount })
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  if (!receiptFile || receiptFile.size === 0) {
    return { success: false, error: 'Bank transfer/deposit receipt file is required' }
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
    .eq('id', planId)
    .maybeSingle()

  if (!plan) return { success: false, error: 'Plan not found' }
  if (amount < Number(plan.min_amount) || amount > Number(plan.max_amount)) {
    return { success: false, error: `Investment must be between ৳${plan.min_amount} and ৳${plan.max_amount}` }
  }

  try {
    // 1. Upload receipt to Storage
    const uniqueName = `${user.id}/receipt-${generateFileName(receiptFile.name)}`
    const { data: uploadData, error: uploadError } = await supabase.storage
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
    const expectedROI = calculateROI(amount, plan.roi_percentage, plan.duration_months)

    // 2. Insert Investment
    const { data: inv, error: invError } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount,
        status: 'pending',
        expected_roi: expectedROI,
        receipt_url: publicUrl,
      })
      .select('id')
      .maybeSingle()

    if (invError || !inv) throw new Error(invError?.message || 'Failed to create investment')

    // 3. Create Transaction log
    await supabase.from('transactions').insert({
      investment_id: inv.id,
      user_id: user.id,
      type: 'deposit',
      amount,
      description: `Pending deposit for ${plan.name} plan`,
    })

    // Notify admins/owners
    const adminSupabase = createAdminClient()
    const { data: owners } = await adminSupabase
      .from('profiles')
      .select('user_id')
      .eq('role', 'owner')

    if (owners) {
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
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit investment' }
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

  const startDate = new Date()
  const endDate = addMonths(startDate, inv.plan.duration_months)

  // Update investment status
  const { error: updateError } = await supabase
    .from('investments')
    .update({
      status: 'active',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      approved_by: profile.id,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', investmentId)

  if (updateError) return { success: false, error: updateError.message }

  // Create notifications
  const adminSupabase = createAdminClient()
  await adminSupabase.from('notifications').insert({
    user_id: inv.user_id,
    title: 'Investment Activated! 📈',
    message: `Your investment of ৳${Number(inv.amount).toLocaleString()} for ${inv.plan.name} is now active.`,
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
          created_by: profile.id,
        })
        .select('id')
        .maybeSingle()

      if (insertError) throw insertError
      if (!newPlan) throw new Error('Failed to create plan')
    }

    revalidatePath('/plans')
    revalidatePath('/admin/plans')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save plan' }
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

    // Check if plan has any active investments
    const { data: activeInvestments } = await supabase
      .from('investments')
      .select('id')
      .eq('plan_id', planId)
      .eq('status', 'active')
      .limit(1)

    if (activeInvestments && activeInvestments.length > 0) {
      return { success: false, error: 'Cannot delete plan with active investments' }
    }

    // Delete the plan
    const { error } = await supabase
      .from('investment_plans')
      .delete()
      .eq('id', planId)

    if (error) throw error

    revalidatePath('/plans')
    revalidatePath('/admin/plans')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete plan' }
  }
}
