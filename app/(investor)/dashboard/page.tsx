import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCurrency, formatDate, isPlanCurrentlyActive } from '@/lib/utils'
import { TrendingUp, Wallet, Clock, ArrowRight, AlertCircle, Layers } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { InvestmentStatusNotice } from '@/components/features/investments/investment-status-notice'

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
  const kycAlertColors: Record<string, string> = {
    not_submitted: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    pending: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    rejected: 'bg-red-500/10 border-red-500/20 text-red-400',
    approved: 'bg-green-500/10 border-green-500/20 text-green-400',
  }

  return (
    <div className="fade-in space-y-8">
      <InvestmentStatusNotice notification={latestNotification} />
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {profile?.full_name?.split(' ')[0] || 'Investor'} 👋</h1>
          <p className="page-subtitle">Here&apos;s an overview of your share portfolio and returns</p>
        </div>
        <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary">
          <TrendingUp className="h-4 w-4" /> Buy Shares Now
        </Link>
      </div>

      {/* KYC Alert */}
      {kycStatus !== 'approved' && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${kycAlertColors[kycStatus]}`}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">
              {kycStatus === 'not_submitted' && 'KYC Verification Required'}
              {kycStatus === 'pending' && 'KYC Under Review'}
              {kycStatus === 'rejected' && 'KYC Rejected — Resubmission Required'}
            </p>
            <p className="text-xs opacity-80 mt-0.5">
              {kycStatus === 'not_submitted' && 'Complete your KYC verification to purchase farm shares.'}
              {kycStatus === 'pending' && 'Your documents are being reviewed. This takes up to 24 hours.'}
              {kycStatus === 'rejected' && 'Your KYC was rejected. Please review and resubmit.'}
            </p>
          </div>
          {kycStatus !== 'pending' && (
            <Link href={ROUTES.INVESTOR_KYC} className="text-xs font-medium whitespace-nowrap hover:underline">
              {kycStatus === 'not_submitted' ? 'Complete KYC →' : 'Resubmit →'}
            </Link>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Invested</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
              <Wallet className="h-4.5 w-4.5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
          <p className="text-xs text-slate-500">Active portfolio value</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Shares Owned</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <Layers className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {totalSharesOwned}{' '}
            <span className="text-sm font-normal text-slate-400">shares</span>
          </p>
          <p className="text-xs text-slate-500">{totalAvailableShares} shares available across plans</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Earnings</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10">
              <TrendingUp className="h-4.5 w-4.5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalROI)}</p>
          <p className="text-xs text-slate-500">Lifetime ROI received</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Pending Requests</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10">
              <Clock className="h-4.5 w-4.5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
          <p className="text-xs text-slate-500">Awaiting approval</p>
        </div>
      </div>

      {/* Recent Investments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-white">Recent Share Purchases</h2>
            <p className="text-xs text-slate-500">Your latest investment plan subscriptions</p>
          </div>
          <Link href={ROUTES.INVESTOR_INVESTMENTS} className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!investments || investments.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No share investments yet</p>
            <p className="text-slate-600 text-xs mt-1">Start building your agricultural share portfolio today</p>
            <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary mt-4 inline-flex">Browse Plans</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Shares Purchased</th>
                  <th>Total Amount</th>
                  <th>Expected ROI</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.slice(0, 5).map((inv) => {
                  const plan = inv.plan as { name?: string; roi_percentage?: number; shares_per_amount?: number; total_shares?: number; owner_share_percentage?: number } | null
                  const totalShares = plan ? Number(plan.total_shares) : 150
                  const ownerShares = plan ? Math.floor(totalShares * (Number(plan.owner_share_percentage) / 100)) : 0
                  const investorShares = totalShares - ownerShares
                  const soldShares = planSharesSold[inv.plan_id] || 0
                  const availableShares = Math.max(0, investorShares - soldShares)
                  return (
                    <tr key={inv.id}>
                      <td className="font-medium text-white">{plan?.name || 'Unknown Plan'}</td>
                      <td>
                        <span className="font-mono font-semibold text-emerald-400">
                          {inv.shares_purchased || 0}
                        </span>{' '}
                        <span className="text-xs text-slate-500">
                          / {availableShares} available
                        </span>
                      </td>
                      <td className="font-medium text-white">{formatCurrency(Number(inv.amount))}</td>
                      <td className="text-green-400 font-medium">{plan?.roi_percentage || 0}%/yr</td>
                      <td>
                        <span className={
                          inv.status === 'active' ? 'badge-green' :
                          inv.status === 'pending' ? 'badge-yellow' :
                          inv.status === 'completed' ? 'badge-blue' : 'badge-red'
                        }>{inv.status}</span>
                      </td>
                      <td className="text-slate-400">{formatDate(inv.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
