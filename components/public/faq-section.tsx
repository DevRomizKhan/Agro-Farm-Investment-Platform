'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Is my investment safe and asset-backed?',
    a: 'Yes. 100% of capital is allocated into registered, insured physical cattle. All animals are vaccinated, IoT-tagged, and monitored by resident veterinarians across our 25+ farm locations.',
  },
  {
    q: 'What is the minimum investment amount?',
    a: 'Our Starter Plan begins at ৳10,000 — allowing every investor, regardless of budget, to participate and earn consistent agricultural returns.',
  },
  {
    q: 'How and when do I receive my returns?',
    a: 'Profits are deposited directly into your registered bank account or mobile wallet (bKash/Nagad) monthly, or accumulated at plan maturity — your choice.',
  },
  {
    q: 'Is Amanah Farm investment Shariah-compliant?',
    a: 'Absolutely. We operate strictly under authentic Mudarabah & Musharakah contracts. Profit-sharing ratios are pre-agreed with zero interest (Riba) or speculation.',
  },
  {
    q: 'What is KYC verification and why is it required?',
    a: 'KYC verifies your identity (National ID + bank details) to secure your payouts, prevent fraud, and ensure compliance with Bangladesh financial regulations.',
  },
  {
    q: 'Can I withdraw before plan maturity?',
    a: 'Early exit is available after a 3-month lock-in with a 2% liquidation fee. Standard processing takes up to 7 business days.',
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
            Everything investors need to know before they begin.
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
