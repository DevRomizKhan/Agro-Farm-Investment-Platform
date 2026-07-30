import { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, ROUTES } from '@/constants'
import { Check, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { formatCurrency, isPlanCurrentlyActive } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { RefreshButton } from '@/components/public/refresh-button'

export const metadata: Metadata = {
  title: `Investment Plans — ${APP_NAME}`,
  description: 'Explore Shariah-compliant, asset-backed cattle farm investment packages in Bangladesh. 10–18% annual returns.',
}

const HOW_IT_WORKS = [
  { n: '01', title: 'Register & Complete KYC', desc: 'Create your account and verify your identity in under 5 minutes.' },
  { n: '02', title: 'Choose a Plan', desc: 'Select the investment tier that fits your budget and return goals.' },
  { n: '03', title: 'Purchase Shares', desc: 'Your capital is allocated to insured, IoT-monitored livestock units.' },
  { n: '04', title: 'Receive Dividends', desc: 'Quarterly returns are deposited directly into your bank account.' },
]

/** Live share availability bar */
function ShareBar({ sold, total }: { sold: number; total: number }) {
  const pct = Math.min(100, Math.round((sold / total) * 100))
  const remaining = total - sold
  const almostFull = remaining <= Math.ceil(total * 0.2)

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-xs font-semibold ${almostFull ? 'text-orange-400' : 'text-emerald-400'}`}>
          {remaining} shares remaining
        </span>
        <span className="text-xs text-slate-500">{pct}% filled</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${almostFull ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {almostFull && remaining > 0 && (
        <p className="text-xs text-orange-400 mt-1.5 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" /> Filling fast — limited shares left
        </p>
      )}
      {remaining === 0 && (
        <p className="text-xs text-red-400 mt-1.5 font-medium">Plan fully subscribed</p>
      )}
    </div>
  )
}

const STATIC_PLANS = [
  {
    id: undefined as string | undefined,
    name: 'Basic Plan',
    tag: 'Entry Level',
    total_shares: 150,
    shares_per_amount: 10000,
    max_shares_per_investor: 30,
    roi_percentage: 10,
    duration_months: 12,
    popular: false,
    soldShares: 0,
    features: [
      '10% annual ROI',
      '366-day lock period',
      'Quarterly dividend payouts',
      'Digital investment certificate',
      'Email & portal support',
    ],
  },
  {
    id: undefined as string | undefined,
    name: 'Standard Plan',
    tag: 'Most Popular',
    total_shares: 150,
    shares_per_amount: 10000,
    max_shares_per_investor: 30,
    roi_percentage: 14,
    duration_months: 12,
    popular: true,
    soldShares: 0,
    features: [
      '14% annual ROI',
      '366-day lock period',
      'Up to 30 shares per investor',
      'Quarterly farm progress reports',
      'Priority investor support',
    ],
  },
  {
    id: undefined as string | undefined,
    name: 'Premium Plan',
    tag: 'Maximum Returns',
    total_shares: 150,
    shares_per_amount: 10000,
    max_shares_per_investor: 30,
    roi_percentage: 18,
    duration_months: 12,
    popular: false,
    soldShares: 0,
    features: [
      '18% annual ROI',
      '366-day lock period',
      'Maximum share allocation',
      'Dedicated account manager',
      'VIP farm visit & tour',
    ],
  },
]

export default async function PlansPage() {
  const supabase = await createClient()

  const { data: allActivePlans } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true)
    .order('roi_percentage', { ascending: true })

  const dbPlans = (allActivePlans || []).filter(p => isPlanCurrentlyActive(p))
  const hasRealPlans = dbPlans.length > 0

  // Sold shares per plan
  const planSharesSold: Record<string, number> = {}
  if (hasRealPlans) {
    const planIds = dbPlans.map(p => p.id)
    // Public users cannot read the investments table directly because of RLS.
    // Aggregate only the non-sensitive share count on the server with the
    // service-role client; no investment/user data is sent to the browser.
    const { data: soldData } = await createAdminClient()
      .from('investments')
      .select('plan_id, shares_purchased')
      .in('plan_id', planIds)
      .eq('status', 'active')

    soldData?.forEach(inv => {
      planSharesSold[inv.plan_id] = (planSharesSold[inv.plan_id] || 0) + Number(inv.shares_purchased || 0)
    })
  }

  const displayPlans = hasRealPlans
    ? dbPlans.map(p => ({
        id: p.id,
        name: p.name,
        tag: p.roi_percentage >= 16 ? 'Maximum Returns' : p.roi_percentage >= 12 ? 'Most Popular' : 'Entry Level',
        total_shares: p.total_shares || 150,
        shares_per_amount: p.shares_per_amount || 10000,
        max_shares_per_investor: p.max_shares_per_investor || 30,
        roi_percentage: p.roi_percentage,
        duration_months: p.duration_months,
        popular: p.roi_percentage >= 12 && p.roi_percentage < 16,
        soldShares: planSharesSold[p.id] || 0,
        features: (p.description ? [p.description] : []).concat([
          `${p.roi_percentage}% annual ROI`,
          `${p.duration_months}-month duration`,
          '366-day lock period',
          'Quarterly dividend payouts',
          'Digital investment certificate',
        ]).slice(0, 5),
      }))
    : STATIC_PLANS

  return (
    <div className="min-h-screen bg-slate-950">

      {/* Page Hero */}
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
            Asset-backed cattle farming with 10–18% annual returns. Fully insured, Shariah-compliant, and transparently managed.
          </p>
        </div>
      </section>

      {/* Live Availability notice */}
      <div className="max-w-6xl mx-auto px-4 mb-6 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Share availability updates in real time. Purchase now to secure your position.
        </p>
        <RefreshButton />
      </div>

      {/* Plans Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {displayPlans.map((plan) => {
            const isSoldOut = plan.id ? plan.soldShares >= plan.total_shares : false

            return (
              <div
                key={plan.id ?? plan.name}
                className={`relative rounded-3xl p-8 flex flex-col transition-all ${
                  plan.popular
                    ? 'bg-slate-900 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950/40 md:scale-105'
                    : 'bg-slate-900/50 border border-white/8 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-full uppercase tracking-wide">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{plan.tag}</p>
                <h2 className="text-2xl font-black text-white mb-5">{plan.name}</h2>

                {/* ROI */}
                <div className="flex items-baseline gap-1 bg-slate-950/60 rounded-2xl px-4 py-4 mb-4 border border-white/5">
                  <span className="text-4xl font-black text-emerald-400 font-mono">{plan.roi_percentage}%</span>
                  <span className="text-slate-400 text-xs ml-1">/ yr ROI</span>
                </div>

                {/* Share details */}
                <div className="bg-slate-950/80 rounded-xl px-4 py-3 mb-4 border border-white/5">
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-slate-400 mb-0.5">Price / Share</p>
                      <p className="text-white font-bold font-mono">{formatCurrency(plan.shares_per_amount)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5">Duration</p>
                      <p className="text-white font-bold">{plan.duration_months} months</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 mb-0.5">Max per investor</p>
                      <p className="text-white font-bold">{plan.max_shares_per_investor} shares · {formatCurrency(plan.max_shares_per_investor * plan.shares_per_amount)} max</p>
                    </div>
                  </div>

                  {/* Live share bar */}
                  {plan.id && <ShareBar sold={plan.soldShares} total={plan.total_shares} />}
                  {!plan.id && (
                    <div className="text-xs text-slate-500 text-center py-1">{plan.total_shares} total shares available</div>
                  )}
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
                  href={isSoldOut ? '#' : ROUTES.REGISTER}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    isSoldOut
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {isSoldOut ? 'Sold Out' : 'Start Investing'}
                  {!isSoldOut && <ArrowRight className="h-4 w-4" />}
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/5 bg-slate-900/30 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-white">How It Works</h2>
            <p className="text-slate-400 text-sm mt-2">Start earning in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ n, title, desc }) => (
              <div key={n} className="text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 font-black text-xl font-mono">
                  {n}
                </div>
                <h3 className="font-bold text-white text-sm">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
