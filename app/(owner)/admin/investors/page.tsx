import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Users, Mail, Calendar, CheckCircle, Clock, Edit, Trash2, Eye } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import Link from 'next/link'

export default async function AdminInvestorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch all investors
  const { data: investors } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email, phone, created_at, investments(count)')
    .eq('role', 'investor')
    .order('created_at', { ascending: false })

  // Fetch all KYC submissions
  const { data: kycSubmissions } = await supabase
    .from('kyc_submissions')
    .select('user_id, status')

  // Create a map of user_id to KYC status
  const kycStatusMap = new Map(kycSubmissions?.map((k: any) => [k.user_id, k.status]) || [])

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Investor Management</h1>
          <p className="page-subtitle">View and manage all registered investors</p>
        </div>
      </div>

      {/* Investors Table */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
          <Users className="h-5 w-5 text-green-400" />
          <h2 className="font-semibold text-white">All Investors ({investors?.length || 0})</h2>
        </div>

        {!investors || investors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Investors Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              No investors have registered yet.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>KYC Status</th>
                  <th>Investments</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((investor: any) => {
                  const kycStatus = kycStatusMap.get(investor.user_id) || 'not_submitted'
                  return (
                    <tr key={investor.id}>
                      <td>
                        <div className="font-medium text-white">{investor.full_name || '—'}</div>
                      </td>
                      <td className="text-slate-400 text-sm">{investor.email}</td>
                      <td className="text-slate-400 text-sm">{investor.phone || '—'}</td>
                      <td>
                        <span className={
                          kycStatus === 'approved' ? 'badge-green' :
                          kycStatus === 'pending' ? 'badge-yellow' :
                          kycStatus === 'rejected' ? 'badge-red' : 'badge-gray'
                        }>
                          {kycStatus === 'not_submitted' ? 'Not Submitted' : kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                        </span>
                      </td>
                      <td className="text-white font-medium">{investor.investments?.[0]?.count || 0}</td>
                      <td className="text-slate-400 text-xs">{formatDate(investor.created_at)}</td>
                      <td>
                        <div className="flex gap-1.5">
                          <Link
                            href={`${ROUTES.ADMIN_INVESTORS}/${investor.id}`}
                            className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`${ROUTES.ADMIN_INVESTORS}/${investor.id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                            title="Edit Investor"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                          <form action={async () => {
                            'use server'
                            // Delete investor action would go here
                            // For now, just log
                            console.log('Delete investor:', investor.id)
                          }}>
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete Investor"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </div>
                      </td>
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
