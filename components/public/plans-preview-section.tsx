import Link from 'next/link'
import { ArrowRight, Check, Sparkles, AlertCircle } from 'lucide-react'
import { ROUTES } from '@/constants'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/** Live share availability bar */
function ShareBar({ sold, total, ownerPercentage = 40 }: { sold: number; total: number; ownerPercentage?: number }) {
  const ownerShares = Math.floor(total * (ownerPercentage / 100))
  const investorShares = total - ownerShares
  const availableShares = Math.max(0, investorShares - sold)
  const pct = investorShares > 0 ? Math.min(100, Math.round((sold / investorShares) * 100)) : 0
  const remaining = availableShares
  const almostFull = remaining <= Math.ceil(investorShares * 0.2)

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-[11px] font-semibold ${almostFull ? 'text-orange-400' : 'text-emerald-400'}`}>
          {remaining} shares available
        </span>
        <span className="text-[11px] text-slate-500">{pct}% filled</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${almostFull ? 'bg-orange-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {almostFull && remaining > 0 && (
        <p className="text-[10px] text-orange-400 mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Limited availability
        </p>
      )}
    </div>
  )
}

const STATIC_PLANS = [
  {
    name: 'Basic Share Package',
    tag: 'Entry Level',
    total_shares: 1000,
    shares_per_amount: 1000,
    max_shares_per_investor: 100,
    roi_percentage: 12,
    duration_months: 24,
    owner_share_percentage: 40,
    popular: false,
    features: [
      'BDT 1,000 per share',
      '2-Year Program (July 2026 – June 2028)',
      'Cow & Fish production asset backing',
      'Sharia compliant net annual dividends',
    ],
  },
  {
    name: 'Standard Share Package',
    tag: 'Most Popular',
    total_shares: 1000,
    shares_per_amount: 1000,
    max_shares_per_investor: 500,
    roi_percentage: 15,
    duration_months: 24,
    owner_share_percentage: 40,
    popular: true,
    features: [
      'BDT 1,000 per share',
      '2-Year Program (July 2026 – June 2028)',
      'Up to 500 shares per investor',
      '6-Month dividend updates & annual audits',
    ],
  },
  {
    name: 'Premium Share Package',
    tag: 'Maximum Allocation',
    total_shares: 1000,
    shares_per_amount: 1000,
    max_shares_per_investor: 1000,
    roi_percentage: 18,
    duration_months: 24,
    owner_share_percentage: 40,
    popular: false,
    features: [
      'BDT 1,000 per share',
      '2-Year Program (July 2026 – June 2028)',
      'Full asset liquidation distribution in 2029',
      'Priority investor support & reports',
    ],
  },
]

export async function PlansPreviewSection() {
  const supabase = await createClient()

  const { data: dbPlans } = await supabase
    .from('investment_plans')
    .select('id, name, total_shares, shares_per_amount, max_shares_per_investor, roi_percentage, duration_months, owner_share_percentage, created_at')
    .eq('is_active', true)
    .order('roi_percentage', { ascending: true })
    .limit(3)

  const hasRealPlans = dbPlans && dbPlans.length > 0

  // Fetch sold shares for real plans
  const planSharesSold: Record<string, number> = {}
  if (hasRealPlans) {
    const planIds = dbPlans.map(p => p.id)
    // Public users cannot read the investments table directly because of RLS.
    // Keep the privileged query server-side and expose only aggregated counts.
    const { data: soldData } = await createAdminClient()
      .from('investments')
      .select('plan_id, shares_purchased')
      .in('plan_id', planIds)
      .eq('status', 'active')

    soldData?.forEach(inv => {
      planSharesSold[inv.plan_id] = (planSharesSold[inv.plan_id] || 0) + Number(inv.shares_purchased || 0)
    })
  }

  const plans = hasRealPlans
    ? dbPlans.map(p => ({
        id: p.id,
        name: p.name,
        tag: p.roi_percentage >= 16 ? 'High Returns' : p.roi_percentage >= 12 ? 'Most Popular' : 'Entry Level',
        total_shares: p.total_shares,
        shares_per_amount: p.shares_per_amount || 1000,
        max_shares_per_investor: p.max_shares_per_investor,
        roi_percentage: p.roi_percentage,
        duration_months: p.duration_months || 24,
        owner_share_percentage: p.owner_share_percentage || 40,
        popular: p.roi_percentage >= 12 && p.roi_percentage < 16,
        soldShares: planSharesSold[p.id] || 0,
        features: [
          `BDT ${(p.shares_per_amount || 1000).toLocaleString()} per share`,
          '2-Year Program (July 2026 – June 2028)',
          `Max ${p.max_shares_per_investor} shares per investor`,
          'Cow & Fish production asset backing',
        ],
      }))
    : STATIC_PLANS.map(p => ({ ...p, id: undefined, soldShares: 0 }))

  return (
    <section id="plans" className="py-20 bg-slate-950 border-t border-white/5 relative">
      <div className="section-container">

        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Investment Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Project Adi <span className="gradient-text">Packages</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Shariah-compliant, asset-backed program starting at BDT 1,000 per share (Cow &amp; Fish Production).
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id ?? plan.name}
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
              <div className="mb-5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  {plan.tag}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {plan.roi_percentage}%
                  </span>
                  <span className="text-slate-400 text-xs font-medium">/ year ROI</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{plan.duration_months} months · ৳{(plan.shares_per_amount || 10000).toLocaleString()} per share</p>
              </div>

              {/* Live share availability */}
              {plan.id && (
                <div className="mb-5">
                  <ShareBar sold={plan.soldShares} total={plan.total_shares} ownerPercentage={plan.owner_share_percentage || 40} />
                </div>
              )}

              {/* Share details box */}
              <div className="bg-slate-950/80 rounded-xl p-3.5 mb-5 border border-white/5">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400 mb-0.5">Price / Share</p>
                    <p className="text-white font-semibold font-mono">{formatCurrency(plan.shares_per_amount || 10000)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-0.5">Total Shares</p>
                    <p className="text-white font-semibold font-mono">{plan.total_shares}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 mb-0.5">Max Per Investor</p>
                    <p className="text-white font-semibold">{plan.max_shares_per_investor} shares ({formatCurrency((plan.max_shares_per_investor || 30) * (plan.shares_per_amount || 10000))} max)</p>
                  </div>
                </div>
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
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.popular ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <span>Start Investing</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href={ROUTES.PLANS} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
            View all plan details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </section>
  )
}
