import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvestForm } from '@/components/features/investments/invest-form'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, Award, Calendar, ExternalLink, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import type { InvestmentPlan } from '@/types'

export default async function InvestmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Fetch KYC status
  const { data: kycSubmission } = await supabase
    .from('kyc_submissions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle()

  const isKYCApproved = kycSubmission?.status === 'approved'

  // Fetch plans (active)
  const { data: plans } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true)

  // Fetch investor's investments
  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(name, roi_percentage, duration_months)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Investments</h1>
          <p className="page-subtitle">Manage your portfolio and track expected ROI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Investments list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Investment History
            </h2>

            {!investments || investments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">No investment contracts found</p>
                <p className="text-xs text-slate-600 mt-1">Submit the investment request form on the right to begin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((inv) => {
                  const plan = inv.plan as { name?: string; roi_percentage?: number; duration_months?: number } | null
                  return (
                    <div key={inv.id} className="p-5 rounded-xl border border-white/5 bg-slate-900/40 hover:border-green-500/20 transition-colors space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-white text-base">{plan?.name || 'Unknown Plan'}</h3>
                          <p className="text-xs text-slate-500 mt-1">Contract ID: {inv.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <span className={
                          inv.status === 'active' ? 'badge-green' :
                          inv.status === 'pending' ? 'badge-yellow' :
                          inv.status === 'completed' ? 'badge-blue' : 'badge-red'
                        }>{inv.status}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-t border-b border-white/5 text-sm">
                        <div>
                          <span className="text-slate-500 text-xs block">Invested Amount</span>
                          <span className="text-white font-medium">{formatCurrency(Number(inv.amount))}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">Expected ROI {plan?.roi_percentage ? `(${plan.roi_percentage}%)` : ''}</span>
                          <span className="text-green-400 font-semibold">{formatCurrency(Number(inv.expected_roi))}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">Start Date</span>
                          <span className="text-white font-medium">{inv.start_date ? formatDate(inv.start_date) : '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">End Date</span>
                          <span className="text-white font-medium">{inv.end_date ? formatDate(inv.end_date) : '—'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Submitted on {formatDate(inv.created_at)}</span>
                        {inv.receipt_url && (
                          <a href={inv.receipt_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline inline-flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> View Deposit Receipt
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

        {/* Right: Investment Form */}
        <div>
          {!isKYCApproved ? (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <ShieldAlert className="h-5 w-5 text-yellow-400" />
                <h2 className="text-base font-semibold text-white">KYC Verification Required</h2>
              </div>
              <div className="py-6 text-center">
                <p className="text-slate-400 text-sm mb-4">
                  You must complete KYC verification before you can invest in any plans.
                </p>
                {!kycSubmission ? (
                  <Link href={ROUTES.INVESTOR_KYC} className="btn-primary w-full justify-center">
                    Complete KYC Verification
                  </Link>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5">
                    <p className="text-sm text-slate-400 mb-2">
                      Your KYC status is: <span className="font-semibold text-white">{kycSubmission.status}</span>
                    </p>
                    {kycSubmission.status === 'pending' && (
                      <p className="text-xs text-slate-500">Please wait for admin approval.</p>
                    )}
                    {kycSubmission.status === 'rejected' && (
                      <Link href={ROUTES.INVESTOR_KYC} className="text-green-400 hover:underline text-sm font-medium">
                        Resubmit KYC Documents
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <InvestForm plans={(plans || []) as InvestmentPlan[]} />
          )}
        </div>
      </div>
    </div>
  )
}
