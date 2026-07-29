import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { ROUTES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

const staticPlans = [
  {
    name: 'Basic Investment',
    tag: 'Entry Level',
    totalShares: 150,
    sharesPerAmount: 10000,
    ownerSharePercentage: 40,
    maxSharesPerInvestor: 30,
    roi: 10,
    duration: 12,
    popular: false,
    features: [
      '10% annual ROI',
      '366-day lock period',
      'Share-based ownership',
      'Digital certificates',
    ],
  },
  {
    name: 'Standard Investment',
    tag: 'Most Popular',
    totalShares: 150,
    sharesPerAmount: 10000,
    ownerSharePercentage: 40,
    maxSharesPerInvestor: 30,
    roi: 14,
    duration: 12,
    popular: true,
    features: [
      '14% annual ROI',
      '366-day lock period',
      'Up to 30 shares per investor',
      'Priority support',
    ],
  },
  {
    name: 'Premium Investment',
    tag: 'High Returns',
    totalShares: 150,
    sharesPerAmount: 10000,
    ownerSharePercentage: 40,
    maxSharesPerInvestor: 30,
    roi: 18,
    duration: 12,
    popular: false,
    features: [
      '18% annual ROI',
      '366-day lock period',
      'Maximum share allocation',
      'Dedicated account manager',
    ],
  },
]

type DisplayPlan = {
  id?: string
  name: string
  tag?: string
  totalShares?: number
  sharesPerAmount?: number
  ownerSharePercentage?: number
  maxSharesPerInvestor?: number
  total_shares?: number
  shares_per_amount?: number
  max_shares_per_investor?: number
  roi?: string | number
  roi_percentage?: number
  duration?: number
  duration_months?: number
  popular?: boolean
  features?: string[]
}

export async function PlansPreviewSection() {
  const supabase = await createClient()

  // Fetch all active plans
  const { data: plans } = await supabase
    .from('investment_plans')
    .select('id, name, total_shares, shares_per_amount, max_shares_per_investor, roi_percentage, duration_months, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  // Calculate sold shares for each plan
  const planIds = plans?.map(p => p.id) || []
  const { data: planInvestments } = await supabase
    .from('investments')
    .select('plan_id, shares_purchased')
    .in('plan_id', planIds)
    .eq('status', 'active')

  const planSharesSold: Record<string, number> = {}
  planInvestments?.forEach(inv => {
    planSharesSold[inv.plan_id] = (planSharesSold[inv.plan_id] || 0) + inv.shares_purchased
  })

  // Use real plans if available, otherwise use static plans
  const displayPlans = (plans && plans.length > 0 ? plans : staticPlans) as DisplayPlan[]
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
          {displayPlans.map((plan) => {
            const availableShares = plan.id ? (plan.total_shares || 150) - (planSharesSold[plan.id] || 0) : plan.totalShares
            const isRealPlan = !!plan.id

            return (
              <div
                key={isRealPlan ? plan.id : plan.name}
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
                      {plan.roi || plan.roi_percentage}%
                    </span>
                    <span className="text-slate-400 text-xs font-medium">/ year ROI</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{plan.duration || plan.duration_months} months duration</p>
                </div>

                {/* Share Information */}
                <div className="bg-slate-950/80 rounded-xl p-3.5 mb-6 border border-white/5 text-center sm:text-left">
                  <p className="text-[11px] text-slate-400 mb-0.5">Share Details</p>
                  <p className="text-white font-bold font-mono text-sm">
                    {formatCurrency(isRealPlan ? (plan.shares_per_amount || 10000) : (plan.sharesPerAmount || 10000))} per share
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-green-400">
                      {availableShares} available
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Total: {isRealPlan ? (plan.total_shares || 150) : plan.totalShares}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Max per investor: {isRealPlan ? (plan.max_shares_per_investor || 30) : plan.maxSharesPerInvestor} shares
                  </p>
                </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {(plan.features || [
                  `${plan.roi || plan.roi_percentage}% annual ROI`,
                  '366-day lock period',
                  'Share-based ownership',
                  'Digital certificates',
                ]).map((f: string) => (
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
            )
          })}
        </div>

      </div>
    </section>
  )
}
