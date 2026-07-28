import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, calculateROI, isPlanCurrentlyActive } from '@/lib/utils'
import { APP_NAME, APP_DESCRIPTION, ROUTES } from '@/constants'
import type { InvestmentPlan } from '@/types'

export const metadata: Metadata = {
  title: `Investment Plans - ${APP_NAME}`,
  description: `Compare agricultural investment plans, ROI rates, durations, and investment limits. ${APP_DESCRIPTION}`,
}

export const revalidate = 60

export default async function PlansPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true)
    .order('min_amount', { ascending: true })

  const plans = ((data || []) as InvestmentPlan[]).filter(isPlanCurrentlyActive)

  return (
    <div className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="badge-green mb-4 mx-auto w-fit">Investment Plans</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Investment Plan</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Every plan is backed by real agricultural operations. Returns shown are the expected ROI at
            maturity for the full plan duration.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-24">
        {plans.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No investment plans are open right now</p>
            <p className="text-sm text-slate-500 mt-1">
              New agricultural packages are published regularly — please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const minAmount = Number(plan.min_amount)
              const maxAmount = Number(plan.max_amount)
              const roiPercentage = Number(plan.roi_percentage)
              const durationMonths = Number(plan.duration_months)
              const expectedReturnAtMin = calculateROI(minAmount, roiPercentage, durationMonths)

              return (
                <div key={plan.id} className="glass-card p-7 flex flex-col hover:border-white/20 transition-all">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
                    <div className="flex items-end gap-1 mt-4">
                      <span className="text-4xl font-bold text-white">{roiPercentage}%</span>
                      <span className="text-slate-400 text-sm mb-1.5">/ year ROI</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{durationMonths} months duration</p>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">{plan.description}</p>
                  )}

                  <div className="bg-slate-800/50 rounded-xl p-4 mb-6 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Investment Range</p>
                      <p className="text-white font-medium">
                        {formatCurrency(minAmount)} — {formatCurrency(maxAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Expected return on a {formatCurrency(minAmount)} investment
                      </p>
                      <p className="text-green-400 font-semibold">{formatCurrency(expectedReturnAtMin)}</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    <li className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      Investor dashboard access
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      Digital deposit receipts
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ROI paid at maturity after {durationMonths} months
                    </li>
                  </ul>

                  <Link href={ROUTES.REGISTER} className="btn-primary justify-center">
                    Start Investing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-10">
          All plans require KYC verification before an investment request can be submitted.
        </p>
      </section>
    </div>
  )
}
