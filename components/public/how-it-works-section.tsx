'use client'

import { useLanguage } from '@/lib/i18n/context'

export function HowItWorksSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-slate-950">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="badge-primary mb-4 mx-auto w-fit">{t.howItWorks.badge}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.howItWorks.titlePrefix}
            <span className="gradient-text">{t.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 motion-stagger">
          {t.howItWorks.steps.map(({ step, title, description }, index) => (
            <div key={step} className="relative glass-card p-7 group hover:border-emerald-500/30 transition-all duration-300">
              {/* Step number */}
              <div className="flex items-center gap-4 mb-5">
                <div className="text-5xl font-black text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors leading-none font-mono">
                  {step}
                </div>
                {index < t.howItWorks.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p
                className="text-base text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
