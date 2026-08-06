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
  request_reason: string | null
  owner_response_at: string | null
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
                              <span className="text-xs">{daysUntilUnlock}d</span>
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
        {(pendingWithdrawals.length > 0 || approvedWithdrawals.length > 0) && (
          <div className="glass-card p-5 space-y-4 lg:col-span-3">
            <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
              <DollarSign className="h-4.5 w-4.5 text-green-400" />
              Withdrawal Requests ({pendingWithdrawals.length + approvedWithdrawals.length})
            </h2>
            
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
                        <p className="text-[10px] text-slate-500">{wr.withdrawal_type}</p>
                      </div>
                    </div>
                    {wr.request_reason && (
                      <p className="text-xs text-slate-400 italic">&quot;{wr.request_reason}&quot;</p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <form action={handleWithdrawal} className="flex-1">
                        <input type="hidden" name="request_id" value={wr.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button type="submit" className="btn-primary w-full py-2 text-xs justify-center">
                          Approve
                        </button>
                      </form>
                      <form action={handleWithdrawal} className="flex-1">
                        <input type="hidden" name="request_id" value={wr.id} />
                        <input type="hidden" name="status" value="rejected" />
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
                          <p className="text-[10px] text-green-400">{daysRemaining} days remaining</p>
                        </div>
                      </div>
                      <form action={handleCompleteWithdrawal}>
                        <input type="hidden" name="request_id" value={wr.id} />
                        <button type="submit" className="btn-primary w-full py-2 text-xs justify-center">
                          Mark as Paid
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
