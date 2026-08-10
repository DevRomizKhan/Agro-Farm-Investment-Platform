'use client'

import Link from 'next/link'
import { TrendingUp, ExternalLink, ShieldAlert, Clock, Lock, Unlock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import type { InvestmentPlan } from '@/types'
import { ExitRequestForm } from '@/components/features/investments/exit-request-form'
import { PaymentReceiptForm } from '@/components/features/investments/payment-receipt-form'
import { InvestForm } from '@/components/features/investments/invest-form'
import { useLanguage } from '@/lib/i18n/context'

interface InvestorInvestmentsClientProps {
  isKYCApproved: boolean
  kycSubmission: any
  plans: InvestmentPlan[]
  investments: any[]
  bankSettings: any
  planSharesSold: Record<string, number>
}

export function InvestorInvestmentsClient({
  isKYCApproved,
  kycSubmission,
  plans,
  investments,
  bankSettings,
  planSharesSold,
}: InvestorInvestmentsClientProps) {
  const { lang, t } = useLanguage()

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'আমার শেয়ার বিনিয়োগ' : 'My Investments'}</h1>
          <p className="page-subtitle">
            {lang === 'bn' ? 'আপনার শেয়ার পোর্টফোলিও পরিচালনা ও সম্ভাব্য লভ্যাংশ পর্যবেক্ষণ করুন' : 'Manage your portfolio and track expected ROI'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Investments list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              {lang === 'bn' ? 'শেয়ার বিনিয়োগের ইতিহাস' : 'Investment History'}
            </h2>

            {!investments || investments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">{lang === 'bn' ? 'কোনো বিনিয়োগ চুক্তি পাওয়া যায়নি' : 'No investment contracts found'}</p>
                <p className="text-xs text-slate-600 mt-1">
                  {lang === 'bn' ? 'শেয়ার ক্রয় শুরু করতে ডানদিকের আবেদন ফরমটি পূরণ করুন।' : 'Submit the investment request form on the right to begin.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((inv) => {
                  const plan = inv.plan as {
                    name?: string
                    roi_percentage?: number
                    duration_months?: number
                    shares_per_amount?: number
                  } | null

                  const estimatedROI =
                    plan?.roi_percentage && plan?.duration_months && Number(inv.amount) > 0
                      ? Math.floor(
                          Number(inv.amount) *
                            (plan.roi_percentage / 100) *
                            (plan.duration_months / 12)
                        )
                      : Number(inv.expected_roi)

                  const now = new Date()
                  const lockExpiresAt = inv.lock_expires_at ? new Date(inv.lock_expires_at) : null
                  const isLocked = lockExpiresAt && now < lockExpiresAt
                  const daysUntilUnlock = lockExpiresAt && isLocked
                    ? Math.ceil((lockExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    : 0

                  const pendingWithdrawal = inv.withdrawal_requests?.find(
                    (wr: { status: string }) => wr.status === 'pending'
                  )
                  const approvedWithdrawal = inv.withdrawal_requests?.find(
                    (wr: { status: string }) => wr.status === 'approved'
                  )
                  const hasOpenExitRequest = Boolean(pendingWithdrawal || approvedWithdrawal)
                  const latestExitRequest = [...(inv.withdrawal_requests || [])]
                    .sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

                  return (
                    <div
                      key={inv.id}
                      className="p-5 rounded-xl border border-white/5 bg-slate-900/40 hover:border-emerald-500/20 transition-colors space-y-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-white text-base">
                            {plan?.name || (lang === 'bn' ? 'নির্ধারিত প্ল্যান' : 'Unknown Plan')}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {lang === 'bn' ? 'চুক্তি নং:' : 'Contract ID:'} {inv.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <span
                          className={
                            inv.status === 'active'
                              ? 'badge-primary'
                              : inv.status === 'pending'
                              ? 'badge-yellow'
                              : inv.status === 'approved'
                              ? 'badge-green'
                              : inv.status === 'payment_submitted'
                              ? 'badge-purple'
                              : inv.status === 'rejected'
                              ? 'badge-red'
                              : inv.status === 'completed'
                              ? 'badge-green'
                              : 'badge-red'
                          }
                        >
                          {lang === 'bn' ? (
                            inv.status === 'active' ? 'সক্রিয়' :
                            inv.status === 'pending' ? 'অপেক্ষমাণ' :
                            inv.status === 'approved' ? 'অনুমোদিত' :
                            inv.status === 'payment_submitted' ? 'পেমেন্ট জমাকৃত' :
                            inv.status === 'completed' ? 'সম্পন্ন' :
                            inv.status === 'rejected' ? 'বাতিল' : 'বাতিল'
                          ) : inv.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-t border-b border-white/5 text-sm">
                        <div>
                          <span className="text-slate-500 text-xs block">{lang === 'bn' ? 'মালিকানাধীন শেয়ার' : 'Shares Owned'}</span>
                          <span className="text-white font-medium">
                            {inv.shares_purchased || 0} {lang === 'bn' ? 'টি' : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">{lang === 'bn' ? 'বিনিয়োগকৃত পরিমাণ' : 'Invested Amount'}</span>
                          <span className="text-white font-medium">
                            {formatCurrency(Number(inv.amount))}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">
                            {lang === 'bn' ? 'আনুমানিক লভ্যাংশ' : 'Estimated ROI'}
                            {plan?.roi_percentage ? ` (${plan.roi_percentage}%+)` : ''}
                          </span>
                          <span className="text-emerald-400 font-semibold">
                            {formatCurrency(estimatedROI)}+
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">{lang === 'bn' ? 'লকড অবস্থা' : 'Lock Status'}</span>
                          <div className="flex items-center gap-1">
                            {isLocked ? (
                              <>
                                <Lock className="h-3 w-3 text-yellow-400" />
                                <span className="text-yellow-400 font-medium text-xs">
                                  {daysUntilUnlock} {lang === 'bn' ? 'দিন বাকি' : 'days'}
                                </span>
                              </>
                            ) : (
                              <>
                                <Unlock className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400 font-medium text-xs">
                                  {lang === 'bn' ? 'উন্মুক্ত' : 'Unlocked'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Exit request status and owner response */}
                      {latestExitRequest && (
                        <div className={`p-3 rounded-lg border ${
                          latestExitRequest.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20' :
                          latestExitRequest.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20' :
                          latestExitRequest.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20' :
                          'bg-red-500/10 border-red-500/20'
                        }`}>
                          <p className="text-xs font-medium text-white">
                            {lang === 'bn' ? 'উত্তোলন আবেদন:' : 'Exit request:'} <span className="capitalize">{latestExitRequest.status}</span>
                            <span className="text-slate-400"> · {latestExitRequest.withdrawal_type.replace('_', ' ')}</span>
                          </p>
                          {latestExitRequest.owner_response && (
                            <p className="mt-1 text-xs text-slate-300">
                              {lang === 'bn' ? 'উদ্যোক্তার মন্তব্য:' : 'Owner response:'} {latestExitRequest.owner_response}
                            </p>
                          )}
                        </div>
                      )}

                      {inv.status === 'active' && !isLocked && !hasOpenExitRequest && (
                        <ExitRequestForm
                          investmentId={inv.id}
                          principal={Number(inv.amount)}
                          profit={Number(inv.actual_roi || 0)}
                          shares={Number(inv.shares_purchased || 0)}
                          lockPeriodDays={Number((plan as { lock_period_days?: number } | null)?.lock_period_days ?? inv.lock_period_days)}
                        />
                      )}

                      {inv.status === 'approved' && bankSettings && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-slate-300">
                          <p className="mb-2 font-semibold text-emerald-300">
                            {lang === 'bn' ? 'আবেদন অনুমোদিত — কেবল ব্যাংকিং চ্যানেলে অর্থ পাঠান' : 'Approved — transfer through bank only'}
                          </p>
                          <p>{lang === 'bn' ? 'হিসাবকারীর নাম:' : 'Account name:'} <span className="text-white">{bankSettings.account_name}</span></p>
                          <p>{lang === 'bn' ? 'ব্যাংকের নাম:' : 'Bank:'} <span className="text-white">{bankSettings.bank_name}</span></p>
                          <p>{lang === 'bn' ? 'হিসাব নম্বর:' : 'Account:'} <span className="text-white">{bankSettings.account_number}</span></p>
                          {bankSettings.branch_name && <p>{lang === 'bn' ? 'শাখা:' : 'Branch:'} <span className="text-white">{bankSettings.branch_name}</span></p>}
                          {bankSettings.routing_number && <p>{lang === 'bn' ? 'রাউটিং নং:' : 'Routing:'} <span className="text-white">{bankSettings.routing_number}</span></p>}
                          {bankSettings.instructions && <p className="mt-2 text-slate-400">{bankSettings.instructions}</p>}
                          <div className="mt-4"><PaymentReceiptForm investmentId={inv.id} /></div>
                        </div>
                      )}
                      {inv.status === 'payment_submitted' && (
                        <p className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-200">
                          {lang === 'bn' ? 'পেমেন্ট রসিদ জমা হয়েছে। ব্যাংক যাচাইকরণের অপেক্ষায় থাকুন।' : 'Payment receipt submitted. Please wait for owner verification.'}
                        </p>
                      )}

                      {inv.status !== 'active' && inv.status !== 'completed' && (
                        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-300">
                          <p className="font-semibold text-white">{lang === 'bn' ? 'শেয়ারসমূহ হস্তান্তরযোগ্য নয়' : 'Shares are not transferable'}</p>
                          <p className="mt-1 leading-relaxed">
                            {lang === 'bn' ? (
                              inv.status === 'pending' ? 'আপনার আবেদনটির প্রক্রিয়াধীন থাকার সময় হস্তান্তর সম্ভব নয়।' :
                              inv.status === 'approved' ? 'ব্যাংক পেমেন্ট সম্পন্ন ও রসিদ যাচাইকরণ পর্যন্ত শেয়ার হস্তান্তর বন্ধ থাকবে।' :
                              inv.status === 'payment_submitted' ? 'আপনার পাঠানো পেমেন্ট রসিদ যাচাই না হওয়া পর্যন্ত শেয়ার হস্তান্তর বন্ধ থাকবে।' :
                              inv.status === 'rejected' ? `আবেদনটি বাতিল হওয়ার কারণে শেয়ার প্রক্রিয়া স্থগিত রয়েছে${inv.notes ? `: ${inv.notes}` : '।'}` :
                              'এই শেয়ার আবেদনটি বাতিল করা হয়েছে।'
                            ) : (
                              inv.status === 'pending' ? 'Transfer is unavailable while the owner reviews your share request.' :
                              inv.status === 'approved' ? 'Transfer is unavailable until you complete the bank payment and the owner verifies your receipt.' :
                              inv.status === 'payment_submitted' ? 'Transfer is unavailable while the owner verifies your submitted bank payment.' :
                              inv.status === 'rejected' ? `Transfer is unavailable because the owner rejected this request${inv.notes ? `: ${inv.notes}` : '.'}` :
                              'Transfer is unavailable because this investment request was cancelled.'
                            )}
                          </p>
                        </div>
                      )}

                      {inv.notes && inv.status !== 'rejected' && (inv.status === 'approved' || inv.status === 'payment_submitted' || inv.status === 'active') && (
                        <div className={`rounded-xl border p-3 text-xs ${inv.status === 'rejected' ? 'border-red-500/20 bg-red-500/10 text-red-200' : 'border-slate-700 bg-slate-800/50 text-slate-300'}`}>
                          <p className="font-semibold text-white">{lang === 'bn' ? 'উদ্যোক্তার মন্তব্য' : 'Owner response'}</p>
                          <p className="mt-1 leading-relaxed">{inv.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">
                          {lang === 'bn' ? 'আবেদনের তারিখ:' : 'Submitted on'} {formatDate(inv.created_at)}
                        </span>
                        {inv.receipt_url && (
                          <a
                            href={inv.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> {lang === 'bn' ? 'পেমেন্ট রসিদ দেখুন' : 'View Deposit Receipt'}
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Investment Form or KYC gate */}
        <div>
          {!isKYCApproved ? (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <ShieldAlert className="h-5 w-5 text-yellow-400" />
                <h2 className="text-base font-semibold text-white">
                  {lang === 'bn' ? 'কেওয়াইসি (KYC) যাচাইকরণ আবশ্যক' : 'KYC Verification Required'}
                </h2>
              </div>
              <div className="py-6 text-center">
                <p className="text-slate-400 text-sm mb-4">
                  {lang === 'bn' ? 'যেকোনো প্ল্যানে শেয়ার ক্রয় করার আগে কেওয়াইসি পরিচয় যাচাইকরণ সম্পন্ন করতে হবে।' : 'You must complete KYC verification before you can invest in any plans.'}
                </p>
                {!kycSubmission ? (
                  <Link href={ROUTES.INVESTOR_KYC} className="btn-primary w-full justify-center">
                    {lang === 'bn' ? 'কেওয়াইসি যাচাইকরণ সম্পন্ন করুন' : 'Complete KYC Verification'}
                  </Link>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5">
                    <p className="text-sm text-slate-400 mb-2">
                      {lang === 'bn' ? 'আপনার কেওয়াইসি অবস্থা:' : 'Your KYC status is:'}{' '}
                      <span className="font-semibold text-white">{kycSubmission.status}</span>
                    </p>
                    {kycSubmission.status === 'pending' && (
                      <p className="text-xs text-slate-500">{lang === 'bn' ? 'দয়া করে অ্যাডমিন পর্যালোচনার জন্য অপেক্ষা করুন।' : 'Please wait for admin approval.'}</p>
                    )}
                    {kycSubmission.status === 'rejected' && (
                      <Link
                        href={ROUTES.INVESTOR_KYC}
                        className="text-emerald-400 hover:underline text-sm font-medium"
                      >
                        {lang === 'bn' ? 'পুনরায় কেওয়াইসি নথিপত্র জমা দিন' : 'Resubmit KYC Documents'}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : plans.length === 0 ? (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Clock className="h-5 w-5 text-slate-400" />
                <h2 className="text-base font-semibold text-white">{lang === 'bn' ? 'কোনো প্ল্যান উন্মুক্ত নেই' : 'No Plans Available'}</h2>
              </div>
              <div className="py-8 text-center">
                <Clock className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  {lang === 'bn' ? 'এই মুহূর্তে কোনো নতুন শেয়ার প্ল্যান বিক্রির জন্য উন্মুক্ত নেই।' : 'There are no investment plans open for subscription right now.'}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {lang === 'bn' ? 'পরবর্তী প্ল্যানের সময়সূচি জানতে পরে চেষ্টা করুন।' : 'Please check back later or contact support for upcoming plan schedules.'}
                </p>
              </div>
            </div>
          ) : (
            <InvestForm plans={plans} planSharesSold={planSharesSold} />
          )}
        </div>
      </div>
    </div>
  )
}
