import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { InvestForm } from '@/components/features/investments/invest-form'
import { formatCurrency, formatDate, isPlanCurrentlyActive } from '@/lib/utils'
import { TrendingUp, ExternalLink, ShieldAlert, Clock, Lock, Unlock } from 'lucide-react'
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

  // Fetch ALL active-flagged plans (includes starts_at / ends_at) then filter client-side
  const { data: allPlans } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true)

  // Only show plans that are within their scheduled window right now
  const plans = (allPlans || []).filter((p) => isPlanCurrentlyActive(p)) as InvestmentPlan[]

  // Fetch investor's investments with withdrawal requests
  const { data: investments } = await supabase
    .from('investments')
    .select('*, plan:investment_plans(*), withdrawal_requests(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Calculate sold shares for each plan
  const planIds = plans.map(p => p.id)
  const { data: planInvestments } = planIds.length > 0
    ? await createAdminClient()
      .from('investments')
      .select('plan_id, shares_purchased')
      .in('plan_id', planIds)
      .eq('status', 'active')
    : { data: [] }

  const planSharesSold: Record<string, number> = {}
  planInvestments?.forEach(inv => {
    planSharesSold[inv.plan_id] = (planSharesSold[inv.plan_id] || 0) + inv.shares_purchased
  })

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
                <p className="text-xs text-slate-600 mt-1">
                  Submit the investment request form on the right to begin.
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

                  // Estimated ROI: principal × rate × duration (simple interest)
                  const estimatedROI =
                    plan?.roi_percentage && plan?.duration_months && Number(inv.amount) > 0
                      ? Math.floor(
                          Number(inv.amount) *
                            (plan.roi_percentage / 100) *
                            (plan.duration_months / 12)
                        )
                      : Number(inv.expected_roi)

                  // Check lock status
                  const now = new Date()
                  const lockExpiresAt = inv.lock_expires_at ? new Date(inv.lock_expires_at) : null
                  const isLocked = lockExpiresAt && now < lockExpiresAt
                  const daysUntilUnlock = lockExpiresAt && isLocked
                    ? Math.ceil((lockExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    : 0

                  // Check for pending withdrawal request
                  const pendingWithdrawal = inv.withdrawal_requests?.find(
                    (wr: { status: string }) => wr.status === 'pending'
                  )
                  const approvedWithdrawal = inv.withdrawal_requests?.find(
                    (wr: { status: string }) => wr.status === 'approved'
                  )

                  return (
                    <div
                      key={inv.id}
                      className="p-5 rounded-xl border border-white/5 bg-slate-900/40 hover:border-green-500/20 transition-colors space-y-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-white text-base">
                            {plan?.name || 'Unknown Plan'}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Contract ID: {inv.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <span
                          className={
                            inv.status === 'active'
                              ? 'badge-green'
                              : inv.status === 'pending'
                              ? 'badge-yellow'
                              : inv.status === 'completed'
                              ? 'badge-blue'
                              : 'badge-red'
                          }
                        >
                          {inv.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-t border-b border-white/5 text-sm">
                        <div>
                          <span className="text-slate-500 text-xs block">Shares Owned</span>
                          <span className="text-white font-medium">
                            {inv.shares_purchased || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">Invested Amount</span>
                          <span className="text-white font-medium">
                            {formatCurrency(Number(inv.amount))}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">
                            Estimated ROI
                            {plan?.roi_percentage ? ` (${plan.roi_percentage}%+)` : ''}
                          </span>
                          <span className="text-green-400 font-semibold">
                            {formatCurrency(estimatedROI)}+
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-xs block">Lock Status</span>
                          <div className="flex items-center gap-1">
                            {isLocked ? (
                              <>
                                <Lock className="h-3 w-3 text-yellow-400" />
                                <span className="text-yellow-400 font-medium text-xs">
                                  {daysUntilUnlock} days
                                </span>
                              </>
                            ) : (
                              <>
                                <Unlock className="h-3 w-3 text-green-400" />
                                <span className="text-green-400 font-medium text-xs">
                                  Unlocked
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Withdrawal Request Status */}
                      {pendingWithdrawal && (
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-xs text-yellow-400 font-medium">
                            Pending withdrawal request of {formatCurrency(pendingWithdrawal.amount)} ({pendingWithdrawal.withdrawal_type})
                          </p>
                        </div>
                      )}

                      {approvedWithdrawal && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-xs text-green-400 font-medium">
                            Withdrawal approved - Payment processing within 3 months
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">
                          Submitted on {formatDate(inv.created_at)}
                        </span>
                        {inv.receipt_url && (
                          <a
                            href={inv.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:underline inline-flex items-center gap-1"
                          >
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

        {/* Right: Investment Form or KYC gate */}
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
                      Your KYC status is:{' '}
                      <span className="font-semibold text-white">{kycSubmission.status}</span>
                    </p>
                    {kycSubmission.status === 'pending' && (
                      <p className="text-xs text-slate-500">Please wait for admin approval.</p>
                    )}
                    {kycSubmission.status === 'rejected' && (
                      <Link
                        href={ROUTES.INVESTOR_KYC}
                        className="text-green-400 hover:underline text-sm font-medium"
                      >
                        Resubmit KYC Documents
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : plans.length === 0 ? (
            /* No currently-open plans */
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <Clock className="h-5 w-5 text-slate-400" />
                <h2 className="text-base font-semibold text-white">No Plans Available</h2>
              </div>
              <div className="py-8 text-center">
                <Clock className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  There are no investment plans open for subscription right now.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Please check back later or contact support for upcoming plan schedules.
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
