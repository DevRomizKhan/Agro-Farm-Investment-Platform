'use client'

import { Users, TrendingUp, Landmark, ShieldCheck } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '1,250+',
    label: 'Active Investors',
    description: 'Trusted by smart investors',
  },
  {
    icon: TrendingUp,
    value: '15% – 22%',
    label: 'Average ROI',
    description: 'Consistent annual returns',
  },
  {
    icon: Landmark,
    value: '৳5.8 Cr+',
    label: 'Assets Managed',
    description: 'Insured farm assets',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'On-Time Payouts',
    description: 'Flawless track record',
  },
]

export function StatsSection() {
  return (
    <section className="py-16 border-y border-white/5 bg-slate-950/80">
      <div className="section-container">
        
        {/* Minimal Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map(({ icon: Icon, value, label, description }) => (
            <div
              key={label}
              className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 transition-colors"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <Icon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-1">
                {value}
              </h3>
              <p className="text-sm font-bold text-slate-200">{label}</p>
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
