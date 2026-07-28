import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlanForm } from '@/components/features/investments/plan-form'
import { DeletePlanButton } from '@/components/features/admin/delete-plan-button'
import { formatCurrency, isPlanCurrentlyActive } from '@/lib/utils'
import { FileText, Plus, Edit, CalendarClock, Clock, CheckCircle2, XCircle, Timer } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import type { InvestmentPlan } from '@/types'

/** Returns a human-friendly status label + badge colour for a plan in the admin panel */
function getPlanStatus(plan: InvestmentPlan): {
  label: string
  badge: string
  icon: React.ReactNode
} {
  if (!plan.is_active) {
    return {
      label: 'Disabled',
      badge: 'badge-gray',
      icon: <XCircle className="h-3.5 w-3.5" />,
    }
  }

  const now = Date.now()

  if (plan.starts_at && now < new Date(plan.starts_at).getTime()) {
    return {
      label: 'Scheduled',
      badge: 'badge-yellow',
      icon: <Timer className="h-3.5 w-3.5" />,
    }
  }

  if (plan.ends_at && now >= new Date(plan.ends_at).getTime()) {
    return {
      label: 'Expired',
      badge: 'badge-red',
      icon: <XCircle className="h-3.5 w-3.5" />,
    }
  }

  return {
    label: 'Live',
    badge: 'badge-green',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  }
}

/** Format a datetime string into a short human-readable form */
function fmtDt(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default async function AdminPlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch all plans (include starts_at / ends_at)
  const { data: plans } = await supabase
    .from('investment_plans')
    .select(
      'id, name, description, min_amount, max_amount, roi_percentage, duration_months, is_active, starts_at, ends_at, created_at, investments(count)'
    )
    .order('created_at', { ascending: false })

  // Check which plans have active investments (blocks deletion)
  const planIds = plans?.map((p) => p.id) || []
  const { data: activeInvestments } = await supabase
    .from('investments')
    .select('plan_id')
    .eq('status', 'active')
    .in('plan_id', planIds)

  const activePlanIds = new Set(activeInvestments?.map((i) => i.plan_id) || [])

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Investment Plans Management</h1>
          <p className="page-subtitle">
            Configure agricultural investment packages, ROI rates, limits, and visibility schedules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Plans List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              Existing Investment Plans ({plans?.length || 0})
            </h2>

            {!plans || plans.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-12">
                No investment plans configured yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const typedPlan = plan as unknown as InvestmentPlan
                  const status = getPlanStatus(typedPlan)
                  const isCurrentlyLive = isPlanCurrentlyActive(typedPlan)

                  return (
                    <div
                      key={plan.id}
                      className="p-5 rounded-xl border border-white/5 bg-slate-900/40 space-y-4 hover:border-green-500/20 transition-all"
                    >
                      {/* Plan header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-white text-base">{plan.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {plan.duration_months} Months Duration
                          </p>
                        </div>
                        <span className={`${status.badge} inline-flex items-center gap-1`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>

                      {plan.description && (
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {plan.description}
                        </p>
                      )}

                      {/* Financials */}
                      <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-white/5">
                        <div>
                          <span className="text-slate-500 block">Min Amount</span>
                          <span className="text-white font-medium">
                            {formatCurrency(Number(plan.min_amount))}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Max Amount</span>
                          <span className="text-white font-medium">
                            {formatCurrency(Number(plan.max_amount))}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-500 block">Annual ROI Rate</span>
                          <span className="text-green-400 font-bold text-sm">
                            {plan.roi_percentage}% / Year
                          </span>
                        </div>
                      </div>

                      {/* Visibility Schedule */}
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-400">
                            Visibility Schedule
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 block">Opens At</span>
                            <span
                              className={
                                plan.starts_at ? 'text-slate-200' : 'text-slate-600 italic'
                              }
                            >
                              {fmtDt(plan.starts_at)}
                              {!plan.starts_at && ' (immediate)'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Closes At</span>
                            <span
                              className={
                                plan.ends_at ? 'text-slate-200' : 'text-slate-600 italic'
                              }
                            >
                              {fmtDt(plan.ends_at)}
                              {!plan.ends_at && ' (no expiry)'}
                            </span>
                          </div>
                        </div>

                        {/* Live indicator */}
                        <div
                          className={`mt-1 inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${
                            isCurrentlyLive
                              ? 'bg-green-500/10 border-green-500/20 text-green-400'
                              : 'bg-slate-800/50 border-white/5 text-slate-500'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isCurrentlyLive ? 'bg-green-400 animate-pulse' : 'bg-slate-600'
                            }`}
                          />
                          {isCurrentlyLive ? 'Visible to investors now' : 'Hidden from investors'}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-white/5">
                        <Link
                          href={`${ROUTES.ADMIN_PLANS}/${plan.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800/50 text-white text-xs font-medium hover:bg-slate-700/50 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <DeletePlanButton
                          planId={plan.id}
                          hasActiveInvestments={activePlanIds.has(plan.id)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Creation Form */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <Plus className="h-5 w-5 text-green-400" />
            <h2 className="text-base font-semibold text-white">Create New Plan</h2>
          </div>
          <PlanForm />
        </div>
      </div>
    </div>
  )
}
