'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Is my investment safe and asset-backed?',
    a: 'Yes. Every taka invested is allocated into registered, insured physical cattle. All animals are IoT-tagged, vaccinated, and monitored by resident veterinarians across our 25+ farm locations. No speculative instruments — only real agricultural assets.',
  },
  {
    q: 'What is the minimum investment amount?',
    a: 'You can start with as little as ৳10,000 (1 share). Shares are priced at ৳10,000 each and you may purchase up to the maximum allowed for your chosen plan.',
  },
  {
    q: 'How and when do I receive my returns?',
    a: 'Returns are distributed quarterly, deposited directly into your registered bank account. You can also choose to reinvest at maturity. Payment timing and rates are defined in your investment agreement.',
  },
  {
    q: 'Is Amanah Farm investment Shariah-compliant?',
    a: 'Absolutely. All investments operate under authenticated Mudarabah and Musharakah structures. Profit-sharing ratios are pre-agreed, and there is zero interest (Riba), speculation, or ambiguity (Gharar) involved.',
  },
  {
    q: 'What does KYC verification involve?',
    a: 'KYC (Know Your Customer) requires your National ID card (NID), a recent photo, and bank account details. It typically completes within 24 hours and is required to protect your payout channels and comply with Bangladesh Bank regulations.',
  },
  {
    q: 'What is the lock period and can I exit early?',
    a: 'Each investment plan has a 366-day lock period from the date of activation. Early withdrawal is not available during this window. After the lock period expires, you may request a full exit through the investor portal.',
  },
  {
    q: 'What annual return can I expect?',
    a: 'Our plans offer between 10% and 18% annual ROI depending on the plan tier and duration. The exact rate is fixed at the time of your investment and guaranteed in your signed agreement.',
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
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Common <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything you need to know before getting started.
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
                    ? 'bg-slate-900 border-emerald-500/40'
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
