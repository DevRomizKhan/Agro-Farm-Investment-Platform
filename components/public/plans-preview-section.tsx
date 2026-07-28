import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { ROUTES } from '@/constants'
import { formatCurrency } from '@/lib/utils'

const plans = [
  {
    name: 'Starter Plan',
    tag: 'Beginner Friendly',
    minAmount: 10000,
    maxAmount: 100000,
    roi: 12,
    duration: 12,
    popular: false,
    features: [
      'Monthly dividend payouts',
      '24/7 Investor portal access',
      'Digital receipts & certificates',
    ],
  },
  {
    name: 'Growth Plan',
    tag: 'Most Popular',
    minAmount: 100000,
    maxAmount: 500000,
    roi: 15,
    duration: 18,
    popular: true,
    features: [
      'Monthly dividend payouts',
      'Priority investor support',
      'Physical investment certificates',
      'Quarterly farm video reports',
    ],
  },
  {
    name: 'Premium Plan',
    tag: 'Maximum Returns',
    minAmount: 500000,
    maxAmount: 5000000,
    roi: 18,
    duration: 24,
    popular: false,
    features: [
      'Monthly dividend payouts',
      'Dedicated account manager',
      'Farm site visits & tours',
      'Custom investment terms',
    ],
  },
]

export function PlansPreviewSection() {
  return (
    <section id="plans" className="py-20 bg-slate-950 border-t border-white/5 relative">
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Investment Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Investment <span className="gradient-text">Plans</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Select a Shariah-compliant plan tailored to your financial goals.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 sm:p-8 rounded-3xl flex flex-col transition-all duration-300 ${
                plan.popular
                  ? 'bg-slate-900 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/40'
                  : 'bg-slate-900/40 border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 bg-emerald-500 text-slate-950 text-[11px] font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  {plan.tag}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center sm:justify-start gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {plan.roi}%
                  </span>
                  <span className="text-slate-400 text-xs font-medium">/ year ROI</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{plan.duration} months duration</p>
              </div>

              {/* Investment Range */}
              <div className="bg-slate-950/80 rounded-xl p-3.5 mb-6 border border-white/5 text-center sm:text-left">
                <p className="text-[11px] text-slate-400 mb-0.5">Investment Range</p>
                <p className="text-white font-bold font-mono text-sm">
                  {formatCurrency(plan.minAmount)} — {formatCurrency(plan.maxAmount)}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={ROUTES.REGISTER}
                className={plan.popular ? 'btn-primary justify-center py-3 rounded-xl text-sm font-semibold' : 'btn-secondary justify-center py-3 rounded-xl text-sm font-semibold'}
              >
                <span>Start Investing</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
