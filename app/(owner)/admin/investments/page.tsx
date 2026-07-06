import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, Clock, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { approveInvestmentAction } from '@/actions/investments'

export default async function AdminInvestmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch investments
  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(name, roi_percentage, duration_months)')
    .order('created_at', { ascending: false })

  // Fetch profiles for all investors
  const userIds = investments?.map(i => i.user_id) || []
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email')
    .in('user_id', userIds)

  // Create a map of user_id to profile data
  const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p]) || [])

  const pendingInvestments = investments?.filter(i => i.status === 'pending') || []
  const activeInvestments = investments?.filter(i => i.status === 'active') || []
  const completedInvestments = investments?.filter(i => i.status === 'completed' || i.status === 'cancelled') || []

  // Wrap approval logic in an inline server action since it's inside a Server Component
  const handleApprove = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    await approveInvestmentAction(id)
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
                const plan = inv.plan as { name?: string; roi_percentage?: number; duration_months?: number } | null
                return (
                  <div key={inv.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-medium text-white text-sm truncate">{invProfile?.full_name || 'Unknown Investor'}</p>
                        <p className="text-xs text-slate-500">{plan?.name || 'Unknown Plan'}</p>
                      </div>
                      <span className="text-white font-bold text-sm">{formatCurrency(Number(inv.amount))}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]">
                      {inv.receipt_url ? (
                        <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> View Deposit Receipt
                        </a>
                      ) : <span className="text-slate-600">No Receipt</span>}
                      <span className="text-slate-600">{formatDate(inv.created_at)}</span>
                    </div>

                    <form action={handleApprove}>
                      <input type="hidden" name="id" value={inv.id} />
                      <button type="submit" className="btn-primary w-full py-2 text-xs justify-center mt-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> Approve &amp; Activate
                      </button>
                    </form>
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
                    <th>Amount</th>
                    <th>ROI Rate</th>
                    <th>Expected ROI</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvestments.map((inv) => {
                    const invProfile = profileMap.get(inv.user_id) as { full_name?: string; email?: string } | undefined
                    const plan = inv.plan as { name?: string; roi_percentage?: number; duration_months?: number } | null
                    return (
                      <tr key={inv.id}>
                        <td>
                          <div className="font-medium text-white truncate max-w-[120px]">{invProfile?.full_name || 'Unknown Investor'}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{invProfile?.email || ''}</div>
                        </td>
                        <td className="font-medium">{plan?.name || 'Unknown Plan'}</td>
                        <td className="text-white font-bold">{formatCurrency(Number(inv.amount))}</td>
                        <td className="text-green-400">{plan?.roi_percentage ? `${plan.roi_percentage}%/yr` : '—'}</td>
                        <td className="text-green-400 font-semibold">{formatCurrency(Number(inv.expected_roi))}</td>
                        <td className="text-slate-400 text-xs">{inv.end_date ? formatDate(inv.end_date) : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
