'use client'

import { Star, Quote } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

export function TestimonialsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-slate-900/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="badge-primary mb-4 mx-auto w-fit">{t.testimonials.badge}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.testimonials.titlePrefix}
            <span className="gradient-text">{t.testimonials.titleHighlight}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 motion-stagger">
          {t.testimonials.items.map((item) => (
            <div key={item.name} className="glass-card p-7 flex flex-col gap-5 hover:border-emerald-500/20 transition-all duration-300">
              <Quote className="h-8 w-8 text-emerald-500/30" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-200 text-base leading-relaxed flex-1">&ldquo;{item.content}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-base flex-shrink-0 font-mono">
                  {getInitials(item.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-white truncate">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.occupation} · {item.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-slate-400">{t.testimonials.invested}</p>
                  <p className="text-base font-semibold text-emerald-400 font-mono">{item.invested}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
