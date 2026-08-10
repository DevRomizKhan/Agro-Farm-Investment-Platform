'use client'

import { formatCurrency } from '@/lib/utils'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Mail, MessageSquare, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'
import { ExportReportButton } from '@/app/(owner)/admin/reports/export-report-button'
import { ReportCharts } from '@/app/(owner)/admin/reports/report-charts'

interface AdminReportsClientProps {
  totalInvested: number
  totalExpectedROI: number
  totalActualROI: number
  activeInvestments: number
  completedInvestments: number
  pendingInvestments: number
  totalInvestors: number
  approvedKYC: number
  pendingKYC: number
  totalSharesSold: number
  availableSharesForSale: number
  totalOwnerShares: number
  totalInvestorShares: number
  shareUtilization: string
  activeSubscribers: number
  newSubscribers: number
  contactRequestsCount: number
  openContacts: number
  submissionsCount: number
  recentMonths: [string, { invested: number; count: number }][]
}

export function AdminReportsClient(props: AdminReportsClientProps) {
  const { lang } = useLanguage()
  const { totalInvested, totalActualROI, activeInvestments, completedInvestments, pendingInvestments, totalInvestors, approvedKYC, pendingKYC, totalSharesSold, availableSharesForSale, totalOwnerShares, totalInvestorShares, shareUtilization, activeSubscribers, newSubscribers, contactRequestsCount, openContacts, submissionsCount, recentMonths, totalExpectedROI } = props

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'রিপোর্ট ও বিশ্লেষণ' : 'Reports & Analytics'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'প্ল্যাটফর্মের কার্যক্ষমতা ও আর্থিক বিবরণী' : 'Platform performance metrics and financial overview'}</p>
        </div>
        <ExportReportButton totalInvested={totalInvested} totalExpectedROI={totalExpectedROI} totalActualROI={totalActualROI} activeInvestments={activeInvestments} completedInvestments={completedInvestments} pendingInvestments={pendingInvestments} totalInvestors={totalInvestors} approvedKYC={approvedKYC} pendingKYC={pendingKYC} monthlyData={recentMonths} totalSharesSold={totalSharesSold} availableSharesForSale={availableSharesForSale} totalOwnerShares={totalOwnerShares} totalInvestorShares={totalInvestorShares} activeSubscribers={activeSubscribers} contactRequests={contactRequestsCount} openContacts={openContacts} totalSubmissions={submissionsCount} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: lang === 'bn' ? 'সর্বমোট বিনিয়োগ' : 'Total Invested', value: formatCurrency(totalInvested), sub: lang === 'bn' ? `${activeInvestments} টি সক্রিয় বিনিয়োগে` : `Across ${activeInvestments} active plans`, Icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: lang === 'bn' ? 'বিক্রিত শেয়ার' : 'Shares Sold', value: `${totalSharesSold}`, unit: lang === 'bn' ? 'টি শেয়ার' : 'shares', sub: `${shareUtilization}% ${lang === 'bn' ? 'বিনিয়োগকারীর শেয়ারের' : 'of investor shares'}`, Icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: lang === 'bn' ? 'উপলব্ধ শেয়ার' : 'Available Shares', value: `${availableSharesForSale}`, unit: lang === 'bn' ? 'টি শেয়ার' : 'shares', sub: lang === 'bn' ? 'বিনিয়োগকারীদের জন্য বাকি' : 'Remaining for investors', Icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: lang === 'bn' ? 'প্রদত্ত লভ্যাংশ' : 'ROI Paid', value: formatCurrency(totalActualROI), sub: lang === 'bn' ? 'প্রকৃত প্রদত্ত রিটার্ন' : 'Actual returns paid', Icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-500/10' },
        ].map(({ label, value, unit, sub, Icon, color, bg }) => (
          <div key={label} className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{label}</span>
              <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center`}><Icon className={`h-4.5 w-4.5 ${color}`} /></div>
            </div>
            <p className="text-2xl font-bold text-white">{value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* Audience & Contact */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-white"><MessageSquare className="h-5 w-5 text-emerald-400" />{lang === 'bn' ? 'দর্শক ও যোগাযোগ পর্যালোচনা' : 'Audience & Contact Overview'}</h2>
            <p className="mt-1 text-sm text-slate-500">{lang === 'bn' ? 'ওয়েবসাইটে আসা অনুসন্ধান ও নিউজলেটার কার্যক্রমের সংক্ষিপ্ত বিবরণ' : 'Website enquiries and newsletter activity at a glance'}</p>
          </div>
          <Link href={ROUTES.ADMIN_SUBMISSIONS} className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300">
            {lang === 'bn' ? 'সব জমা দেখুন' : 'Manage all submissions'} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: lang === 'bn' ? 'সক্রিয় সাবস্ক্রাইবার' : 'Active subscribers', value: activeSubscribers, sub: `${newSubscribers} ${lang === 'bn' ? 'টি নতুন ও ফলোআপ বাকি' : 'new and awaiting follow-up'}`, Icon: Mail, color: 'text-emerald-400' },
            { label: lang === 'bn' ? 'যোগাযোগের অনুরোধ' : 'Contact requests', value: contactRequestsCount, sub: lang === 'bn' ? 'সর্বমোট ওয়েবসাইট অনুসন্ধান' : 'All-time website enquiries', Icon: MessageSquare, color: 'text-emerald-400' },
            { label: lang === 'bn' ? 'খোলা অনুসন্ধান' : 'Open enquiries', value: openContacts, sub: lang === 'bn' ? 'নতুন বা প্রক্রিয়াধীন' : 'New or in progress', Icon: Phone, color: 'text-yellow-400' },
            { label: lang === 'bn' ? 'মোট জমা' : 'Total submissions', value: submissionsCount, sub: lang === 'bn' ? 'সাবস্ক্রাইবার ও যোগাযোগ ফর্ম' : 'Subscribers and contact forms', Icon: Users, color: 'text-purple-400' },
          ].map(({ label, value, sub, Icon, color }) => (
            <div key={label} className="glass-card p-4">
              <div className="flex items-center justify-between"><span className="text-xs text-slate-400">{label}</span><Icon className={`h-4 w-4 ${color}`} /></div>
              <p className="mt-2 text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-emerald-400" />{lang === 'bn' ? 'বিনিয়োগের অবস্থান' : 'Investment Status'}</h2>
          <div className="space-y-4">
            {[
              { color: 'bg-emerald-500', label: lang === 'bn' ? 'সক্রিয়' : 'Active', val: activeInvestments },
              { color: 'bg-emerald-500', label: lang === 'bn' ? 'সম্পন্ন' : 'Completed', val: completedInvestments },
              { color: 'bg-yellow-500', label: lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending', val: pendingInvestments },
            ].map(({ color, label, val }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className={`h-3 w-3 rounded-full ${color}`} /><span className="text-sm text-slate-300">{label}</span></div>
                <span className="text-white font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><Users className="h-5 w-5 text-emerald-400" />{lang === 'bn' ? 'শেয়ার বরাদ্দ' : 'Share Allocation'}</h2>
          <div className="space-y-4">
            {[
              { color: 'bg-purple-500', label: lang === 'bn' ? 'উদ্যোক্তার শেয়ার' : 'Owner Shares', val: totalOwnerShares },
              { color: 'bg-emerald-500', label: lang === 'bn' ? 'বিক্রিত বিনিয়োগকারী শেয়ার' : 'Investor Shares Sold', val: totalSharesSold },
              { color: 'bg-emerald-500', label: lang === 'bn' ? 'বিক্রয়যোগ্য শেয়ার' : 'Available for Sale', val: availableSharesForSale },
            ].map(({ color, label, val }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3"><div className={`h-3 w-3 rounded-full ${color}`} /><span className="text-sm text-slate-300">{label}</span></div>
                <span className="text-white font-medium font-mono">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KYC Status */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><Users className="h-5 w-5 text-emerald-400" />{lang === 'bn' ? 'কেওয়াইসি যাচাইকরণের অবস্থান' : 'KYC Verification Status'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { color: 'bg-emerald-500', label: lang === 'bn' ? 'অনুমোদিত' : 'Approved', val: approvedKYC },
            { color: 'bg-yellow-500', label: lang === 'bn' ? 'নিরীক্ষাধীন' : 'Pending Review', val: pendingKYC },
          ].map(({ color, label, val }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3"><div className={`h-3 w-3 rounded-full ${color}`} /><span className="text-sm text-slate-300">{label}</span></div>
              <span className="text-white font-medium">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <ReportCharts activeInvestments={activeInvestments} completedInvestments={completedInvestments} pendingInvestments={pendingInvestments} approvedKYC={approvedKYC} pendingKYC={pendingKYC} monthlyData={recentMonths} totalSharesSold={totalSharesSold} availableSharesForSale={availableSharesForSale} totalOwnerShares={totalOwnerShares} activeSubscribers={activeSubscribers} contactRequests={contactRequestsCount} />

      {/* Monthly Trend */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><Calendar className="h-5 w-5 text-emerald-400" />{lang === 'bn' ? 'মাসিক বিনিয়োগের প্রবণতা' : 'Monthly Investment Trend'}</h2>
        {recentMonths.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">{lang === 'bn' ? 'কোনো বিনিয়োগ তথ্য নেই' : 'No investment data available'}</p>
        ) : (
          <div className="space-y-3">
            {recentMonths.map(([month, data]) => (
              <div key={month} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div>
                  <p className="text-sm font-medium text-white">{month}</p>
                  <p className="text-xs text-slate-500">{data.count} {lang === 'bn' ? 'টি বিনিয়োগ' : 'investments'}</p>
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
