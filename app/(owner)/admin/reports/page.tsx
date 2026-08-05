import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Mail, MessageSquare, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import type { ContactSubmission } from '@/types'
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
    { data: investorProfiles },
    { data: kycData },
    { data: plans },
    { data: contactSubmissions },
  ] = await Promise.all([
    supabase.from('investments').select('user_id, amount, status, created_at, expected_roi, actual_roi, shares_purchased, plan_id').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
    supabase.from('profiles').select('user_id, full_name, email').eq('role', 'investor'),
    supabase.from('kyc_submissions').select('user_id, status'),
    supabase.from('investment_plans').select('id, name, total_shares, shares_per_amount, owner_share_percentage'),
    supabase.from('contact_submissions').select('type, status'),
  ])

  const submissions = (contactSubmissions || []) as Pick<ContactSubmission, 'type' | 'status'>[]
  const subscribers = submissions.filter((submission) => submission.type === 'newsletter')
  const contactRequests = submissions.filter((submission) => submission.type === 'contact')
  const activeSubscribers = subscribers.filter((submission) => submission.status !== 'unsubscribed' && submission.status !== 'archived').length
  const newSubscribers = subscribers.filter((submission) => submission.status === 'new').length
  const openContacts = contactRequests.filter((submission) => submission.status === 'new' || submission.status === 'in_progress').length

  const investedByInvestor = new Map<string, number>()
  investments?.filter((investment) => investment.status === 'active').forEach((investment) => {
    investedByInvestor.set(investment.user_id, (investedByInvestor.get(investment.user_id) || 0) + Number(investment.amount))
  })
  const kycByInvestor = new Map((kycData || []).map((submission) => [submission.user_id, submission.status]))
  const investorDetails = (investorProfiles || [])
    .map((investor) => ({
      name: investor.full_name || investor.email || 'Unnamed investor',
      kycStatus: kycByInvestor.get(investor.user_id) || 'not_submitted',
      investedAmount: investedByInvestor.get(investor.user_id) || 0,
    }))
    .sort((left, right) => right.investedAmount - left.investedAmount)

  // Calculate metrics
  const totalInvested = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + Number(i.amount), 0) || 0
  const totalExpectedROI = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + Number(i.expected_roi), 0) || 0
  const totalActualROI = investments?.reduce((sum, i) => sum + Number(i.actual_roi || 0), 0) || 0
  const activeInvestments = investments?.filter(i => i.status === 'active').length || 0
  const completedInvestments = investments?.filter(i => i.status === 'completed').length || 0
  const pendingInvestments = investments?.filter(i => i.status === 'pending').length || 0

  // Share metrics
  const totalSharesSold = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + (Number(i.shares_purchased) || 0), 0) || 0
  const totalAvailableShares = plans?.reduce((sum, p) => sum + Number(p.total_shares), 0) || 0
  const totalOwnerShares = plans?.reduce((sum, p) => sum + Math.floor(Number(p.total_shares) * (Number(p.owner_share_percentage) / 100)), 0) || 0
  const totalInvestorShares = Math.max(0, totalAvailableShares - totalOwnerShares)
  // Available = Total - Owner Reserved - Sold
  const availableSharesForSale = Math.max(0, totalAvailableShares - totalOwnerShares - totalSharesSold)
  const shareUtilization = totalInvestorShares > 0 ? ((totalSharesSold / totalInvestorShares) * 100).toFixed(1) : '0'

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
          totalSharesSold={totalSharesSold}
          availableSharesForSale={availableSharesForSale}
          totalOwnerShares={totalOwnerShares}
          totalInvestorShares={totalInvestorShares}
          activeSubscribers={activeSubscribers}
          contactRequests={contactRequests.length}
          openContacts={openContacts}
          totalSubmissions={submissions.length}
        //investorDetails={investorDetails}
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
            <span className="text-sm text-slate-400">Shares Sold</span>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <BarChart3 className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{totalSharesSold} <span className="text-sm font-normal text-slate-400">shares</span></p>
          <p className="text-xs text-slate-500">{shareUtilization}% of investor shares</p>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Available Shares</span>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-4.5 w-4.5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{availableSharesForSale} <span className="text-sm font-normal text-slate-400">shares</span></p>
          <p className="text-xs text-slate-500">Remaining for investors</p>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">ROI Paid</span>
            <div className="h-9 w-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalActualROI)}</p>
          <p className="text-xs text-slate-500">Actual returns paid</p>
        </div>
      </div>

      {/* Audience & Contact Overview */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-white">
              <MessageSquare className="h-5 w-5 text-green-400" />
              Audience & Contact Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">Website enquiries and newsletter activity at a glance</p>
          </div>
          <Link href={ROUTES.ADMIN_SUBMISSIONS} className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300">
            Manage all submissions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Active subscribers</span><Mail className="h-4 w-4 text-emerald-400" /></div>
            <p className="mt-2 text-2xl font-bold text-white">{activeSubscribers}</p>
            <p className="mt-1 text-xs text-slate-500">{newSubscribers} new and awaiting follow-up</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Contact requests</span><MessageSquare className="h-4 w-4 text-blue-400" /></div>
            <p className="mt-2 text-2xl font-bold text-white">{contactRequests.length}</p>
            <p className="mt-1 text-xs text-slate-500">All-time website enquiries</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Open enquiries</span><Phone className="h-4 w-4 text-yellow-400" /></div>
            <p className="mt-2 text-2xl font-bold text-white">{openContacts}</p>
            <p className="mt-1 text-xs text-slate-500">New or in progress</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Total submissions</span><Users className="h-4 w-4 text-purple-400" /></div>
            <p className="mt-2 text-2xl font-bold text-white">{submissions.length}</p>
            <p className="mt-1 text-xs text-slate-500">Subscribers and contact forms</p>
          </div>
        </div>

      </section>

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
            Share Allocation
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-sm text-slate-300">Owner Shares</span>
              </div>
              <span className="text-white font-medium font-mono">{totalOwnerShares}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-slate-300">Investor Shares Sold</span>
              </div>
              <span className="text-white font-medium font-mono">{totalSharesSold}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-300">Available for Sale</span>
              </div>
              <span className="text-white font-medium font-mono">{availableSharesForSale}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Verification Status */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Users className="h-5 w-5 text-green-400" />
          KYC Verification Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm text-slate-300">Approved</span>
            </div>
            <span className="text-white font-medium">{approvedKYC}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-slate-300">Pending Review</span>
            </div>
            <span className="text-white font-medium">{pendingKYC}</span>
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
        totalSharesSold={totalSharesSold}
        availableSharesForSale={availableSharesForSale}
        totalOwnerShares={totalOwnerShares}
        activeSubscribers={activeSubscribers}
        contactRequests={contactRequests.length}
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
