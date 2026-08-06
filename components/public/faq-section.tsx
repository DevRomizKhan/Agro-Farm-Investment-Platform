'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'What is Project Adi – 2 Year Ownership Program?',
    a: 'Project Adi is a 2-year partnership-based agricultural ownership program (July 1, 2026 – June 30, 2028) focused exclusively on cattle (cow) and fish (aquaculture) production under Islamic Sharia principles.',
  },
  {
    q: 'What is the share price and minimum investment?',
    a: 'Investment shares are priced at BDT 1,000 per share (One Thousand BDT). You can start with as little as 1 share (BDT 1,000) and may purchase multiple shares through approved BDT payment channels on The Amanah.farm.',
  },
  {
    q: 'How and when are dividend returns distributed?',
    a: 'Net annual dividends are calculated after deducting all operational costs, production expenses, and maintenance. Dividend payment updates and schedules are communicated on a 6-month basis.',
  },
  {
    q: 'Are returns guaranteed or fixed?',
    a: 'No. In full compliance with Islamic Sharia Law, no fixed, guaranteed, or predetermined profit levels are offered. Returns are variable and dependent on actual project performance. Any losses or underperformance are shared proportionately based on shareholding.',
  },
  {
    q: 'What is the lock period and can I sell/transfer my shares?',
    a: 'Investments are non-refundable and non-transferable during the first year. After the first year, investors may submit a 1-month written notice to sell or transfer shares. Valuations reflect prevailing market conditions, and settlements are completed within 4 months.',
  },
  {
    q: 'What happens at the end of the 2-year project period?',
    a: 'Upon project conclusion, all base project assets (cattle and fish inventory) are liquidated by June 30, 2029. Net proceeds from asset sales are distributed proportionately among all investors based on their shareholding percentage.',
  },
  {
    q: 'How is financial transparency and auditing handled?',
    a: 'Project Adi maintains comprehensive financial records. Independent, recognized audit firms conduct annual audits, and investors receive annual financial statements and audit reports.',
  },
  {
    q: 'What are the main risk factors involved?',
    a: 'Livestock and aquaculture carry inherent risks including animal mortality, disease, weather conditions, feed prices, and market price fluctuations. Costs may also shift due to natural disasters or commodity prices, with risks shared proportionately under Sharia partnership principles.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-slate-950 border-t border-white/5">
      <div className="section-container max-w-3xl">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Common <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything you need to know about Project Adi – 2 Year Ownership Program.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
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
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-white text-sm sm:text-base">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-emerald-400'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4 pl-[3.5rem]">
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
