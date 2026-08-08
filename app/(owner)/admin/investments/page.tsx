import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Clock, CheckCircle, ExternalLink, Lock, Unlock, DollarSign } from 'lucide-react'
import { ROUTES } from '@/constants'
import { approveInvestmentAction, processWithdrawalRequestAction, completeWithdrawalAction } from '@/actions/investments'
import { ApproveInvestmentButton } from '@/components/features/admin/approve-investment-button'

type InvestorProfileSummary = {
  user_id: string
  full_name: string | null
  email: string | null
}

type WithdrawalRequestWithContext = {
  id: string
  status: string
  amount: number
  withdrawal_type: string
  transfer_shares?: number | null
  transfer_recipient_email?: string | null
  request_reason: string | null
  owner_response?: string | null
  owner_response_at: string | null
  created_at: string
  completed_at?: string | null
  profile?: InvestorProfileSummary
  investment?: {
    plan?: { name?: string }
  }
}

export default async function AdminInvestmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch investments with withdrawal requests
  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(*), withdrawal_requests(*)')
    .order('created_at', { ascending: false })

  // Fetch profiles for all investors
  const userIds = investments?.map(i => i.user_id) || []
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email')
    .in('user_id', userIds)

  // Create a map of user_id to profile data
  const profileMap = new Map((profiles as InvestorProfileSummary[] | null)?.map((p) => [p.user_id, p]) || [])

  const pendingInvestments = investments?.filter(i => i.status === 'pending') || []
  const activeInvestments = investments?.filter(i => i.status === 'active') || []

  // Collect all withdrawal requests
  const allWithdrawalRequests = investments?.flatMap(inv =>
    inv.withdrawal_requests?.map((wr: WithdrawalRequestWithContext) => ({ ...wr, investment: inv, profile: profileMap.get(inv.user_id) })) || []
  ) || []
  const pendingWithdrawals = allWithdrawalRequests.filter(wr => wr.status === 'pending')
  const approvedWithdrawals = allWithdrawalRequests.filter(wr => wr.status === 'approved')
  const processedWithdrawals = allWithdrawalRequests
    .filter(wr => wr.status === 'completed' || wr.status === 'rejected')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Wrap approval logic in an inline server action since it's inside a Server Component
  const handleApprove = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    return approveInvestmentAction(id)
  }

  const handleWithdrawal = async (formData: FormData) => {
    'use server'
    const requestId = formData.get('request_id') as string
    const status = formData.get('status') as 'approved' | 'rejected'
    const response = formData.get('response') as string | null
    await processWithdrawalRequestAction(requestId, status, response || undefined)
  }

  const handleCompleteWithdrawal = async (formData: FormData) => {
    'use server'
    const requestId = formData.get('request_id') as string
    await completeWithdrawalAction(requestId)
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Investments Management</h1>
          <p className="page-subtitle">Track, review, and approve investor contracts</p>
        </div>
      </div>

      {/* Grid of queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Pending approvals */}
        <div className="glass-card p-5 space-y-4 lg:col-span-1">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Clock className="h-4.5 w-4.5 text-yellow-400" />
            Pending Deposits ({pendingInvestments.length})
          </h2>
          {pendingInvestments.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No pending deposits</p>
          ) : (
            <div className="space-y-3">
              {pendingInvestments.map((inv) => {
                const invProfile = profileMap.get(inv.user_id) as { full_name?: string; email?: string } | undefined
                const plan = inv.plan as { name?: string; roi_percentage?: number; duration_months?: number; shares_per_amount?: number } | null
                return (
                  <div key={inv.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-white text-sm truncate">{invProfile?.full_name || 'Unknown Investor'}</p>
                        <p className="text-xs text-slate-500">{plan?.name || 'Unknown Plan'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-sm">{formatCurrency(Number(inv.amount))}</span>
                        <p className="text-[10px] text-slate-500">{inv.shares_purchased} shares</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]">
                      {inv.receipt_url ? (
                        <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> View Deposit Receipt
                        </a>
                      ) : <span className="text-slate-600">No Receipt</span>}
                      <span className="text-slate-600">{formatDate(inv.created_at)}</span>
                    </div>

                    <ApproveInvestmentButton investmentId={inv.id} action={handleApprove} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Active contracts */}
        <div className="glass-card p-5 space-y-4 lg:col-span-2">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <CheckCircle className="h-4.5 w-4.5 text-green-400" />
            Active Investments ({activeInvestments.length})
          </h2>
          {activeInvestments.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No active investment contracts</p>
          ) : (
            <div className="table-wrapper">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Plan</th>
                    <th>Shares</th>
                    <th>Amount</th>
                    <th>ROI Rate</th>
                    <th>Lock Status</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvestments.map((inv) => {
                    const invProfile = profileMap.get(inv.user_id) as { full_name?: string; email?: string } | undefined
                    const plan = inv.plan as { name?: string; roi_percentage?: number; duration_months?: number } | null
                    const now = new Date()
                    const lockExpiresAt = inv.lock_expires_at ? new Date(inv.lock_expires_at) : null
                    const isLocked = lockExpiresAt && now < lockExpiresAt
                    const daysUntilUnlock = lockExpiresAt && isLocked
                      ? Math.ceil((lockExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                      : 0
                    return (
                      <tr key={inv.id}>
                        <td>
                          <div className="font-medium text-white truncate max-w-[120px]">{invProfile?.full_name || 'Unknown Investor'}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{invProfile?.email || ''}</div>
                        </td>
                        <td className="font-medium">{plan?.name || 'Unknown Plan'}</td>
                        <td className="text-white font-bold">{inv.shares_purchased || 0}</td>
                        <td className="text-white font-bold">{formatCurrency(Number(inv.amount))}</td>
                        <td className="text-green-400">{plan?.roi_percentage ? `${plan.roi_percentage}%/yr` : '—'}</td>
                        <td>
                          {isLocked ? (
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Lock className="h-3 w-3" />
                              <span className="text-xs">{daysUntilUnlock}d remaining</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-green-400">
                              <Unlock className="h-3 w-3" />
                              <span className="text-xs">Unlocked</span>
                            </div>
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

        {/* Withdrawal Requests */}
        <div className="glass-card p-5 space-y-4 lg:col-span-3">
            <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <DollarSign className="h-4.5 w-4.5 text-green-400" />
              Exit Requests ({allWithdrawalRequests.length})
            </h2>

            {pendingWithdrawals.length === 0 && approvedWithdrawals.length === 0 && (
              <div className="rounded-xl border border-white/5 bg-slate-900/30 py-8 text-center">
                <DollarSign className="mx-auto mb-2 h-8 w-8 text-slate-600" />
                <p className="text-sm text-slate-400">No active withdrawal or transfer requests</p>
                <p className="mt-1 text-xs text-slate-600">Investor requests will appear here after their lock period expires.</p>
              </div>
            )}
            
            {pendingWithdrawals.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">Pending Requests</p>
                {pendingWithdrawals.map((wr) => (
                  <div key={wr.id} className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-white text-sm">{wr.profile?.full_name || 'Unknown Investor'}</p>
                        <p className="text-xs text-slate-500">{wr.investment?.plan?.name || 'Unknown Plan'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-sm">{formatCurrency(wr.amount)}</span>
                        <p className="text-[10px] text-slate-500">{wr.withdrawal_type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    {wr.request_reason && (
                      <p className="text-xs text-slate-400 italic">&quot;{wr.request_reason}&quot;</p>
                    )}
                    {wr.withdrawal_type === 'share_transfer' && (
                      <p className="text-xs text-slate-400">Transfer {wr.transfer_shares} shares to <span className="text-white">{wr.transfer_recipient_email || 'recipient account'}</span></p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <form action={handleWithdrawal} className="flex-1">
                        <input type="hidden" name="request_id" value={wr.id} />
                        <input type="hidden" name="status" value="approved" />
                        <textarea name="response" rows={2} required placeholder="Write an approval response for the investor..." className="input-base mb-2 w-full resize-none text-xs" />
                        <button type="submit" className="btn-primary w-full py-2 text-xs justify-center">
                          Approve
                        </button>
                      </form>
                      <form action={handleWithdrawal} className="flex-1">
                        <input type="hidden" name="request_id" value={wr.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <textarea name="response" rows={2} required placeholder="Required rejection reason..." className="input-base mb-2 w-full resize-none text-xs" />
                        <button type="submit" className="btn-secondary w-full py-2 text-xs justify-center">
                          Reject
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {approvedWithdrawals.length > 0 && (
              <div className="space-y-3 mt-4">
                <p className="text-xs text-slate-500 font-medium">Approved - Awaiting Payment</p>
                {approvedWithdrawals.map((wr) => {
                  const approvedAt = wr.owner_response_at ? new Date(wr.owner_response_at) : null
                  const threeMonthsLater = approvedAt ? new Date(approvedAt.getTime() + (90 * 24 * 60 * 60 * 1000)) : null
                  const daysRemaining = threeMonthsLater ? Math.ceil((threeMonthsLater.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
                  
                  return (
                    <div key={wr.id} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-medium text-white text-sm">{wr.profile?.full_name || 'Unknown Investor'}</p>
                          <p className="text-xs text-slate-500">{wr.investment?.plan?.name || 'Unknown Plan'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold text-sm">{formatCurrency(wr.amount)}</span>
                          <p className="text-[10px] text-green-400">{wr.withdrawal_type === 'share_transfer' ? `${wr.transfer_shares} shares` : `${daysRemaining} days remaining`}</p>
                        </div>
                      </div>
                      {wr.withdrawal_type === 'share_transfer' && (
                        <p className="text-xs text-slate-400">Recipient: <span className="text-white">{wr.transfer_recipient_email || 'recipient account'}</span></p>
                      )}
                      <form action={handleCompleteWithdrawal}>
                        <input type="hidden" name="request_id" value={wr.id} />
                        <button type="submit" className="btn-primary w-full py-2 text-xs justify-center">
                          {wr.withdrawal_type === 'share_transfer' ? 'Complete Share Transfer' : 'Mark as Paid'}
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            )}

            {processedWithdrawals.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-white/5 pt-4">
                <p className="text-xs font-medium text-slate-500">Recent Request History</p>
                <div className="space-y-2">
                  {processedWithdrawals.slice(0, 8).map((wr) => (
                    <div key={wr.id} className="flex flex-col gap-2 rounded-lg border border-white/5 bg-slate-900/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-medium text-white">{wr.profile?.full_name || 'Unknown Investor'} · {wr.withdrawal_type.replace('_', ' ')}</p>
                        <p className="text-[10px] text-slate-500">{wr.investment?.plan?.name || 'Unknown Plan'} · {formatDate(wr.created_at)}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className={wr.status === 'completed' ? 'badge-blue' : 'badge-red'}>{wr.status}</span>
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
