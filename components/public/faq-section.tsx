'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  { q: 'Is my investment safe?', a: 'Yes. All investments are secured by actual agricultural assets. We maintain full transparency with monthly farm reports and real-time dashboard tracking.' },
  { q: 'What is the minimum investment amount?', a: 'The minimum investment starts at ৳10,000 for our Starter Plan. Higher plans have higher minimums with better returns.' },
  { q: 'How and when do I receive my returns?', a: 'Returns are paid monthly directly to your registered bank account. Payments are made within the first 5 business days of each month.' },
  { q: 'What is KYC and why is it required?', a: 'KYC (Know Your Customer) is a regulatory requirement. We collect your NID and bank details to verify your identity and prevent fraud. It takes 24 hours to process.' },
  { q: 'Can I withdraw my investment before maturity?', a: 'Early withdrawal is possible after 3 months with a 2% early exit fee. We recommend holding until maturity for full returns.' },
  { q: 'What happens if a farm has a bad season?', a: 'We diversify across multiple farm sites to mitigate risk. Our guaranteed return model protects investors from seasonal agricultural variances.' },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 bg-slate-950">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-16">
          <p className="badge-green mb-4 mx-auto w-fit">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-white text-sm">{faq.q}</span>
                <ChevronDown className={cn('h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-200', openIndex === i && 'rotate-180 text-green-400')} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
