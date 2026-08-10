'use client'

import { formatCurrency, formatDate } from '@/lib/utils'
import { Clock, CheckCircle, ExternalLink, Lock, Unlock, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'
import { InvestmentRequestActions } from '@/components/features/admin/investment-request-actions'
import { ConfirmInvestmentPaymentButton } from '@/components/features/admin/confirm-investment-payment-button'

interface AdminInvestmentsClientProps {
  investments: any[]
  profileMap: Record<string, any>
  approve: (f: FormData) => Promise<any>
  reject: (f: FormData) => Promise<any>
  confirmPayment: (f: FormData) => Promise<any>
  rejectPayment: (f: FormData) => Promise<any>
  handleWithdrawal: (f: FormData) => Promise<void>
  handleCompleteWithdrawal: (f: FormData) => Promise<void>
}

export function AdminInvestmentsClient({ investments, profileMap, approve, reject, confirmPayment, rejectPayment, handleWithdrawal, handleCompleteWithdrawal }: AdminInvestmentsClientProps) {
  const { lang } = useLanguage()

  const pending = investments.filter(i => i.status === 'pending')
  const paymentSubmitted = investments.filter(i => i.status === 'payment_submitted')
  const active = investments.filter(i => i.status === 'active')

  const allWithdrawals = investments.flatMap(inv =>
    inv.withdrawal_requests?.map((wr: any) => ({ ...wr, investment: inv, profile: profileMap[inv.user_id] })) || []
  )
  const pendingWR = allWithdrawals.filter(w => w.status === 'pending')
  const approvedWR = allWithdrawals.filter(w => w.status === 'approved')
  const processedWR = allWithdrawals.filter(w => w.status === 'completed' || w.status === 'rejected').sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const statusLabel = (s: string) => {
    if (lang !== 'bn') return s
    return s === 'active' ? 'সক্রিয়' : s === 'completed' ? 'সম্পন্ন' : s === 'pending' ? 'অপেক্ষমাণ' : s === 'rejected' ? 'বাতিল' : s
  }

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'বিনিয়োগ ব্যবস্থাপনা' : 'Investments Management'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'বিনিয়োগকারীর চুক্তি পর্যালোচনা ও অনুমোদন করুন' : 'Track, review, and approve investor contracts'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Pending Share Requests */}
        <div className="glass-card p-5 space-y-4 lg:col-span-1">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Clock className="h-4.5 w-4.5 text-yellow-400" />
            {lang === 'bn' ? `অপেক্ষমাণ শেয়ার আবেদন (${pending.length})` : `Pending Share Requests (${pending.length})`}
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{lang === 'bn' ? 'কোনো অপেক্ষমাণ আমানত নেই' : 'No pending deposits'}</p>
          ) : (
            <div className="space-y-3">
              {pending.map(inv => {
                const invProfile = profileMap[inv.user_id]
                const plan = inv.plan
                return (
                  <div key={inv.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-white text-sm truncate">{invProfile?.full_name || (lang === 'bn' ? 'অজানা বিনিয়োগকারী' : 'Unknown Investor')}</p>
                        <p className="text-xs text-slate-500">{plan?.name || (lang === 'bn' ? 'অজানা প্ল্যান' : 'Unknown Plan')}</p>
                        {invProfile?.id && <Link href={`${ROUTES.ADMIN_INVESTORS}/${invProfile.id}`} className="text-[11px] text-emerald-400 hover:underline">{lang === 'bn' ? 'বিনিয়োগকারীর প্রোফাইল দেখুন' : 'View full investor profile'}</Link>}
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-sm">{formatCurrency(Number(inv.amount))}</span>
                        <p className="text-[10px] text-slate-500">{inv.shares_purchased} {lang === 'bn' ? 'টি শেয়ার' : 'shares'}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]">
                      {inv.receipt_url ? (
                        <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> {lang === 'bn' ? 'আমানতের রসিদ দেখুন' : 'View Deposit Receipt'}
                        </a>
                      ) : <span className="text-slate-600">{lang === 'bn' ? 'রসিদ নেই' : 'No Receipt'}</span>}
                      <span className="text-slate-600">{formatDate(inv.created_at)}</span>
                    </div>
                    <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-[11px] text-emerald-200">
                      {lang === 'bn' ? 'শুধুমাত্র আগ্রহ প্রকাশের আবেদন। কোনো অর্থপ্রদান হয়নি।' : 'Interest request only. No payment has been made.'}
                    </p>
                    <InvestmentRequestActions investmentId={inv.id} approve={approve} reject={reject} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Payment Verification */}
        <div className="glass-card space-y-4 p-5 lg:col-span-1">
          <h2 className="flex items-center gap-2 border-b border-white/5 pb-3 font-semibold text-white">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
            {lang === 'bn' ? `পেমেন্ট যাচাইকরণ (${paymentSubmitted.length})` : `Payment Verification (${paymentSubmitted.length})`}
          </h2>
          {paymentSubmitted.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">{lang === 'bn' ? 'যাচাইয়ের জন্য কোনো রসিদ নেই' : 'No receipts awaiting verification'}</p>
          ) : (
            <div className="space-y-3">
              {paymentSubmitted.map(inv => {
                const investor = profileMap[inv.user_id]
                const plan = inv.plan
                return (
                  <div key={inv.id} className="space-y-3 rounded-xl border border-white/5 bg-slate-900/40 p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{investor?.full_name || (lang === 'bn' ? 'অজানা বিনিয়োগকারী' : 'Unknown Investor')}</p>
                        <p className="text-xs text-slate-500">{investor?.email || ''} · {plan?.name || (lang === 'bn' ? 'অজানা প্ল্যান' : 'Unknown Plan')}</p>
                      </div>
                      <span className="text-sm font-bold text-white">{formatCurrency(Number(inv.amount))}</span>
                    </div>
                    {inv.receipt_url && <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"><ExternalLink className="h-3 w-3" /> {lang === 'bn' ? 'ব্যাংক রসিদ দেখুন' : 'View bank receipt'}</a>}
                    <ConfirmInvestmentPaymentButton investmentId={inv.id} action={confirmPayment} reject={rejectPayment} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Active Investments */}
        <div className="glass-card p-5 space-y-4 lg:col-span-2">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
            {lang === 'bn' ? `সক্রিয় বিনিয়োগ (${active.length})` : `Active Investments (${active.length})`}
          </h2>
          {active.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{lang === 'bn' ? 'কোনো সক্রিয় বিনিয়োগ চুক্তি নেই' : 'No active investment contracts'}</p>
          ) : (
            <div className="table-wrapper">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>{lang === 'bn' ? 'বিনিয়োগকারী' : 'Investor'}</th>
                    <th>{lang === 'bn' ? 'প্ল্যান' : 'Plan'}</th>
                    <th>{lang === 'bn' ? 'শেয়ার' : 'Shares'}</th>
                    <th>{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                    <th>{lang === 'bn' ? 'লভ্যাংশ হার' : 'ROI Rate'}</th>
                    <th>{lang === 'bn' ? 'লকড অবস্থা' : 'Lock Status'}</th>
                    <th>{lang === 'bn' ? 'শেষ তারিখ' : 'End Date'}</th>
                  </tr>
                </thead>
                <tbody>
                  {active.map(inv => {
                    const invProfile = profileMap[inv.user_id]
                    const plan = inv.plan
                    const now = new Date()
                    const lockExpiresAt = inv.lock_expires_at ? new Date(inv.lock_expires_at) : null
                    const isLocked = lockExpiresAt && now < lockExpiresAt
                    const daysUntilUnlock = lockExpiresAt && isLocked ? Math.ceil((lockExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0
                    return (
                      <tr key={inv.id}>
                        <td>
                          <div className="font-medium text-white truncate max-w-[120px]">{invProfile?.full_name || (lang === 'bn' ? 'অজানা' : 'Unknown')}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{invProfile?.email || ''}</div>
                        </td>
                        <td className="font-medium">{plan?.name || '—'}</td>
                        <td className="text-white font-bold">{inv.shares_purchased || 0}</td>
                        <td className="text-white font-bold">{formatCurrency(Number(inv.amount))}</td>
                        <td className="text-emerald-400">{plan?.roi_percentage ? `${plan.roi_percentage}%/${lang === 'bn' ? 'বছর' : 'yr'}` : '—'}</td>
                        <td>
                          {isLocked ? (
                            <div className="flex items-center gap-1 text-yellow-400"><Lock className="h-3 w-3" /><span className="text-xs">{daysUntilUnlock}{lang === 'bn' ? ' দিন' : 'd'}</span></div>
                          ) : (
                            <div className="flex items-center gap-1 text-emerald-400"><Unlock className="h-3 w-3" /><span className="text-xs">{lang === 'bn' ? 'উন্মুক্ত' : 'Unlocked'}</span></div>
                          )}
                        </td>
                        <td className="text-slate-400 text-xs">{inv.end_date ? formatDate(inv.end_date) : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Withdrawal / Exit Requests */}
        <div className="glass-card p-5 space-y-4 lg:col-span-3">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <DollarSign className="h-4.5 w-4.5 text-emerald-400" />
            {lang === 'bn' ? `উত্তোলন আবেদন (${allWithdrawals.length})` : `Exit Requests (${allWithdrawals.length})`}
          </h2>
          {pendingWR.length === 0 && approvedWR.length === 0 && (
            <div className="rounded-xl border border-white/5 bg-slate-900/30 py-8 text-center">
              <DollarSign className="mx-auto mb-2 h-8 w-8 text-slate-600" />
              <p className="text-sm text-slate-400">{lang === 'bn' ? 'কোনো সক্রিয় উত্তোলন বা হস্তান্তর আবেদন নেই' : 'No active withdrawal or transfer requests'}</p>
            </div>
          )}
          {pendingWR.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">{lang === 'bn' ? 'অপেক্ষমাণ আবেদন' : 'Pending Requests'}</p>
              {pendingWR.map((wr: any) => (
                <div key={wr.id} className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-medium text-white text-sm">{wr.profile?.full_name || (lang === 'bn' ? 'অজানা' : 'Unknown Investor')}</p>
                      <p className="text-xs text-slate-500">{wr.investment?.plan?.name || '—'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold text-sm">{formatCurrency(wr.amount)}</span>
                      <p className="text-[10px] text-slate-500">{wr.withdrawal_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {wr.request_reason && <p className="text-xs text-slate-400 italic">&quot;{wr.request_reason}&quot;</p>}
                  {wr.withdrawal_type === 'share_transfer' && <p className="text-xs text-slate-400">{lang === 'bn' ? `হস্তান্তর: ${wr.transfer_shares} টি শেয়ার →` : `Transfer ${wr.transfer_shares} shares to`} <span className="text-white">{wr.transfer_recipient_email || (lang === 'bn' ? 'প্রাপকের অ্যাকাউন্ট' : 'recipient account')}</span></p>}
                  <div className="flex gap-2 pt-2">
                    <form action={handleWithdrawal} className="flex-1">
                      <input type="hidden" name="request_id" value={wr.id} />
                      <input type="hidden" name="status" value="approved" />
                      <textarea name="response" rows={2} required placeholder={lang === 'bn' ? 'বিনিয়োগকারীর জন্য অনুমোদনের বার্তা লিখুন...' : 'Write an approval response for the investor...'} className="input-base mb-2 w-full resize-none text-xs" />
                      <button type="submit" className="btn-primary w-full py-2 text-xs justify-center">{lang === 'bn' ? 'অনুমোদন করুন' : 'Approve'}</button>
                    </form>
                    <form action={handleWithdrawal} className="flex-1">
                      <input type="hidden" name="request_id" value={wr.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <textarea name="response" rows={2} required placeholder={lang === 'bn' ? 'বাধ্যতামূলক প্রত্যাখ্যানের কারণ...' : 'Required rejection reason...'} className="input-base mb-2 w-full resize-none text-xs" />
                      <button type="submit" className="btn-secondary w-full py-2 text-xs justify-center">{lang === 'bn' ? 'প্রত্যাখ্যান করুন' : 'Reject'}</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
          {approvedWR.length > 0 && (
            <div className="space-y-3 mt-4">
              <p className="text-xs text-slate-500 font-medium">{lang === 'bn' ? 'অনুমোদিত - পেমেন্ট প্রক্রিয়াধীন' : 'Approved - Awaiting Payment'}</p>
              {approvedWR.map((wr: any) => {
                const approvedAt = wr.owner_response_at ? new Date(wr.owner_response_at) : null
                const threeMonthsLater = approvedAt ? new Date(approvedAt.getTime() + (90 * 24 * 60 * 60 * 1000)) : null
                const daysRemaining = threeMonthsLater ? Math.ceil((threeMonthsLater.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
                return (
                  <div key={wr.id} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-white text-sm">{wr.profile?.full_name || (lang === 'bn' ? 'অজানা' : 'Unknown')}</p>
                        <p className="text-xs text-slate-500">{wr.investment?.plan?.name || '—'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-sm">{formatCurrency(wr.amount)}</span>
                        <p className="text-[10px] text-emerald-400">{wr.withdrawal_type === 'share_transfer' ? `${wr.transfer_shares} ${lang === 'bn' ? 'টি শেয়ার' : 'shares'}` : `${daysRemaining} ${lang === 'bn' ? ' দিন বাকি' : ' days remaining'}`}</p>
                      </div>
                    </div>
                    {wr.withdrawal_type === 'share_transfer' && <p className="text-xs text-slate-400">{lang === 'bn' ? 'প্রাপক:' : 'Recipient:'} <span className="text-white">{wr.transfer_recipient_email || (lang === 'bn' ? 'প্রাপক অ্যাকাউন্ট' : 'recipient account')}</span></p>}
                    <form action={handleCompleteWithdrawal}>
                      <input type="hidden" name="request_id" value={wr.id} />
                      <button type="submit" className="btn-primary w-full py-2 text-xs justify-center">
                        {wr.withdrawal_type === 'share_transfer' ? (lang === 'bn' ? 'শেয়ার হস্তান্তর সম্পন্ন করুন' : 'Complete Share Transfer') : (lang === 'bn' ? 'পেমেন্ট সম্পন্ন হিসেবে চিহ্নিত করুন' : 'Mark as Paid')}
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          )}
          {processedWR.length > 0 && (
            <div className="mt-5 space-y-3 border-t border-white/5 pt-4">
              <p className="text-xs font-medium text-slate-500">{lang === 'bn' ? 'সাম্প্রতিক আবেদনের ইতিহাস' : 'Recent Request History'}</p>
              <div className="space-y-2">
                {processedWR.slice(0, 8).map((wr: any) => (
                  <div key={wr.id} className="flex flex-col gap-2 rounded-lg border border-white/5 bg-slate-900/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">{wr.profile?.full_name || (lang === 'bn' ? 'অজানা' : 'Unknown')} · {wr.withdrawal_type.replace('_', ' ')}</p>
                      <p className="text-[10px] text-slate-500">{wr.investment?.plan?.name || '—'} · {formatDate(wr.created_at)}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className={wr.status === 'completed' ? 'badge-green' : 'badge-red'}>{wr.status === 'completed' ? (lang === 'bn' ? 'সম্পন্ন' : 'completed') : (lang === 'bn' ? 'বাতিল' : 'rejected')}</span>
                      <p className="mt-1 text-xs text-slate-400">{formatCurrency(wr.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
