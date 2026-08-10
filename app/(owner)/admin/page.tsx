import { createClient } from '@/lib/supabase/server'
import { AdminDashboardClient } from '@/components/features/dashboard/admin-dashboard-client'

type ProfileSummary = {
  user_id: string
  full_name: string | null
  email: string | null
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Parallel data fetching
  const [
    { count: totalInvestors },
    { count: pendingKYC },
    { count: pendingShareRequests },
    { count: pendingPaymentVerifications },
    { data: recentKYC },
    { data: recentInvestments },
    { data: investmentAgg },
    { data: plans },
    { data: allInvestments },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
    supabase.from('kyc_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('investments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('investments').select('*', { count: 'exact', head: true }).eq('status', 'payment_submitted'),
    supabase.from('kyc_submissions').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
    supabase.from('investments').select('*, plan:investment_plans(name, shares_per_amount)').order('created_at', { ascending: false }).limit(5),
    supabase.from('investments').select('amount, shares_purchased, status'),
    supabase.from('investment_plans').select('*').eq('is_active', true),
    supabase.from('investments').select('plan_id, shares_purchased, status').in('status', ['active', 'pending']),
  ])

  // Fetch profiles for KYC submissions
  const kycUserIds = recentKYC?.map(k => k.user_id) || []
  const { data: kycProfiles } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email')
    .in('user_id', kycUserIds)

  // Fetch profiles for investments
  const investmentUserIds = recentInvestments?.map(i => i.user_id) || []
  const { data: investmentProfiles } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email')
    .in('user_id', investmentUserIds)

  const activeInvestments = investmentAgg?.filter(i => i.status === 'active') || []
  const totalInvested = activeInvestments.reduce((s, i) => s + Number(i.amount), 0)
  const totalSharesSold = activeInvestments.reduce((s, i) => s + (Number(i.shares_purchased) || 0), 0)

  // Calculate shares sold per plan
  const planSharesMap: Record<string, number> = {}
  const pendingPlanSharesMap: Record<string, number> = {}
  allInvestments?.forEach((inv: { plan_id: string; shares_purchased: number; status: string }) => {
    if (inv.status === 'active') {
      planSharesMap[inv.plan_id] = (planSharesMap[inv.plan_id] || 0) + inv.shares_purchased
    } else if (inv.status === 'pending') {
      pendingPlanSharesMap[inv.plan_id] = (pendingPlanSharesMap[inv.plan_id] || 0) + inv.shares_purchased
    }
  })

  // Calculate per-plan share breakdown
  const planBreakdown = (plans || []).map((plan) => {
    const totalShares = plan.total_shares || 150
    const ownerShares = Math.floor(totalShares * (plan.owner_share_percentage / 100))
    const soldShares = planSharesMap[plan.id] || 0
    const pendingShares = pendingPlanSharesMap[plan.id] || 0
    const availableShares = Math.max(0, totalShares - ownerShares - soldShares - pendingShares)
    const investorShares = Math.max(0, totalShares - ownerShares)
    const soldPercentage = totalShares > 0 ? (soldShares / totalShares) * 100 : 0
    const pendingPercentage = totalShares > 0 ? (pendingShares / totalShares) * 100 : 0
    const ownerPercentage = totalShares > 0 ? (ownerShares / totalShares) * 100 : 0
    
    return {
      ...plan,
      totalShares,
      ownerShares,
      soldShares,
      pendingShares,
      availableShares,
      investorShares,
      soldPercentage,
      pendingPercentage,
      ownerPercentage,
    }
  })

  return (
    <AdminDashboardClient
      totalInvestors={totalInvestors || 0}
      totalInvested={totalInvested}
      totalSharesSold={totalSharesSold}
      pendingKYC={pendingKYC || 0}
      pendingShareRequests={pendingShareRequests || 0}
      pendingPaymentVerifications={pendingPaymentVerifications || 0}
      planBreakdown={planBreakdown}
      recentKYC={recentKYC || []}
      recentInvestments={recentInvestments || []}
      kycProfiles={(kycProfiles as ProfileSummary[]) || []}
      investmentProfiles={(investmentProfiles as ProfileSummary[]) || []}
    />
  )
}
