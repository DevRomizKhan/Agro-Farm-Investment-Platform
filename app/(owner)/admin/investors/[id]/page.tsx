import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, User, Mail, Phone, Calendar, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import Link from 'next/link'

export default async function InvestorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch investor details
  const { data: investor } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!investor) {
    redirect(ROUTES.ADMIN_INVESTORS)
  }

  // Fetch investor's investments
  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(name)')
    .eq('user_id', investor.user_id)
    .order('created_at', { ascending: false })

  // Fetch KYC status
  const { data: kycSubmission } = await supabase
    .from('kyc_submissions')
    .select('*')
    .eq('user_id', investor.user_id)
    .maybeSingle()

  const totalInvested = investments?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <Link href={ROUTES.ADMIN_INVESTORS} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Investors
        </Link>
        <div>
          <h1 className="page-title">Investor Details</h1>
          <p className="page-subtitle">View investor profile and investment history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/20 text-green-400 text-2xl font-bold">
                {investor.full_name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{investor.full_name || '—'}</h2>
                <p className="text-sm text-slate-400">{investor.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-300">{investor.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-300">Joined {formatDate(investor.created_at)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <span className={
                kycSubmission?.status === 'approved' ? 'badge-green' :
                kycSubmission?.status === 'pending' ? 'badge-yellow' :
                kycSubmission?.status === 'rejected' ? 'badge-red' : 'badge-gray'
              }>
                {kycSubmission?.status === 'not_submitted' ? 'Not Submitted' : kycSubmission?.status?.charAt(0).toUpperCase() + kycSubmission?.status?.slice(1) || 'Not Submitted'}
              </span>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Investment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Total Investments</span>
                <span className="text-white font-medium">{investments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Total Invested</span>
                <span className="text-white font-medium">{formatCurrency(totalInvested)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investments List */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Investment History
            </h2>

            {!investments || investments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No investments yet</p>
            ) : (
              <div className="space-y-3">
                {investments.map((inv: any) => (
                  <div key={inv.id} className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{(inv.plan as { name: string })?.name || 'Unknown Plan'}</p>
                        <p className="text-xs text-slate-500">{formatDate(inv.created_at)}</p>
                      </div>
                      <span className={inv.status === 'active' ? 'badge-green' : inv.status === 'completed' ? 'badge-blue' : 'badge-yellow'}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-sm text-slate-400">Amount</span>
                      <span className="text-white font-medium">{formatCurrency(Number(inv.amount))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
