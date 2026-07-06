import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShieldAlert, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'

export default async function AdminKYCManagementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch KYC submissions
  const { data: submissions } = await supabase
    .from('kyc_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch profiles for all users with KYC submissions
  const userIds = submissions?.map(s => s.user_id) || []
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email')
    .in('user_id', userIds)

  // Create a map of user_id to profile data
  const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p]) || [])

  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') || []
  const verifiedSubmissions = submissions?.filter(s => s.status === 'approved') || []
  const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected') || []

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">KYC Document Verification</h1>
          <p className="page-subtitle">Verify NID documentation and approve user accounts</p>
        </div>
      </div>

      {/* Grid of Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Queue */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Clock className="h-4.5 w-4.5 text-yellow-400" />
            Pending Verification ({pendingSubmissions.length})
          </h2>
          {pendingSubmissions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No pending KYC submissions</p>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map((sub) => {
                const userProfile = profileMap.get(sub.user_id) as { full_name?: string; email?: string } | undefined
                return (
                  <div key={sub.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-yellow-500/20 transition-colors flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{userProfile?.full_name || sub.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile?.email || sub.email}</p>
                      <p className="text-[10px] text-slate-600 mt-1">Submitted {sub.submitted_at ? formatDate(sub.submitted_at) : formatDate(sub.created_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${sub.id}`} className="btn-primary py-1.5 px-3 text-xs flex-shrink-0">
                      Review
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Verified Queue */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <CheckCircle className="h-4.5 w-4.5 text-green-400" />
            Approved Accounts ({verifiedSubmissions.length})
          </h2>
          {verifiedSubmissions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No approved submissions</p>
          ) : (
            <div className="space-y-3">
              {verifiedSubmissions.map((sub) => {
                const userProfile = profileMap.get(sub.user_id) as { full_name?: string; email?: string } | undefined
                return (
                  <div key={sub.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-green-500/20 transition-colors flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{userProfile?.full_name || sub.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile?.email || sub.email}</p>
                      <p className="text-[10px] text-slate-600 mt-1">Approved {formatDate(sub.reviewed_at || sub.updated_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${sub.id}`} className="btn-secondary py-1.5 px-3 text-xs flex-shrink-0">
                      View
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Rejected Queue */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <XCircle className="h-4.5 w-4.5 text-red-400" />
            Rejected Accounts ({rejectedSubmissions.length})
          </h2>
          {rejectedSubmissions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No rejected submissions</p>
          ) : (
            <div className="space-y-3">
              {rejectedSubmissions.map((sub) => {
                const userProfile = profileMap.get(sub.user_id) as { full_name?: string; email?: string } | undefined
                return (
                  <div key={sub.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-red-500/20 transition-colors flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{userProfile?.full_name || sub.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile?.email || sub.email}</p>
                      <p className="text-[10px] text-slate-600 mt-1">Rejected {formatDate(sub.reviewed_at || sub.updated_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${sub.id}`} className="btn-secondary py-1.5 px-3 text-xs flex-shrink-0">
                      View
                    </Link>
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
