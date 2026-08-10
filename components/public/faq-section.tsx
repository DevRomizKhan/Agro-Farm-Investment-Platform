'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)
  const { t } = useLanguage()

  const faqs = t.faq.faqs

  return (
    <section id="faq" className="py-24 bg-slate-950/50">
      <div className="section-container max-w-4xl">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="h-4 w-4" />
            {t.faq.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t.faq.titlePrefix} <span className="gradient-text">{t.faq.titleHighlight}</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={cn(
                  'rounded-2xl border transition-all duration-200',
                  isOpen
                    ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                )}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-white text-base sm:text-lg">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-emerald-400'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-base text-slate-300 leading-relaxed border-t border-white/5 pt-4 pl-[3.75rem]">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
