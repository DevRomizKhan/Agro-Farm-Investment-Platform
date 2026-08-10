import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isPlanCurrentlyActive } from '@/lib/utils'
import { ROUTES } from '@/constants'
import { InvestorDashboardClient } from '@/components/features/dashboard/investor-dashboard-client'

export default async function InvestorDashboardPage() {
  const supabase = await createClient()
  const authData = await supabase.auth.getUser()
  const user = authData.data.user
  if (!user) redirect(ROUTES.LOGIN)

  // Fetch profile, KYC status and investments
  const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('user_id', user.id).maybeSingle()
  const { data: kyc } = await supabase.from('kyc_submissions').select('status').eq('user_id', user.id).maybeSingle()
  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(name, roi_percentage, shares_per_amount, total_shares, owner_share_percentage)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: latestNotification } = await supabase
    .from('notifications')
    .select('id, title, message, type')
    .eq('user_id', user.id)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const activeInvestments = investments?.filter(i => i.status === 'active') || []
  const totalInvested = activeInvestments.reduce((sum, i) => sum + Number(i.amount), 0)
  const totalSharesOwned = activeInvestments.reduce((sum, i) => sum + (Number(i.shares_purchased) || 0), 0)
  const totalROI = investments?.reduce((sum, i) => sum + Number(i.actual_roi || 0), 0) || 0
  const pendingCount = investments?.filter(i => i.status === 'pending').length || 0

  // Fetch ALL active investment plans
  const { data: allPlans } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true)

  // Fetch ALL active investments for ALL plans to get accurate sold shares
  const availablePlans = (allPlans || []).filter(isPlanCurrentlyActive)
  const allPlanIds = availablePlans.map(p => p.id)
  const { data: allPlanInvestments } = allPlanIds.length > 0
    ? await createAdminClient()
      .from('investments')
      .select('plan_id, shares_purchased')
      .in('plan_id', allPlanIds)
      .eq('status', 'active')
    : { data: [] }

  // Calculate shares sold per plan
  const planSharesSold: Record<string, number> = {}
  allPlanInvestments?.forEach(inv => {
    planSharesSold[inv.plan_id] = (planSharesSold[inv.plan_id] || 0) + inv.shares_purchased
  })

  // Calculate available shares across all currently available plans.
  const totalAvailableShares = availablePlans.reduce((sum, plan) => {
    const totalShares = Number(plan.total_shares)
    const ownerShares = Math.floor(totalShares * (Number(plan.owner_share_percentage) / 100))
    const soldShares = planSharesSold[plan.id] || 0
    return sum + Math.max(0, totalShares - ownerShares - soldShares)
  }, 0)

  const kycStatus = kyc?.status || 'not_submitted'

  return (
    <InvestorDashboardClient
      profileName={profile?.full_name?.split(' ')[0]}
      kycStatus={kycStatus}
      latestNotification={latestNotification}
      totalInvested={totalInvested}
      totalSharesOwned={totalSharesOwned}
      totalROI={totalROI}
      pendingCount={pendingCount}
      totalAvailableShares={totalAvailableShares}
      investments={investments || []}
      planSharesSold={planSharesSold}
    />
  )
}
