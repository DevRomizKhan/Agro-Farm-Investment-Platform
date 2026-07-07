import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BarChart3, TrendingUp, Users, DollarSign, Download, Calendar } from 'lucide-react'
import { ROUTES } from '@/constants'
import { ExportReportButton } from './export-report-button'
import { ReportCharts } from './report-charts'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch report data
  const [
    { data: investments },
    { count: totalInvestors },
    { data: kycData },
  ] = await Promise.all([
    supabase.from('investments').select('amount, status, created_at, expected_roi, actual_roi').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
    supabase.from('kyc_submissions').select('status'),
  ])

  // Calculate metrics
  const totalInvested = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + Number(i.amount), 0) || 0
  const totalExpectedROI = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + Number(i.expected_roi), 0) || 0
  const totalActualROI = investments?.reduce((sum, i) => sum + Number(i.actual_roi || 0), 0) || 0
  const activeInvestments = investments?.filter(i => i.status === 'active').length || 0
  const completedInvestments = investments?.filter(i => i.status === 'completed').length || 0
  const pendingInvestments = investments?.filter(i => i.status === 'pending').length || 0

  const approvedKYC = kycData?.filter(k => k.status === 'approved').length || 0
  const pendingKYC = kycData?.filter(k => k.status === 'pending').length || 0

  // Monthly investment data (last 6 months) - excluding pending investments
  const monthlyData = investments?.filter(i => i.status !== 'pending').reduce((acc, inv) => {
    const month = new Date(inv.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!acc[month]) acc[month] = { invested: 0, count: 0 }
    acc[month].invested += Number(inv.amount)
    acc[month].count += 1
    return acc
  }, {} as Record<string, { invested: number; count: number }>) || {}

  const recentMonths = Object.entries(monthlyData).slice(-6).reverse()

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Platform performance metrics and financial overview</p>
        </div>
        <ExportReportButton
          totalInvested={totalInvested}
          totalExpectedROI={totalExpectedROI}
          totalActualROI={totalActualROI}
          activeInvestments={activeInvestments}
          completedInvestments={completedInvestments}
          pendingInvestments={pendingInvestments}
          totalInvestors={totalInvestors || 0}
          approvedKYC={approvedKYC}
          pendingKYC={pendingKYC}
          monthlyData={recentMonths}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Invested</span>
            <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-4.5 w-4.5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
          <p className="text-xs text-slate-500">Across {activeInvestments} active plans</p>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Expected ROI</span>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalExpectedROI)}</p>
          <p className="text-xs text-slate-500">Projected returns</p>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Investors</span>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-4.5 w-4.5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{totalInvestors || 0}</p>
          <p className="text-xs text-slate-500">{approvedKYC} verified</p>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">ROI Paid</span>
            <div className="h-9 w-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <BarChart3 className="h-4.5 w-4.5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalActualROI)}</p>
          <p className="text-xs text-slate-500">Actual returns paid</p>
        </div>
      </div>

      {/* Investment Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-400" />
            Investment Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-slate-300">Active</span>
              </div>
              <span className="text-white font-medium">{activeInvestments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-300">Completed</span>
              </div>
              <span className="text-white font-medium">{completedInvestments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-slate-300">Pending</span>
              </div>
              <span className="text-white font-medium">{pendingInvestments}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-400" />
            KYC Verification Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-slate-300">Approved</span>
              </div>
              <span className="text-white font-medium">{approvedKYC}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-slate-300">Pending Review</span>
              </div>
              <span className="text-white font-medium">{pendingKYC}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphical Charts */}
      <ReportCharts
        activeInvestments={activeInvestments}
        completedInvestments={completedInvestments}
        pendingInvestments={pendingInvestments}
        approvedKYC={approvedKYC}
        pendingKYC={pendingKYC}
        monthlyData={recentMonths}
      />

      {/* Monthly Investment Trend */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-400" />
          Monthly Investment Trend
        </h2>
        {recentMonths.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No investment data available</p>
        ) : (
          <div className="space-y-3">
            {recentMonths.map(([month, data]) => (
              <div key={month} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div>
                  <p className="text-sm font-medium text-white">{month}</p>
                  <p className="text-xs text-slate-500">{data.count} investments</p>
                </div>
                <p className="text-white font-medium">{formatCurrency(data.invested)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
