import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'
import { approveInvestmentAction, rejectInvestmentAction, confirmInvestmentPaymentAction, rejectInvestmentPaymentAction, processWithdrawalRequestAction, completeWithdrawalAction } from '@/actions/investments'
import { AdminInvestmentsClient } from '@/components/features/dashboard/admin-investments-client'

export default async function AdminInvestmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(*), withdrawal_requests(*)')
    .order('created_at', { ascending: false })

  const userIds = investments?.map(i => i.user_id) || []
  const { data: profiles } = await supabase.from('profiles').select('id, user_id, full_name, email').in('user_id', userIds)
  const profileMap = new Map((profiles as any[] | null)?.map(p => [p.user_id, p]) || [])

  const handleApprove = async (formData: FormData) => {
    'use server'
    return approveInvestmentAction(formData.get('id') as string)
  }
  const handleReject = async (formData: FormData) => {
    'use server'
    return rejectInvestmentAction(formData.get('id') as string, formData.get('notes') as string)
  }
  const handleConfirmPayment = async (formData: FormData) => {
    'use server'
    return confirmInvestmentPaymentAction(formData.get('id') as string, formData.get('notes') as string)
  }
  const handleRejectPayment = async (formData: FormData) => {
    'use server'
    return rejectInvestmentPaymentAction(formData.get('id') as string, formData.get('notes') as string)
  }
  const handleWithdrawal = async (formData: FormData) => {
    'use server'
    const requestId = formData.get('request_id') as string
    const status = formData.get('status') as 'approved' | 'rejected'
    const response = formData.get('response') as string | null
    await processWithdrawalRequestAction(requestId, status, response || undefined)
  }
  const handleCompleteWithdrawal = async (formData: FormData) => {
    'use server'
    await completeWithdrawalAction(formData.get('request_id') as string)
  }

  return (
    <AdminInvestmentsClient
      investments={investments || []}
      profileMap={Object.fromEntries(profileMap)}
      approve={handleApprove}
      reject={handleReject}
      confirmPayment={handleConfirmPayment}
      rejectPayment={handleRejectPayment}
      handleWithdrawal={handleWithdrawal}
      handleCompleteWithdrawal={handleCompleteWithdrawal}
    />
  )
}
