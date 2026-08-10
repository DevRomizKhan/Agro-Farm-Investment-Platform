'use client'

import { ShieldCheck, TrendingUp, Clock, Users, Leaf, BarChart3 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

const icons = [ShieldCheck, TrendingUp, Clock, Users, Leaf, BarChart3]

export function WhyInvestSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-slate-950">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="badge-primary mb-4 mx-auto w-fit">{t.whyInvest.badge}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.whyInvest.titlePrefix}
            <span className="gradient-text">{t.whyInvest.titleHighlight}</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.whyInvest.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 motion-stagger">
          {t.whyInvest.reasons.map(({ title, description }, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div
                key={title}
                className="glass-card p-7 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-base text-slate-300 leading-relaxed">{description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
