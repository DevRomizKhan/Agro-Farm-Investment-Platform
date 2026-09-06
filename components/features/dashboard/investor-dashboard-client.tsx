'use client'

import Link from 'next/link'
import { TrendingUp, Wallet, Clock, ArrowRight, AlertCircle, Layers } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import { InvestmentStatusNotice } from '@/components/features/investments/investment-status-notice'
import { useLanguage } from '@/lib/i18n/context'
import { PlanRealtimeRefresh } from '@/components/realtime/plan-realtime-refresh'

interface InvestorDashboardClientProps {
  profileName?: string
  kycStatus: string
  latestNotification: any
  totalInvested: number
  totalSharesOwned: number
  totalROI: number
  pendingCount: number
  totalAvailableShares: number
  investments: any[]
  planSharesSold: Record<string, number>
}

export function InvestorDashboardClient({
  profileName,
  kycStatus,
  latestNotification,
  totalInvested,
  totalSharesOwned,
  totalROI,
  pendingCount,
  totalAvailableShares,
  investments,
  planSharesSold,
}: InvestorDashboardClientProps) {
  const { lang, t } = useLanguage()

  const kycAlertColors: Record<string, string> = {
    not_submitted: 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#FBBF24]',
    pending: 'bg-[#10b981]/10 border-[#10b981]/20 text-[#34d399]',
    rejected: 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#F87171]',
    approved: 'bg-[#10b981]/10 border-[#10b981]/20 text-[#34d399]',
  }

  return (
    <div className="fade-in space-y-8">
      <PlanRealtimeRefresh />
      <InvestmentStatusNotice notification={latestNotification} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {lang === 'bn' ? `আপনাকে পুনরায় স্বাগতম, ${profileName || 'বিনিয়োগকারী'} 👋` : `Welcome back, ${profileName || 'Investor'} 👋`}
          </h1>
          <p className="page-subtitle">
            {lang === 'bn' ? 'আপনার শেয়ার পোর্টফোলিও এবং অর্জিত নিট লভ্যাংশের তথ্য' : "Here's an overview of your share portfolio and returns"}
          </p>
        </div>
        <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary">
          <TrendingUp className="h-4 w-4" />
          {lang === 'bn' ? 'এখনই শেয়ার কিনুন' : 'Buy Shares Now'}
        </Link>
      </div>

      {/* KYC Alert */}
      {kycStatus !== 'approved' && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${kycAlertColors[kycStatus]}`}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">
              {lang === 'bn' ? (
                kycStatus === 'not_submitted' ? 'কেওয়াইসি (KYC) পরিচয় যাচাইকরণ প্রয়োজন' :
                kycStatus === 'pending' ? 'কেওয়াইসি যাচাইকরণ প্রক্রিয়াধীন রয়েছে' :
                'কেওয়াইসি বাতিল হয়েছে — পুনরায় জমা দিন'
              ) : (
                kycStatus === 'not_submitted' ? 'KYC Verification Required' :
                kycStatus === 'pending' ? 'KYC Under Review' :
                'KYC Rejected — Resubmission Required'
              )}
            </p>
            <p className="text-xs opacity-80 mt-0.5">
              {lang === 'bn' ? (
                kycStatus === 'not_submitted' ? 'খামারের শেয়ার ক্রয় করতে আপনার এনআইডি (NID) ও তথ্য জমা দিন।' :
                kycStatus === 'pending' ? 'আপনার জমা দেয়া নথিপত্র আমাদের টিম যাচাই করছে। সময় লাগতে পারে ২৪ ঘণ্টা।' :
                'তথ্যগত অমিলের কারণে কেওয়াইসি বাতিল হয়েছে। সঠিক নথিপত্র পুনরায় জমা দিন।'
              ) : (
                kycStatus === 'not_submitted' ? 'Complete your KYC verification to purchase farm shares.' :
                kycStatus === 'pending' ? 'Your documents are being reviewed. This takes up to 24 hours.' :
                'Your KYC was rejected. Please review and resubmit.'
              )}
            </p>
          </div>
          {kycStatus !== 'pending' && (
            <Link href={ROUTES.INVESTOR_KYC} className="text-xs font-medium whitespace-nowrap hover:underline">
              {lang === 'bn' ? (kycStatus === 'not_submitted' ? 'কেওয়াইসি জমা দিন →' : 'পুনরায় জমা দিন →') : (kycStatus === 'not_submitted' ? 'Complete KYC →' : 'Resubmit →')}
            </Link>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#94a3b8]">{lang === 'bn' ? 'সর্বমোট বিনিয়োগ' : 'Total Invested'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10b981]/10">
              <Wallet className="h-4.5 w-4.5 text-[#34d399]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#f1f5f9]">{formatCurrency(totalInvested)}</p>
          <p className="text-xs text-[#64748b]">{lang === 'bn' ? 'সক্রিয় পোর্টফোলিও মূল্য' : 'Active portfolio value'}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#94a3b8]">{lang === 'bn' ? 'মালিকানাধীন শেয়ার' : 'Shares Owned'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14B8A6]/10">
              <Layers className="h-4.5 w-4.5 text-[#2DD4BF]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#f1f5f9] font-mono">
            {totalSharesOwned}{' '}
            <span className="text-sm font-normal text-[#94a3b8]">{lang === 'bn' ? 'টি শেয়ার' : 'shares'}</span>
          </p>
          <p className="text-xs text-[#64748b]">
            {lang === 'bn' ? `উন্মুক্ত প্ল্যানগুলোতে ${totalAvailableShares} টি শেয়ার অবশিষ্ট` : `${totalAvailableShares} shares available across plans`}
          </p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#94a3b8]">{lang === 'bn' ? 'সর্বমোট অর্জিত লভ্যাংশ' : 'Total Earnings'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6366F1]/10">
              <TrendingUp className="h-4.5 w-4.5 text-[#818CF8]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#f1f5f9]">{formatCurrency(totalROI)}</p>
          <p className="text-xs text-[#64748b]">{lang === 'bn' ? 'প্রাপ্ত বাৎসরিক নিট লভ্যাংশ' : 'Lifetime ROI received'}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#94a3b8]">{lang === 'bn' ? 'অপেক্ষমাণ আবেদন' : 'Pending Requests'}</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <Clock className="h-4.5 w-4.5 text-[#FBBF24]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#f1f5f9]">{pendingCount}</p>
          <p className="text-xs text-[#64748b]">{lang === 'bn' ? 'অনুমোদনের অপেক্ষায়' : 'Awaiting approval'}</p>
        </div>
      </div>

      {/* Recent Investments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-[#f1f5f9]">{lang === 'bn' ? 'সাম্প্রতিক শেয়ার ক্রয় বিবরণী' : 'Recent Share Purchases'}</h2>
            <p className="text-xs text-[#64748b]">{lang === 'bn' ? 'আপনার সর্বশেষ শেয়ার প্যাকেজ ক্রয়ের তালিকা' : 'Your latest investment plan subscriptions'}</p>
          </div>
          <Link href={ROUTES.INVESTOR_INVESTMENTS} className="text-sm text-[#10b981] hover:text-[#94a3b8] flex items-center gap-1">
            {lang === 'bn' ? 'সব দেখুন' : 'View all'} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {!investments || investments.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-10 w-10 text-[#64748b] mx-auto mb-3" />
            <p className="text-[#94a3b8] text-sm">{lang === 'bn' ? 'এখনও কোনো শেয়ার ক্রয় করা হয়নি' : 'No share investments yet'}</p>
            <p className="text-[#64748b] text-xs mt-1">{lang === 'bn' ? 'আজই আপনার হালাল কৃষি বিনিয়োগ সফর শুরু করুন' : 'Start building your agricultural share portfolio today'}</p>
            <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary mt-4 inline-flex">
              {lang === 'bn' ? 'প্ল্যানসমূহ দেখুন' : 'Browse Plans'}
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>{lang === 'bn' ? 'প্ল্যানের নাম' : 'Plan Name'}</th>
                  <th>{lang === 'bn' ? 'ক্রয়কৃত শেয়ার' : 'Shares Purchased'}</th>
                  <th>{lang === 'bn' ? 'মোট পরিমাণ' : 'Total Amount'}</th>
                  <th>{lang === 'bn' ? 'আনুমানিক লভ্যাংশ' : 'Expected ROI'}</th>
                  <th>{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  <th>{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
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
                      <td className="font-medium text-[#f1f5f9]">{plan?.name || (lang === 'bn' ? 'নির্ধারিত প্ল্যান' : 'Unknown Plan')}</td>
                      <td>
                        <span className="font-mono font-semibold text-[#10b981]">
                          {inv.shares_purchased || 0} {lang === 'bn' ? 'টি' : ''}
                        </span>{' '}
                        <span className="text-xs text-[#64748b]">
                          / {availableShares} {lang === 'bn' ? 'টি অবশিষ্ট' : 'available'}
                        </span>
                      </td>
                      <td className="font-medium text-[#f1f5f9]">{formatCurrency(Number(inv.amount))}</td>
                      <td className="text-[#10b981] font-medium">{plan?.roi_percentage || 0}% / {lang === 'bn' ? 'বছর' : 'yr'}</td>
                      <td>
                        <span className={
                          inv.status === 'active' ? 'badge-primary' :
                          inv.status === 'pending' ? 'badge-yellow' :
                          inv.status === 'completed' ? 'badge-green' : 'badge-red'
                        }>
                          {lang === 'bn' ? (
                            inv.status === 'active' ? 'সক্রিয়' :
                            inv.status === 'pending' ? 'অপেক্ষমাণ' :
                            inv.status === 'completed' ? 'সম্পন্ন' : 'বাতিল'
                          ) : inv.status}
                        </span>
                      </td>
                      <td className="text-[#94a3b8]">{formatDate(inv.created_at)}</td>
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
