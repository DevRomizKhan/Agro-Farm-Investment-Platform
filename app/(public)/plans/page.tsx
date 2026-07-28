import { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, ROUTES } from '@/constants'
import { Check, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, calculateROI, isPlanCurrentlyActive } from '@/lib/utils'
import type { InvestmentPlan } from '@/types'

export const metadata: Metadata = {
  title: `Investment Plans — ${APP_NAME}`,
  description: 'Explore Shariah-compliant, asset-backed cattle farm investment packages in Bangladesh.',
}

export const revalidate = 60

const steps = [
  { n: '01', title: 'Register & KYC', desc: 'Create your account and complete identity verification in under 5 minutes.' },
  { n: '02', title: 'Choose a Plan', desc: 'Select the investment tier that matches your budget and return goals.' },
  { n: '03', title: 'Cattle Allocation', desc: 'Capital is assigned to insured, IoT-monitored livestock units across our farms.' },
  { n: '04', title: 'Receive Dividends', desc: 'Monthly returns are deposited directly to your bank account or mobile wallet.' },
]

export default async function PlansPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true)
    .order('min_amount', { ascending: true })

  const plans = ((data || []) as InvestmentPlan[]).filter(isPlanCurrentlyActive)

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Page Hero ─────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            Shariah-Compliant Packages
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Investment <span className="gradient-text">Plans</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Backed by physical livestock, comprehensive insurance, and transparent quarterly reporting.
          </p>
        </div>
      </section>

      {/* ── Plans Grid ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {plans.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No investment plans are open right now</p>
            <p className="text-sm text-slate-500 mt-1">
              New agricultural packages are published regularly — please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => {
              const minAmount = Number(plan.min_amount)
              const maxAmount = Number(plan.max_amount)
              const roiPercentage = Number(plan.roi_percentage)
              const durationMonths = Number(plan.duration_months)
              const expectedReturnAtMin = calculateROI(minAmount, roiPercentage, durationMonths)

              return (
                <div
                  key={plan.id}
                  className="relative rounded-3xl p-8 flex flex-col bg-slate-900/50 border border-white/8 hover:border-white/20 transition-all"
                >
                  <h2 className="text-2xl font-black text-white mb-5">{plan.name}</h2>

                  {/* ROI */}
                  <div className="flex items-baseline gap-1 bg-slate-950/60 rounded-2xl px-4 py-4 mb-4 border border-white/5">
                    <span className="text-4xl font-black text-emerald-400 font-mono">{roiPercentage}%</span>
                    <span className="text-slate-400 text-xs ml-1">/ yr ROI</span>
                  </div>

                  {/* Range */}
                  <div className="bg-slate-950/80 rounded-xl px-4 py-3 mb-6 border border-white/5 space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">Capital Range</p>
                      <p className="text-sm font-bold text-white font-mono">
                        {formatCurrency(minAmount)} – {formatCurrency(maxAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">
                        Expected return on {formatCurrency(minAmount)}
                      </p>
                      <p className="text-sm font-bold text-emerald-400 font-mono">
                        {formatCurrency(expectedReturnAtMin)}
                      </p>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.description}</p>
                  )}

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    <li className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      Investor dashboard access
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      Digital deposit receipts
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ROI paid at maturity after {durationMonths} months
                    </li>
                  </ul>

                  <Link
                    href={ROUTES.REGISTER}
                    className="btn-secondary justify-center rounded-xl py-3.5 text-sm font-bold"
                  >
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

      {/* ── How It Works ──────────────────────────────── */}
      <section className="border-t border-white/5 bg-slate-900/30 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-white">How It Works</h2>
            <p className="text-slate-400 text-sm mt-2">Start earning in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 font-black text-xl font-mono">
                  {n}
                </div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
