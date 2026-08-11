'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Leaf, ShieldCheck, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { COMPANY_INFO, ROUTES } from '@/constants'
import { Reveal } from '@/components/ui/reveal'
import { CountUp } from '@/components/ui/count-up'
import { useLanguage } from '@/lib/i18n/context'

export function AboutSection() {
  const { lang, t } = useLanguage()
  const founderName = lang === 'bn' ? 'কাজী শাকিব' : COMPANY_INFO.founder
  const founderTitle = lang === 'bn' ? 'প্রতিষ্ঠাতা ও সিইও' : COMPANY_INFO.founderTitle

  const features = [
    { icon: ShieldCheck, label: t.about.features.shariah },
    { icon: TrendingUp, label: t.about.features.dividends },
    { icon: Users, label: t.about.features.ownership },
    { icon: Leaf, label: t.about.features.production },
  ]

  const stats = [
    { value: 2023, label: t.about.stats.founded },
    { value: 1, suffix: '+', label: t.about.stats.farmSites },
    { value: 4, suffix: '+', label: t.about.stats.activeInvestors },
  ]

  return (
    <section id="about" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none ambient-float" />

      <div className="section-container relative z-10">
        <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest">
              <Leaf className="h-4 w-4" />
              {t.about.badge}
            </div>

            <h2 className="text-[2.35rem] font-black leading-tight text-white sm:text-[2.9rem] lg:text-[3.7rem]">
              {t.about.titlePrefix}
              <span className="gradient-text">{t.about.titleHighlight}</span>
            </h2>

            <p className="text-[1.02rem] leading-8 text-slate-300 sm:text-[1.125rem]">
              {t.about.description}
            </p>

            <div className="grid grid-cols-2 gap-3.5 motion-stagger">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-200 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Key numbers */}
            <div className="flex gap-10 pt-4 border-t border-white/10">
              {stats.map(({ value, suffix, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black text-emerald-400 font-mono">
                    <CountUp value={value} suffix={suffix} label={`${value}${suffix || ''} ${label}`} />
                  </p>
                  <p className="text-sm text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <Link
              href={ROUTES.ABOUT}
              className="btn-secondary"
            >
              {t.about.learnMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl group">
              <Image
                src="/images/carousel/slide3.jpg"
                alt="Amanah Farm cattle operation in Bangladesh"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 sm:left-8 sm:right-8 rounded-2xl border border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur-md shadow-xl">
              <p className="text-base font-bold text-white">{t.about.managedBy} {founderName}</p>
              <p className="mt-1 text-sm text-slate-400">{founderTitle} · {COMPANY_INFO.farmLocations}</p>
            </div>
          </div>

        </Reveal>
      </div>
    </section>
  )
}
