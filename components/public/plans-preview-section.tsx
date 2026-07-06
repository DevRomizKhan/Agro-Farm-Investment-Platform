import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { ROUTES } from '@/constants'
import { formatCurrency } from '@/lib/utils'

const plans = [
  {
    name: 'Starter Plan',
    tag: 'For Beginners',
    minAmount: 10000,
    maxAmount: 100000,
    roi: 12,
    duration: 12,
    color: 'slate',
    popular: false,
    features: [
      'Monthly ROI payouts',
      'Investor dashboard access',
      'Digital receipts',
      'Email support',
    ],
  },
  {
    name: 'Growth Plan',
    tag: 'Most Popular',
    minAmount: 100000,
    maxAmount: 500000,
    roi: 15,
    duration: 18,
    color: 'green',
    popular: true,
    features: [
      'Monthly ROI payouts',
      'Priority support',
      'Investment certificates',
      'ROI reinvestment option',
      'Quarterly farm reports',
    ],
  },
  {
    name: 'Premium Plan',
    tag: 'Maximum Returns',
    minAmount: 500000,
    maxAmount: 5000000,
    roi: 18,
    duration: 24,
    color: 'earth',
    popular: false,
    features: [
      'Monthly ROI payouts',
      'Dedicated account manager',
      'Farm site visits',
      'Custom investment terms',
      'Annual profit sharing',
      'Priority KYC processing',
    ],
  },
]

export function PlansPreviewSection() {
  return (
    <section className="py-24 bg-slate-900/50">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="badge-green mb-4 mx-auto w-fit">Investment Plans</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="gradient-text">Investment Plan</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Flexible plans designed for every investor — from first-time participants to seasoned
            capital allocators.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass-card p-7 flex flex-col transition-all duration-300 ${
                plan.popular
                  ? 'border-green-500/40 shadow-xl shadow-green-500/10 scale-105'
                  : 'hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg shadow-green-500/40">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <span className="badge-green text-xs mb-3">{plan.tag}</span>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-4">
                  <span className="text-4xl font-bold text-white">{plan.roi}%</span>
                  <span className="text-slate-400 text-sm mb-1.5">/ year ROI</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{plan.duration} months duration</p>
              </div>

              {/* Investment Range */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <p className="text-xs text-slate-500 mb-1">Investment Range</p>
                <p className="text-white font-medium">
                  {formatCurrency(plan.minAmount)} — {formatCurrency(plan.maxAmount)}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={ROUTES.REGISTER}
                className={plan.popular ? 'btn-primary justify-center' : 'btn-secondary justify-center'}
              >
                Start Investing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-slate-500 mt-8">
          All plans require KYC verification.{' '}
          <Link href={ROUTES.PLANS} className="text-green-400 hover:underline">
            View detailed plan information →
          </Link>
        </p>
      </div>
    </section>
  )
}
