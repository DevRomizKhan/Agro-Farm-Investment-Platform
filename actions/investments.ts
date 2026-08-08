'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { investSchema, investmentPlanSchema, withdrawalRequestSchema } from '@/schemas'
import type { InvestmentPlanFormData } from '@/schemas'
import { SUPABASE_STORAGE_BUCKETS } from '@/constants'
import { generateFileName, calculateROI, isPlanCurrentlyActive } from '@/lib/utils'

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

  const planId = formData.get('plan_id') as string
  const shares = Number(formData.get('shares'))
  const receiptFile = formData.get('receipt') as File | null

  // Validate
  const validated = investSchema.safeParse({ plan_id: planId, shares })
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

  // Ensure the plan is currently active (time-gated)
  if (!isPlanCurrentlyActive(plan)) {
    return { success: false, error: 'This investment plan is not currently available' }
  }

  // Validate share limits
  if (shares > plan.max_shares_per_investor) {
    return { success: false, error: `Maximum ${plan.max_shares_per_investor} shares per investor allowed` }
  }

  // Calculate amount based on shares
  const amount = shares * plan.shares_per_amount

  // Check total sold shares for this plan
  const { data: allInvestments } = await createAdminClient()
    .from('investments')
    .select('user_id, shares_purchased, status, created_at')
    .eq('plan_id', planId)
    .in('status', ['active', 'pending'])

  const activeInvestments = allInvestments?.filter((investment) => investment.status === 'active') || []
  const totalSoldShares = activeInvestments.reduce((sum, inv) => sum + Number(inv.shares_purchased || 0), 0)
  const ownerShares = Math.floor(plan.total_shares * (plan.owner_share_percentage / 100))
  const availableShares = Math.max(0, plan.total_shares - ownerShares - totalSoldShares)

  if (shares > availableShares) {
    return { success: false, error: `Only ${availableShares} shares Remaining. You requested ${shares} shares.` }
  }

  const activeSharesByInvestor = new Map<string, number>()
  activeInvestments.forEach((investment) => {
    activeSharesByInvestor.set(
      investment.user_id,
      (activeSharesByInvestor.get(investment.user_id) || 0) + Number(investment.shares_purchased || 0),
    )
  })
  const hasFullMaxHolder = [...activeSharesByInvestor.values()].some(
    (investorShares) => investorShares >= plan.max_shares_per_investor,
  )
  const hasPendingMaxRequest = allInvestments?.some(
    (investment) => investment.status === 'pending' && Number(investment.shares_purchased || 0) >= plan.max_shares_per_investor,
  )

  if (shares >= plan.max_shares_per_investor && (hasFullMaxHolder || hasPendingMaxRequest)) {
    return {
      success: false,
      error: `Only one investor can receive the maximum ${plan.max_shares_per_investor} shares for this plan. Please request fewer than ${plan.max_shares_per_investor} shares.`,
    }
  }

  // Count both active and pending requests so multiple open requests cannot
  // bypass the investor's strict per-plan maximum.
  const { data: existingInvestments } = await supabase
    .from('investments')
    .select('shares_purchased')
    .eq('user_id', user.id)
    .eq('plan_id', planId)
    .in('status', ['active', 'pending'])

  const currentShares = existingInvestments?.reduce((sum, inv) => sum + inv.shares_purchased, 0) || 0
  if (currentShares + shares > plan.max_shares_per_investor) {
    return { success: false, error: `You can only have a maximum of ${plan.max_shares_per_investor} shares total` }
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
    const expectedROI = calculateROI(amount, plan.roi_percentage, plan.duration_months)

    // 2. Insert Investment
    const { data: inv, error: invError } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount,
        shares_purchased: shares,
        status: 'pending',
        expected_roi: expectedROI,
        receipt_url: publicUrl,
        lock_period_days: Number(plan.lock_period_days),
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
      description: `Pending deposit for ${shares} shares in ${plan.name} plan`,
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
        message: `New pending investment of ${shares} shares (৳${amount.toLocaleString()}) received for ${plan.name}.`,
        type: 'investment',
        action_url: `/admin/investments/${inv.id}`,
      }))
      await adminSupabase.from('notifications').insert(ownerNotifications)
    }

    revalidatePath('/dashboard/investments')
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

  // Allocation is performed inside one database transaction. It locks the plan,
  // reserves shares for older pending requests, and floors the result at zero.
  const { data: allocation, error: allocationError } = await supabase.rpc('approve_investment_request', {
    p_investment_id: investmentId,
    p_approved_by: profile.id,
    p_notes: notes || null,
  })

  if (allocationError) {
    console.error('Investment approval failed:', allocationError.message)
    if (allocationError.message.includes('No shares remain')) {
      const adminSupabase = createAdminClient()
      await adminSupabase.from('notifications').insert({
        user_id: inv.user_id,
        title: 'Investment request update',
        message: `Your request for ${inv.shares_purchased} shares in ${inv.plan.name} could not be activated. All eligible shares have been allocated according to request priority and investor limits. Please wait for availability or contact support for assistance.`,
        type: 'investment',
        action_url: '/dashboard/investments',
      })
      return {
        success: false,
        error: 'This request cannot be approved because the remaining plan shares or this investor’s maximum has already been allocated.',
      }
    }
    return { success: false, error: 'We could not approve this investment right now. Please try again.' }
  }

  const result = Array.isArray(allocation) ? allocation[0] : allocation
  if (!result || Number(result.allocated_shares) <= 0) {
    return { success: false, error: 'This request cannot be approved because no eligible shares remain.' }
  }

  const allocatedShares = Number(result.allocated_shares)
  const allocatedAmount = Number(result.amount)
  const requestedShares = Number(inv.shares_purchased)
  const excludedShares = Math.max(0, requestedShares - allocatedShares)
  const allocationNote = excludedShares > 0
    ? ` ${excludedShares} of your requested ${requestedShares} shares could not be allocated because the available share limit was reached.`
    : ''

  // Create notifications
  const adminSupabase = createAdminClient()
  await adminSupabase.from('notifications').insert({
    user_id: inv.user_id,
    title: 'Investment approved',
    message: `Your investment request has been approved. ${allocatedShares} shares in ${inv.plan.name} are now active with an investment value of ৳${allocatedAmount.toLocaleString()}. The investment term is locked for ${Number(inv.plan.lock_period_days)} days.${allocationNote}`,
    type: 'investment',
    action_url: '/dashboard/investments',
  })

  revalidatePath('/admin/investments')
  revalidatePath('/dashboard/investments')
  revalidatePath('/plans')
  revalidatePath('/', 'layout')
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
          total_shares: validated.data.total_shares,
          shares_per_amount: validated.data.shares_per_amount,
          owner_share_percentage: validated.data.owner_share_percentage,
          max_shares_per_investor: validated.data.max_shares_per_investor,
          roi_percentage: validated.data.roi_percentage,
          duration_months: validated.data.duration_months,
          lock_period_days: validated.data.lock_period_days,
          is_active: validated.data.is_active,
          starts_at: validated.data.starts_at ?? null,
          ends_at: validated.data.ends_at ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId)

      if (error) throw new Error(`Database error: ${error.message}`)
    } else {
      // Insert plan
      const { data: newPlan, error: insertError } = await supabase
        .from('investment_plans')
        .insert({
          name: validated.data.name,
          description: validated.data.description || null,
          total_shares: validated.data.total_shares,
          shares_per_amount: validated.data.shares_per_amount,
          owner_share_percentage: validated.data.owner_share_percentage,
          max_shares_per_investor: validated.data.max_shares_per_investor,
          roi_percentage: validated.data.roi_percentage,
          duration_months: validated.data.duration_months,
          lock_period_days: validated.data.lock_period_days,
          is_active: validated.data.is_active,
          starts_at: validated.data.starts_at ?? null,
          ends_at: validated.data.ends_at ?? null,
          created_by: profile.id,
        })
        .select('id')
        .maybeSingle()

      if (insertError) throw new Error(`Database error: ${insertError.message}`)
      if (!newPlan) throw new Error('Failed to create plan')
    }

    revalidatePath('/plans')
    revalidatePath('/', 'layout')
    revalidatePath('/admin/plans')
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
    revalidatePath('/', 'layout')
    revalidatePath('/admin/plans')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, 'Failed to delete plan') }
  }
}

/**
 * Create withdrawal request (Investor Action)
 */
export async function createWithdrawalRequestAction(
  formData: FormData
): Promise<InvestmentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const investmentId = formData.get('investment_id') as string
  const amount = Number(formData.get('amount'))
  const withdrawalType = formData.get('withdrawal_type') as 'profit_only' | 'full_amount'
    | 'share_transfer'
  const transferShares = Number(formData.get('transfer_shares') || 0)
  const transferRecipientEmail = (formData.get('transfer_recipient_email') as string | null)?.trim().toLowerCase()
  const requestReason = formData.get('request_reason') as string | null

  // Validate
  const validated = withdrawalRequestSchema.safeParse({
    investment_id: investmentId,
    amount,
    withdrawal_type: withdrawalType,
    transfer_shares: transferShares || undefined,
    transfer_recipient_email: transferRecipientEmail || undefined,
    request_reason: requestReason || undefined,
  })
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  // Fetch investment details
  const { data: investment } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(*)')
    .eq('id', investmentId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!investment) return { success: false, error: 'Investment not found' }
  if (investment.status !== 'active') return { success: false, error: 'Investment is not active' }

  // Check whether this investment's plan-defined lock period has expired
  if (!investment.lock_expires_at) {
    return { success: false, error: 'Lock period not set' }
  }
  const lockExpiresAt = new Date(investment.lock_expires_at)
  const now = new Date()
  if (now < lockExpiresAt) {
    const daysRemaining = Math.ceil((lockExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return { success: false, error: `Lock period not expired. ${daysRemaining} days remaining.` }
  }

  // Prevent overlapping exit instructions before validating the requested value.
  const { data: existingRequests } = await supabase
    .from('withdrawal_requests')
    .select('id')
    .eq('investment_id', investmentId)
    .in('status', ['pending', 'approved'])
    .limit(1)
  if (existingRequests?.length) {
    return { success: false, error: 'This investment already has an open exit request' }
  }

  // Validate withdrawal amount
  if (withdrawalType === 'profit_only') {
    if (amount > investment.actual_roi) {
      return { success: false, error: 'Amount cannot exceed available profit' }
    }
  } else if (withdrawalType === 'full_amount') {
    // full_amount
    const totalAvailable = Number(investment.amount) + investment.actual_roi
    if (Math.abs(amount - totalAvailable) > 0.01) {
      return { success: false, error: 'Whole amount withdrawal must include the full investment and available profit' }
    }
  } else {
    if (!transferRecipientEmail || !transferShares) {
      return { success: false, error: 'Recipient email and number of shares are required for a transfer' }
    }
    if (transferShares > Number(investment.shares_purchased)) {
      return { success: false, error: 'Transfer shares cannot exceed your current share balance' }
    }
    const { data: recipient } = await createAdminClient()
      .from('profiles')
      .select('user_id, role, is_active, email')
      .ilike('email', transferRecipientEmail)
      .maybeSingle()
    if (!recipient || recipient.role !== 'investor' || !recipient.is_active) {
      return { success: false, error: 'No active investor account was found for that email' }
    }
    if (recipient.user_id === user.id) {
      return { success: false, error: 'You cannot transfer shares to yourself' }
    }
    const shareValue = Number(investment.amount) / Number(investment.shares_purchased)
    const calculatedTransferAmount = Math.round(shareValue * transferShares * 100) / 100
    // Keep the recipient identity in the request; the owner confirms the transfer.
    const { data: request, error: requestError } = await supabase
      .from('withdrawal_requests')
      .insert({
        investment_id: investmentId,
        user_id: user.id,
        amount: calculatedTransferAmount,
        withdrawal_type: withdrawalType,
        transfer_shares: transferShares,
        transfer_recipient_user_id: recipient.user_id,
        transfer_recipient_email: recipient.email,
        request_reason: requestReason,
        status: 'pending',
      })
      .select('id')
      .maybeSingle()
    if (requestError || !request) return { success: false, error: requestError?.message || 'Failed to create transfer request' }
    await notifyOwnersOfExitRequest(calculatedTransferAmount, withdrawalType, investment.plan.name)
    revalidatePath('/dashboard/investments')
    return { success: true }
  }

  try {
    // Create withdrawal request
    const { data: request, error: requestError } = await supabase
      .from('withdrawal_requests')
      .insert({
        investment_id: investmentId,
        user_id: user.id,
        amount,
        withdrawal_type: withdrawalType,
        request_reason: requestReason,
        status: 'pending',
      })
      .select('id')
      .maybeSingle()

    if (requestError || !request) throw new Error(requestError?.message || 'Failed to create withdrawal request')

    await notifyOwnersOfExitRequest(amount, withdrawalType, investment.plan.name)

    revalidatePath('/dashboard/investments')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, 'Failed to submit withdrawal request') }
  }
}

async function notifyOwnersOfExitRequest(amount: number, requestType: string, planName: string) {
  const adminSupabase = createAdminClient()
  const { data: owners } = await adminSupabase.from('profiles').select('user_id').eq('role', 'owner')
  if (!owners?.length) return
  await adminSupabase.from('notifications').insert(owners.map((owner) => ({
    user_id: owner.user_id,
    title: requestType === 'share_transfer' ? 'New Share Transfer Request' : 'New Withdrawal Request',
    message: `A ${requestType.replace('_', ' ')} request of ৳${amount.toLocaleString()} was submitted for ${planName}.`,
    type: 'transaction',
    action_url: '/admin/investments',
  })))
}

/**
 * Process withdrawal request (Owner Action)
 */
export async function processWithdrawalRequestAction(
  requestId: string,
  status: 'approved' | 'rejected',
  ownerResponse?: string
): Promise<InvestmentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role, id').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') return { success: false, error: 'Forbidden: Owners only' }

  // Fetch withdrawal request with investment details
  const { data: request } = await supabase
    .from('withdrawal_requests')
    .select('*, investment:investments(*, plan:investment_plans(*))')
    .eq('id', requestId)
    .maybeSingle()

  if (!request) return { success: false, error: 'Withdrawal request not found' }
  if (request.status !== 'pending') return { success: false, error: 'Only pending requests can be processed' }
  if (status !== 'approved' && status !== 'rejected') {
    return { success: false, error: 'Invalid request decision' }
  }
  const response = ownerResponse?.trim()
  if (status === 'rejected' && !response) {
    return { success: false, error: 'Please provide a reason before rejecting this request' }
  }

  try {
    if (status === 'rejected') {
      // Reject the request
      const { error: updateError } = await supabase
        .from('withdrawal_requests')
        .update({
          status: 'rejected',
          owner_response: response || null,
          owner_response_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Notify investor
      const adminSupabase = createAdminClient()
      await adminSupabase.from('notifications').insert({
        user_id: request.user_id,
        title: 'Withdrawal Request Rejected',
        message: `Your withdrawal request of ৳${request.amount.toLocaleString()} has been rejected. ${response || ''}`,
        type: 'transaction',
        action_url: '/dashboard/investments',
      })

      revalidatePath('/admin/investments')
      revalidatePath('/dashboard/investments')
      return { success: true }
    }

    // Approve the request - owner has 3 months to complete payment
    const { error: updateError } = await supabase
      .from('withdrawal_requests')
      .update({
        status: 'approved',
        owner_response: response || null,
        owner_response_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (updateError) throw updateError

    // Notify investor
    const adminSupabase = createAdminClient()
    await adminSupabase.from('notifications').insert({
      user_id: request.user_id,
      title: 'Withdrawal Request Approved',
      message: `Your withdrawal request of ৳${request.amount.toLocaleString()} has been approved. Payment will be processed within 3 months.`,
      type: 'transaction',
      action_url: '/dashboard/investments',
    })

    revalidatePath('/admin/investments')
    revalidatePath('/dashboard/investments')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, 'Failed to process withdrawal request') }
  }
}

/**
 * Complete withdrawal payment (Owner Action)
 */
export async function completeWithdrawalAction(
  requestId: string
): Promise<InvestmentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role, id').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') return { success: false, error: 'Forbidden: Owners only' }

  // Fetch withdrawal request
  const { data: request } = await supabase
    .from('withdrawal_requests')
    .select('*, investment:investments(*)')
    .eq('id', requestId)
    .maybeSingle()

  if (!request) return { success: false, error: 'Withdrawal request not found' }
  if (request.status !== 'approved') return { success: false, error: 'Only approved requests can be completed' }

  try {
    const { error: completionError } = await supabase.rpc('complete_withdrawal_request', {
      p_request_id: requestId,
      p_owner_user_id: user.id,
    })
    if (completionError) throw completionError

    // Notify investor
    const adminSupabase = createAdminClient()
    await adminSupabase.from('notifications').insert({
      user_id: request.user_id,
      title: 'Withdrawal Completed',
      message: `Your withdrawal of ৳${request.amount.toLocaleString()} has been completed.`,
      type: 'transaction',
      action_url: '/dashboard/investments',
    })
    if (request.withdrawal_type === 'share_transfer' && request.transfer_recipient_user_id) {
      await adminSupabase.from('notifications').insert({
        user_id: request.transfer_recipient_user_id,
        title: 'Shares Transferred To You',
        message: `${request.transfer_shares} shares from ${request.investment?.plan?.name || 'an investment plan'} have been transferred to your portfolio.`,
        type: 'investment',
        action_url: '/dashboard/investments',
      })
    }

    revalidatePath('/admin/investments')
    revalidatePath('/dashboard/investments')
    revalidatePath('/admin/transactions')
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, 'Failed to complete withdrawal') }
  }
}
