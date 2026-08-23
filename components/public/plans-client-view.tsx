'use client'

import Link from 'next/link'
import { Check, ArrowRight, Sparkles, HandCoins, ShieldCheck, Sprout, UserRoundPlus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ROUTES } from '@/constants'
import { UpcomingPlanCard } from '@/components/public/upcoming-plans'
import { useLanguage } from '@/lib/i18n/context'

interface UpcomingPlanItem {
  id: string
  name: string
  totalShares: number
  sharePrice: number
  maxSharesPerInvestor: number
  roiPercentage: number
  durationMonths: number
  startsAt: string
}

interface DisplayPlanItem {
  id?: string
  name: string
  tag: string
  total_shares: number
  shares_per_amount: number
  max_shares_per_investor: number
  roi_percentage: number
  duration_months: number
  owner_share_percentage: number
  popular: boolean
  features: string[]
  featuresBn?: string[]
}

interface PlansClientViewProps {
  displayPlans: DisplayPlanItem[]
  upcomingPlans: UpcomingPlanItem[]
}

export function PlansClientView({ displayPlans, upcomingPlans }: PlansClientViewProps) {
  const { lang, t } = useLanguage()

  const howItWorks = lang === 'bn' ? [
    { n: '০১', title: 'নিবন্ধন ও কেওয়াইসি', desc: 'মাত্র ৫ মিনিটে আপনার NID ও ব্যক্তিগত তথ্য দিয়ে পরিচয় জমা দিন।' },
    { n: '০২', title: 'শেয়ার বাছাই করুন', desc: 'প্রতি শেয়ার ৳১,০০০ টাকা হারে আপনার পছন্দমতো শেয়ার নির্বাচন করুন।' },
    { n: '০৩', title: 'মূল সম্পদে বিনিয়োগ', desc: 'আপনার অর্থ সরাসরি গরুর মোটাতাজাকরণ ও মৎস্য উৎপাদনের মূল সম্পদে যুক্ত হবে।' },
    { n: '০৪', title: 'বাৎসরিক লভ্যাংশ পান', desc: 'প্রকল্পের সব খরচ বাদ দিয়ে বাৎসরিক নিট লভ্যাংশ আপনার অ্যাকাউন্টে যুক্ত হবে।' },
  ] : [
    { n: '01', title: 'Register & Verify', desc: 'Create your account and complete your identity check in minutes using your NID.' },
    { n: '02', title: 'Choose Your Shares', desc: 'Select the number of shares you want at BDT 1,000 each through approved payment channels.' },
    { n: '03', title: 'Own Production Assets', desc: 'Your capital is allocated to cow and fish production under real Sharia-compliant ownership.' },
    { n: '04', title: 'Receive Annual Dividends', desc: 'Net dividends are calculated after all expenses and distributed to your account each year.' },
  ]

  const stepIcons = [UserRoundPlus, ShieldCheck, HandCoins, Sprout]

  return (
    <div className="min-h-screen bg-slate-950">

      {/* Page Hero */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            {lang === 'bn' ? 'প্রজেক্ট আদি — ২ বছর মেয়াদী কৃষি মালিকানা প্রোগ্রাম' : 'Project Adi — 2 Year Ownership Program'}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white leading-tight">
            {t.plans.titlePrefix}<span className="gradient-text">{t.plans.titleHighlight}</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.plans.subtitle}
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {displayPlans.map((plan, idx) => {
            const staticPlanBn = t.plans.staticPlans[idx]
            const name = lang === 'bn' && staticPlanBn ? staticPlanBn.name : plan.name
            const tag = lang === 'bn' 
              ? (plan.popular ? t.plans.mostPopular : plan.roi_percentage >= 16 ? 'উচ্চ লভ্যাংশ' : t.plans.entryLevel)
              : plan.tag
            const features = lang === 'bn' && staticPlanBn 
              ? staticPlanBn.features 
              : (lang === 'bn' && plan.featuresBn ? plan.featuresBn : plan.features)

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
                      ⭐ {t.plans.mostPopular}
                    </span>
                  </div>
                )}

                {!plan.popular && <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{tag}</p>}
                <h2 className="text-2xl font-black text-white mb-5">{name}</h2>

                {/* ROI */}
                <div className="flex items-baseline gap-1 bg-slate-950/60 rounded-2xl px-4 py-4 mb-4 border border-white/5">
                  <span className="text-4xl font-black text-emerald-400 font-mono">{plan.roi_percentage}%</span>
                  <span className="text-slate-400 text-xs ml-1">{t.plans.perYearRoi}</span>
                </div>

                {/* Share details */}
                <div className="bg-slate-950/80 rounded-xl px-4 py-3 mb-4 border border-white/5">
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-slate-400 mb-0.5">{t.plans.pricePerShare}</p>
                      <p className="text-white font-bold font-mono">{formatCurrency(plan.shares_per_amount)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5">{lang === 'bn' ? 'মেয়াদকাল' : 'Duration'}</p>
                      <p className="text-white font-bold">{plan.duration_months} {t.plans.months}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 mb-0.5">{t.plans.maxPerInvestor}</p>
                      <p className="text-white font-bold">{plan.max_shares_per_investor} {t.common.shares} · {formatCurrency(plan.max_shares_per_investor * plan.shares_per_amount)} {t.plans.maxLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={ROUTES.REGISTER}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {t.plans.startInvesting}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          })}
          {upcomingPlans.map(plan => <UpcomingPlanCard key={plan.id} plan={plan} />)}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/5 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-[2.15rem] font-black text-white sm:text-[2.7rem] lg:text-[3.2rem]">
              {lang === 'bn' ? 'যেভাবে কাজ করে' : 'How It Works'}
            </h2>
            <p className="mt-3 text-[1rem] leading-8 text-slate-400 sm:text-[1.08rem]">
              {lang === 'bn' ? 'মাত্র ৪টি সহজ ধাপে কৃষিতে নিরাপদ বিনিয়োগ শুরু করুন।' : 'Start earning in 4 simple steps.'}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map(({ n, title, desc }, index) => {
              const Icon = stepIcons[index % stepIcons.length]

              return (
                <div key={n} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-7 shadow-[0_16px_60px_rgba(0,0,0,0.22)]">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-sm font-black tracking-[0.24em] text-emerald-400">
                      {n}
                    </div>
                  </div>
                  <h3 className="mb-2 text-[1.1rem] font-black text-white sm:text-[1.2rem]">{title}</h3>
                  <p className="text-[0.98rem] leading-7 text-slate-400">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
