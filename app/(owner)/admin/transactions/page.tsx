import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreditCard, ArrowUp, ArrowDown, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'

export default async function AdminTransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch investments as transactions
  const { data: transactions } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(name), profile:profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">View all investment transactions</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
          <CreditCard className="h-5 w-5 text-green-400" />
          <h2 className="font-semibold text-white">All Transactions ({transactions?.length || 0})</h2>
        </div>

        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Transactions Found</h3>
            <p className="text-slate-400 text-sm">No investment transactions have been recorded yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Investor</th>
                  <th>Plan</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx: any) => (
                  <tr key={tx.id}>
                    <td className="text-slate-400 text-xs">{formatDate(tx.created_at)}</td>
                    <td>
                      <div className="font-medium text-white">{(tx.profile as { full_name: string })?.full_name || '—'}</div>
                      <div className="text-xs text-slate-500">{(tx.profile as { email: string })?.email || '—'}</div>
                    </td>
                    <td className="text-slate-300">{(tx.plan as { name: string })?.name || '—'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <ArrowDown className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-slate-300 text-sm">Investment</span>
                      </div>
                    </td>
                    <td className="text-white font-medium">{formatCurrency(Number(tx.amount))}</td>
                    <td>
                      <span className={
                        tx.status === 'active' ? 'badge-green' :
                        tx.status === 'completed' ? 'badge-blue' :
                        tx.status === 'pending' ? 'badge-yellow' : 'badge-gray'
                      }>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
