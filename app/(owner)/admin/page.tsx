import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Users, TrendingUp, Clock, ShieldCheck, ArrowRight, DollarSign, Layers } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'

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
    { count: approvedKYC },
    { data: recentKYC },
    { data: recentInvestments },
    { data: investmentAgg },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
    supabase.from('kyc_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('kyc_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('kyc_submissions').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
    supabase.from('investments').select('*, plan:investment_plans(name, shares_per_amount)').order('created_at', { ascending: false }).limit(5),
    supabase.from('investments').select('amount, shares_purchased, status'),
  ])

  // Fetch profiles for KYC submissions
  const kycUserIds = recentKYC?.map(k => k.user_id) || []
  const { data: kycProfiles } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email')
    .in('user_id', kycUserIds)
  const kycProfileMap = new Map((kycProfiles as ProfileSummary[] | null)?.map((p) => [p.user_id, p]) || [])

  // Fetch profiles for investments
  const investmentUserIds = recentInvestments?.map(i => i.user_id) || []
  const { data: investmentProfiles } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email')
    .in('user_id', investmentUserIds)
  const investmentProfileMap = new Map((investmentProfiles as ProfileSummary[] | null)?.map((p) => [p.user_id, p]) || [])

  const activeInvestments = investmentAgg?.filter(i => i.status === 'active') || []
  const totalInvested = activeInvestments.reduce((s, i) => s + Number(i.amount), 0)
  const totalSharesSold = activeInvestments.reduce((s, i) => s + (Number(i.shares_purchased) || 0), 0)

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Owner Dashboard</h1>
          <p className="page-subtitle">Platform share allocation, capital overview, and verification queue</p>
        </div>
        <div className="flex gap-3">
          <Link href={ROUTES.ADMIN_KYC} className="btn-secondary">Pending KYC ({pendingKYC || 0})</Link>
          <Link href={ROUTES.ADMIN_PLANS} className="btn-primary">+ New Plan</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Investors</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
              <Users className="h-4.5 w-4.5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{totalInvestors || 0}</p>
          <p className="text-xs text-slate-500">Registered investor accounts</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Invested</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <DollarSign className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
          <p className="text-xs text-slate-500">Active portfolio capital</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Shares Allocated</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10">
              <Layers className="h-4.5 w-4.5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{totalSharesSold} <span className="text-sm font-normal text-slate-400">shares</span></p>
          <p className="text-xs text-slate-500">Total active shares purchased</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Pending KYC</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10">
              <Clock className="h-4.5 w-4.5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{pendingKYC || 0}</p>
          <p className="text-xs text-slate-500">Awaiting document verification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending KYC */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Pending KYC Verification</h2>
            <Link href={ROUTES.ADMIN_KYC} className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {!recentKYC || recentKYC.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No pending KYC submissions</div>
          ) : (
            <div className="space-y-3">
              {recentKYC.map((k) => {
                const userProfile = kycProfileMap.get(k.user_id) as { full_name?: string; email?: string } | undefined
                return (
                  <div key={k.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-bold flex-shrink-0">
                      {userProfile?.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{userProfile?.full_name || k.full_name}</p>
                      <p className="text-xs text-slate-500">{formatDate(k.created_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${k.id}`} className="text-xs text-green-400 hover:underline font-medium">Review →</Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Investments */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Share Purchases</h2>
            <Link href={ROUTES.ADMIN_INVESTMENTS} className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {!recentInvestments || recentInvestments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No investments recorded yet</div>
          ) : (
            <div className="space-y-3">
              {recentInvestments.map((inv) => {
                const userProfile = investmentProfileMap.get(inv.user_id) as { full_name?: string; email?: string } | undefined
                const plan = inv.plan as { name?: string; shares_per_amount?: number } | null
                return (
                  <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{userProfile?.full_name || 'Unknown Investor'}</p>
                      <p className="text-xs text-slate-400">
                        {plan?.name || 'Unknown Plan'} · <span className="font-mono text-emerald-400">{inv.shares_purchased || 0} shares</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{formatCurrency(Number(inv.amount))}</p>
                      <span className={inv.status === 'active' ? 'badge-green text-xs' : 'badge-yellow text-xs'}>{inv.status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
