'use client'

import Link from 'next/link'
import { Users, TrendingUp, Clock, ArrowRight, DollarSign, Layers, FileClock, ReceiptText } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'

type ProfileSummary = {
  user_id: string
  full_name: string | null
  email: string | null
}

interface AdminDashboardClientProps {
  totalInvestors: number
  totalInvested: number
  totalSharesSold: number
  pendingKYC: number
  pendingShareRequests: number
  pendingPaymentVerifications: number
  planBreakdown: any[]
  recentKYC: any[]
  recentInvestments: any[]
  kycProfiles: ProfileSummary[]
  investmentProfiles: ProfileSummary[]
}

export function AdminDashboardClient({
  totalInvestors,
  totalInvested,
  totalSharesSold,
  pendingKYC,
  pendingShareRequests,
  pendingPaymentVerifications,
  planBreakdown,
  recentKYC,
  recentInvestments,
  kycProfiles,
  investmentProfiles,
}: AdminDashboardClientProps) {
  const { lang, t } = useLanguage()

  const kycProfileMap = new Map((kycProfiles || []).map((p) => [p.user_id, p]))
  const investmentProfileMap = new Map((investmentProfiles || []).map((p) => [p.user_id, p]))

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {lang === 'bn' ? 'অ্যাডমিন ও ব্যবস্থাপনা ড্যাশবোর্ড' : 'Owner Dashboard'}
          </h1>
          <p className="page-subtitle">
            {lang === 'bn' ? 'প্ল্যাটফর্মের মূলধন, শেয়ার বণ্টন এবং কেওয়াইসি (KYC) যাচাইকরণ সারি' : 'Platform share allocation, capital overview, and verification queue'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={ROUTES.ADMIN_KYC} className="btn-secondary">
            {lang === 'bn' ? `অপেক্ষমাণ কেওয়াইসি (${pendingKYC || 0})` : `Pending KYC (${pendingKYC || 0})`}
          </Link>
          <Link href={ROUTES.ADMIN_PLANS} className="btn-primary">
            {lang === 'bn' ? '+ নতুন প্ল্যান যুক্ত করুন' : '+ New Plan'}
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{lang === 'bn' ? 'মোট বিনিয়োগকারী' : 'Total Investors'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <Users className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{totalInvestors || 0}</p>
          <p className="text-xs text-slate-500">{lang === 'bn' ? 'নিবন্ধিত অ্যাকাউন্ট' : 'Registered investor accounts'}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{lang === 'bn' ? 'সর্বমোট মূলধন' : 'Total Invested'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <DollarSign className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
          <p className="text-xs text-slate-500">{lang === 'bn' ? 'সক্রিয় পোর্টফোলিও মূলধন' : 'Active portfolio capital'}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{lang === 'bn' ? 'বিক্রিত মোট শেয়ার' : 'Shares Allocated'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10">
              <Layers className="h-4.5 w-4.5 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {totalSharesSold} <span className="text-sm font-normal text-slate-400">{lang === 'bn' ? 'টি শেয়ার' : 'shares'}</span>
          </p>
          <p className="text-xs text-slate-500">{lang === 'bn' ? 'অনুমোদিত মোট শেয়ার' : 'Total active shares purchased'}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{lang === 'bn' ? 'অপেক্ষমাণ কেওয়াইসি' : 'Pending KYC'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10">
              <Clock className="h-4.5 w-4.5 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{pendingKYC || 0}</p>
          <p className="text-xs text-slate-500">{lang === 'bn' ? 'নথিপত্র নিরীক্ষার অপেক্ষায়' : 'Awaiting document verification'}</p>
        </div>

        <Link href={ROUTES.ADMIN_INVESTMENTS} className="stat-card transition-colors hover:border-amber-500/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{lang === 'bn' ? 'শেয়ার আবেদন' : 'Pending Share Requests'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
              <FileClock className="h-4.5 w-4.5 text-amber-400" aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{pendingShareRequests || 0}</p>
          <p className="text-xs text-slate-500">{lang === 'bn' ? 'মালিকের পর্যালোচনার অপেক্ষায়' : 'Awaiting owner allocation review'}</p>
        </Link>

        <Link href={ROUTES.ADMIN_INVESTMENTS} className="stat-card transition-colors hover:border-emerald-500/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{lang === 'bn' ? 'পেমেন্ট যাচাইকরণ' : 'Payment Verification'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <ReceiptText className="h-4.5 w-4.5 text-emerald-400" aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{pendingPaymentVerifications || 0}</p>
          <p className="text-xs text-slate-500">{lang === 'bn' ? 'ব্যাংক রসিদ যাচাইকরণ' : 'Receipts awaiting bank verification'}</p>
        </Link>
      </div>

      {/* Per-Plan Share Breakdown */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            {lang === 'bn' ? 'প্ল্যান অনুযায়ী শেয়ার বন্টন বিবরণী' : 'Plan-wise Share Allocation'}
          </h2>
          <Link href={ROUTES.ADMIN_PLANS} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            {lang === 'bn' ? 'প্ল্যান পরিচালনা করুন' : 'Manage Plans'} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {!planBreakdown || planBreakdown.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            {lang === 'bn' ? 'কোনো সক্রিয় বিনিয়োগ প্ল্যান নেই' : 'No active investment plans'}
          </div>
        ) : (
          <div className="space-y-4">
            {planBreakdown.map((plan) => {
              const almostFull = plan.availableShares <= Math.ceil(plan.investorShares * 0.2)
              const isFull = plan.availableShares === 0
              return (
                <div key={plan.id} className="p-4 rounded-xl bg-slate-800/40 border border-white/5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white text-sm">{plan.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {plan.roi_percentage}% {lang === 'bn' ? 'লভ্যাংশ' : 'ROI'} · {plan.duration_months} {lang === 'bn' ? 'মাস' : 'months'}
                      </p>
                    </div>
                    <span className={`text-xs font-medium ${isFull ? 'text-red-400' : almostFull ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {lang === 'bn' ? `পর্যালোচনা শেষে ${plan.availableShares} টি শেয়ার অবশিষ্ট` : `${plan.availableShares} available after review`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">{lang === 'bn' ? 'মোট শেয়ার' : 'Total'}</span>
                      <span className="text-white font-medium">{plan.totalShares}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{lang === 'bn' ? 'উদ্যোক্তা অংশ' : 'Owner'}</span>
                      <span className="text-purple-400 font-medium">{plan.ownerShares}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{lang === 'bn' ? 'বিক্রিত শেয়ার' : 'Sold'}</span>
                      <span className="text-emerald-400 font-medium">{plan.soldShares}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{lang === 'bn' ? 'প্রক্রিয়াধীন' : 'Pending'}</span>
                      <span className="text-amber-400 font-medium">{plan.pendingShares}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{lang === 'bn' ? 'অবশিষ্ট উন্মুক্ত' : 'Available'}</span>
                      <span className="text-emerald-400 font-medium">{plan.availableShares}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-slate-700 flex" aria-label={`${plan.name}: ${plan.ownerShares} owner shares, ${plan.soldShares} sold shares, ${plan.pendingShares} pending shares, ${plan.availableShares} available shares`}>
                    <div className="h-full bg-purple-500" style={{ width: `${plan.ownerPercentage}%` }} title={`Owner: ${plan.ownerShares} shares`} />
                    <div className="h-full bg-emerald-500" style={{ width: `${plan.soldPercentage}%` }} title={`Sold: ${plan.soldShares} shares`} />
                    <div className="h-full bg-amber-400" style={{ width: `${plan.pendingPercentage}%` }} title={`Pending review: ${plan.pendingShares} shares`} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">
                      {plan.pendingShares > 0
                        ? (lang === 'bn' ? `${plan.pendingShares} টি শেয়ার পর্যালোচনার অপেক্ষায়` : `${plan.pendingShares} shares await owner review`)
                        : (lang === 'bn' ? `মোট শেয়ারের ${Math.round(plan.soldPercentage)}% বিক্রিত` : `${Math.round(plan.soldPercentage)}% of total shares sold`)}
                    </span>
                    {isFull && (
                      <span className="text-red-400 font-medium">{lang === 'bn' ? 'সম্পূর্ণ বরাদ্দ সম্পন্ন' : 'Fully Subscribed'}</span>
                    )}
                    {almostFull && !isFull && (
                      <span className="text-orange-400 font-medium">{lang === 'bn' ? 'সীমিত শেয়ার অবশিষ্ট' : 'Limited Availability'}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending KYC */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{lang === 'bn' ? 'অপেক্ষমাণ কেওয়াইসি (KYC) যাচাইকরণ' : 'Pending KYC Verification'}</h2>
            <Link href={ROUTES.ADMIN_KYC} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              {lang === 'bn' ? 'সব দেখুন' : 'View all'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {!recentKYC || recentKYC.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              {lang === 'bn' ? 'কোনো অপেক্ষমাণ কেওয়াইসি জমা নেই' : 'No pending KYC submissions'}
            </div>
          ) : (
            <div className="space-y-3">
              {recentKYC.map((k) => {
                const userProfile = kycProfileMap.get(k.user_id)
                return (
                  <div key={k.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-bold flex-shrink-0">
                      {userProfile?.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{userProfile?.full_name || k.full_name}</p>
                      <p className="text-xs text-slate-500">{formatDate(k.created_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${k.id}`} className="text-xs text-emerald-400 hover:underline font-medium">
                      {lang === 'bn' ? 'নিরীক্ষা করুন →' : 'Review →'}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Investments */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{lang === 'bn' ? 'সাম্প্রতিক শেয়ার ক্রয়' : 'Recent Share Purchases'}</h2>
            <Link href={ROUTES.ADMIN_INVESTMENTS} className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              {lang === 'bn' ? 'সব দেখুন' : 'View all'} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {!recentInvestments || recentInvestments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              {lang === 'bn' ? 'এখনও কোনো বিনিয়োগ রেকর্ড করা হয়নি' : 'No investments recorded yet'}
            </div>
          ) : (
            <div className="space-y-3">
              {recentInvestments.map((inv) => {
                const userProfile = investmentProfileMap.get(inv.user_id)
                const plan = inv.plan as { name?: string; shares_per_amount?: number } | null
                return (
                  <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{userProfile?.full_name || (lang === 'bn' ? 'বিনিয়োগকারী' : 'Unknown Investor')}</p>
                      <p className="text-xs text-slate-400">
                        {plan?.name || (lang === 'bn' ? 'নির্ধারিত প্ল্যান' : 'Unknown Plan')} · <span className="font-mono text-emerald-400">{inv.shares_purchased || 0} {lang === 'bn' ? 'টি শেয়ার' : 'shares'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{formatCurrency(Number(inv.amount))}</p>
                      <span className={inv.status === 'active' ? 'badge-primary text-xs' : 'badge-yellow text-xs'}>
                        {lang === 'bn' ? (inv.status === 'active' ? 'সক্রিয়' : 'অপেক্ষমাণ') : inv.status}
                      </span>
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
