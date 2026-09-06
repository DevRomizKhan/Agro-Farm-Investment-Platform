'use client'

import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { ROUTES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { UpcomingPlanCard, type UpcomingPlan } from '@/components/public/upcoming-plans'
import { useLanguage } from '@/lib/i18n/context'
import { PlanRealtimeRefresh } from '@/components/realtime/plan-realtime-refresh'

export interface ActivePlanItem {
  id?: string
  name: string
  description: string | null
  display_label: string | null
  highlights: string[]
  is_featured: boolean
  total_shares: number
  shares_per_amount: number
  max_shares_per_investor: number
  roi_percentage: number
  duration_months: number
  owner_share_percentage: number
}

interface PlansPreviewClientProps {
  activePlans: ActivePlanItem[]
  upcomingPlans: UpcomingPlan[]
}

export function PlansPreviewClient({ activePlans, upcomingPlans }: PlansPreviewClientProps) {
  const { t } = useLanguage()

  return (
    <section id="plans" className="py-20 bg-slate-950 border-t border-white/5 relative">
      <PlanRealtimeRefresh />
      <div className="section-container">

        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="h-4 w-4" />
            <span>{t.plans.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t.plans.titlePrefix}<span className="gradient-text">{t.plans.titleHighlight}</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.plans.subtitle}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {activePlans.map((plan) => (
            <div
              key={plan.id ?? plan.name}
              className={`relative p-6 sm:p-8 rounded-3xl flex flex-col transition-all duration-300 ${
                plan.is_featured
                  ? 'bg-slate-900 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/40'
                  : 'bg-slate-900/40 border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.is_featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full uppercase tracking-wider">
                    {t.plans.mostPopular}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-5">
                {plan.display_label && (
                  <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    {plan.display_label}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                {plan.description && <p className="text-sm leading-6 text-slate-400 mb-3">{plan.description}</p>}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-extrabold text-white font-mono">
                    {plan.roi_percentage}%
                  </span>
                  <span className="text-slate-300 text-sm font-medium">{t.plans.perYearRoi}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1.5">{plan.duration_months} {t.plans.months} · ৳{(plan.shares_per_amount || 1000).toLocaleString()} {t.plans.perShareText}</p>
              </div>

              {/* Share details box */}
              <div className="bg-slate-950/80 rounded-xl p-4 mb-5 border border-white/5">
                <div className="grid grid-cols-2 gap-2.5 text-sm">
                  <div>
                    <p className="text-slate-400 mb-0.5">{t.plans.pricePerShare}</p>
                    <p className="text-white font-semibold font-mono">{formatCurrency(plan.shares_per_amount || 1000)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">{t.plans.totalShares}</p>
                    <p className="text-white font-semibold font-mono">{plan.total_shares}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 mb-0.5">{t.plans.maxPerInvestor}</p>
                    <p className="text-white font-semibold">{plan.max_shares_per_investor} ({formatCurrency((plan.max_shares_per_investor || 30) * (plan.shares_per_amount || 1000))} {t.plans.maxLabel})</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {plan.highlights.length > 0 && <ul className="space-y-3 mb-6 flex-1">
                {plan.highlights.map((f, index) => (
                  <li key={`${plan.id ?? plan.name}-${index}`} className="flex items-center gap-2.5 text-sm text-slate-200">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>}

              {/* CTA */}
              <Link
                href={ROUTES.REGISTER}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold transition-all ${
                  plan.is_featured ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <span>{t.plans.startInvesting}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
          {upcomingPlans.map((plan) => (
            <UpcomingPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href={ROUTES.PLANS} className="text-base font-medium text-slate-300 hover:text-emerald-400 transition-colors inline-flex items-center gap-2">
            {t.plans.viewAllDetails} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
