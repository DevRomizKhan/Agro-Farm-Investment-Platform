import { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, ROUTES } from '@/constants'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export const metadata: Metadata = {
  title: `Investment Plans — ${APP_NAME}`,
  description: 'Explore Shariah-compliant, asset-backed cattle farm investment packages in Bangladesh.',
}

const plans = [
  {
    name: 'Starter',
    tag: 'Beginner Friendly',
    minAmount: 10000,
    maxAmount: 100000,
    roi: '12–14%',
    duration: 12,
    popular: false,
    features: [
      'Monthly dividend bank deposits',
      '24/7 investor portal access',
      'Digital investment certificate',
      'Email & phone support',
    ],
  },
  {
    name: 'Growth',
    tag: 'Most Popular',
    minAmount: 100000,
    maxAmount: 500000,
    roi: '15–17%',
    duration: 18,
    popular: true,
    features: [
      'Monthly dividend payouts',
      'Priority support hotline',
      'Physical investment agreement',
      'Quarterly farm video reports',
      'Reinvestment option',
    ],
  },
  {
    name: 'Premium',
    tag: 'Maximum Yield',
    minAmount: 500000,
    maxAmount: 5000000,
    roi: '18–22%',
    duration: 24,
    popular: false,
    features: [
      'Monthly dividend payouts',
      'Dedicated financial advisor',
      'VIP farm visit & tour',
      'Custom investment terms',
      'Annual profit-sharing bonus',
    ],
  },
]

const steps = [
  { n: '01', title: 'Register & KYC', desc: 'Create your account and complete identity verification in under 5 minutes.' },
  { n: '02', title: 'Choose a Plan', desc: 'Select the investment tier that matches your budget and return goals.' },
  { n: '03', title: 'Cattle Allocation', desc: 'Capital is assigned to insured, IoT-monitored livestock units across our farms.' },
  { n: '04', title: 'Receive Dividends', desc: 'Monthly returns are deposited directly to your bank account or mobile wallet.' },
]

export default function PlansPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.popular
                  ? 'bg-slate-900 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/40 md:scale-105'
                  : 'bg-slate-900/50 border border-white/8 hover:border-white/20'
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-full uppercase tracking-wide">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{plan.tag}</p>
              <h2 className="text-2xl font-black text-white mb-5">{plan.name} Plan</h2>

              {/* ROI */}
              <div className="flex items-baseline gap-1 bg-slate-950/60 rounded-2xl px-4 py-4 mb-4 border border-white/5">
                <span className="text-4xl font-black text-emerald-400 font-mono">{plan.roi}</span>
                <span className="text-slate-400 text-xs ml-1">/ yr ROI</span>
              </div>

              {/* Range */}
              <div className="bg-slate-950/80 rounded-xl px-4 py-3 mb-6 border border-white/5">
                <p className="text-[10px] text-slate-400 mb-0.5">Capital Range</p>
                <p className="text-sm font-bold text-white font-mono">
                  {formatCurrency(plan.minAmount)} – {formatCurrency(plan.maxAmount)}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={ROUTES.REGISTER}
                className={plan.popular
                  ? 'btn-primary justify-center rounded-xl py-3.5 text-sm font-bold'
                  : 'btn-secondary justify-center rounded-xl py-3.5 text-sm font-bold'}
              >
                Start Investing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
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
