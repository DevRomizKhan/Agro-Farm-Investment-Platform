'use client'

import { BadgeCheck, FileCheck2, HandCoins, ShieldCheck, Sprout, UserRoundPlus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

const stepIcons = [UserRoundPlus, ShieldCheck, BadgeCheck, HandCoins, Sprout, FileCheck2]

export function HowItWorksSection() {
  const { t } = useLanguage()

  return (
    <section className="bg-slate-950 py-24">
      <div className="section-container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-[0.24em] mb-4 mx-auto">
            <BadgeCheck className="h-4 w-4" />
            <span>{t.howItWorks.badge}</span>
          </div>
          <h2 className="mb-5 text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white">
            {t.howItWorks.titlePrefix}
            <span className="gradient-text">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {t.howItWorks.steps.map(({ step, title, description }, index) => {
            const Icon = stepIcons[index % stepIcons.length]
            const isLast = index === t.howItWorks.steps.length - 1

            return (
              <div
                key={step}
                className="group relative overflow-hidden rounded-2xl sm:rounded-[28px] border border-white/10 bg-slate-900/80 p-5 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_25px_80px_rgba(16,185,129,0.15)]"
              >
                {!isLast && (
                  <div className="absolute right-0 top-8 hidden h-[2px] w-12 bg-gradient-to-r from-emerald-500/40 to-transparent xl:block" />
                )}
                <div className="mb-4 sm:mb-6 flex items-start justify-between">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="rounded-full border border-white/10 bg-slate-950/70 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-black tracking-[0.24em] text-emerald-400">
                    {step}
                  </div>
                </div>
                <h3 className="mb-3 text-base sm:text-lg lg:text-[1.2rem] font-black text-white">{title}</h3>
                <p
                  className="text-sm sm:text-base leading-relaxed text-slate-300"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
