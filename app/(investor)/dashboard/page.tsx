import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, Wallet, Clock, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'

export default async function InvestorDashboardPage() {
  const supabase = await createClient()
  const authData = await supabase.auth.getUser()
  const user = authData.data.user
  if (!user) redirect(ROUTES.LOGIN)

  // Fetch profile and KYC status
  const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('user_id', user.id).maybeSingle()
  const { data: kyc } = await supabase.from('kyc_submissions').select('status').eq('user_id', user.id).maybeSingle()
  const { data: investments } = await supabase.from('investments').select('*, plan:investment_plans(name, roi_percentage)').eq('user_id', user.id).order('created_at', { ascending: false })

  const totalInvested = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + Number(i.amount), 0) || 0
  const totalROI = investments?.reduce((sum, i) => sum + Number(i.actual_roi), 0) || 0
  const activeCount = investments?.filter(i => i.status === 'active').length || 0
  const pendingCount = investments?.filter(i => i.status === 'pending').length || 0

  const kycStatus = kyc?.status || 'not_submitted'
  const kycAlertColors: Record<string, string> = {
    not_submitted: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    pending: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    rejected: 'bg-red-500/10 border-red-500/20 text-red-400',
    approved: 'bg-green-500/10 border-green-500/20 text-green-400',
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {profile?.full_name?.split(' ')[0] || 'Investor'} 👋</h1>
          <p className="page-subtitle">Here&apos;s an overview of your investment portfolio</p>
        </div>
        <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary">
          <TrendingUp className="h-4 w-4" /> Invest Now
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
              {kycStatus === 'not_submitted' && 'Complete your KYC to start investing.'}
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
        {[
          { label: 'Total Invested', value: formatCurrency(totalInvested), icon: Wallet, color: 'green', sub: 'Active investments' },
          { label: 'Total Earnings', value: formatCurrency(totalROI), icon: TrendingUp, color: 'emerald', sub: 'Lifetime ROI received' },
          { label: 'Active Plans', value: String(activeCount), icon: CheckCircle, color: 'teal', sub: 'Currently running' },
          { label: 'Pending', value: String(pendingCount), icon: Clock, color: 'yellow', sub: 'Awaiting approval' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-${color}-500/10`}>
                <Icon className={`h-4.5 w-4.5 text-${color}-400`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Investments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Investments</h2>
          <Link href={ROUTES.INVESTOR_INVESTMENTS} className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {!investments || investments.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No investments yet</p>
            <p className="text-slate-600 text-xs mt-1">Start your investment journey today</p>
            <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary mt-4 inline-flex">Browse Plans</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>ROI</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {investments.slice(0, 5).map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-medium text-white">{(inv.plan as {name: string})?.name}</td>
                    <td>{formatCurrency(Number(inv.amount))}</td>
                    <td className="text-green-400">{(inv.plan as {roi_percentage: number})?.roi_percentage}%/yr</td>
                    <td>
                      <span className={
                        inv.status === 'active' ? 'badge-green' :
                        inv.status === 'pending' ? 'badge-yellow' :
                        inv.status === 'completed' ? 'badge-blue' : 'badge-red'
                      }>{inv.status}</span>
                    </td>
                    <td className="text-slate-400">{formatDate(inv.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
