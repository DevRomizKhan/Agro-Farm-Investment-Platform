import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isPlanCurrentlyActive } from '@/lib/utils'
import { ROUTES } from '@/constants'
import type { InvestmentPlan } from '@/types'
import { InvestorInvestmentsClient } from '@/components/features/investments/investor-investments-client'

export default async function InvestmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Fetch KYC status
  const { data: kycSubmission } = await supabase
    .from('kyc_submissions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()

  const isKYCApproved = kycSubmission?.status === 'approved'

  // Fetch ALL active-flagged plans then filter
  const { data: allPlans } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true)

  const plans = (allPlans || []).filter((p) => isPlanCurrentlyActive(p)) as InvestmentPlan[]

  // Fetch investor's investments with withdrawal requests
  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(*), withdrawal_requests(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const needsBankDetails = investments?.some(inv => inv.status === 'approved') || false
  const { data: bankSettings } = needsBankDetails
    ? await createAdminClient().from('bank_transfer_settings').select('account_name, bank_name, account_number, branch_name, routing_number, instructions').eq('id', true).maybeSingle()
    : { data: null }

  // Calculate sold shares for each plan
  const planIds = plans.map(p => p.id)
  const { data: planInvestments } = planIds.length > 0
    ? await createAdminClient()
      .from('investments')
      .select('plan_id, shares_purchased')
      .in('plan_id', planIds)
      .eq('status', 'active')
    : { data: [] }

  const planSharesSold: Record<string, number> = {}
  planInvestments?.forEach(inv => {
    planSharesSold[inv.plan_id] = (planSharesSold[inv.plan_id] || 0) + inv.shares_purchased
  })

  return (
    <InvestorInvestmentsClient
      isKYCApproved={isKYCApproved}
      kycSubmission={kycSubmission}
      plans={plans}
      investments={investments || []}
      bankSettings={bankSettings}
      planSharesSold={planSharesSold}
    />
  )
}
