'use client'

import { Users, TrendingUp, Landmark, FileCheck } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'
import { useLanguage } from '@/lib/i18n/context'

export function StatsSection() {
  const { t } = useLanguage()

  const stats = [
    {
      icon: Users,
      value: 4,
      suffix: '+',
      label: t.statsSection.activeInvestors.label,
      description: t.statsSection.activeInvestors.desc,
    },
    {
      icon: TrendingUp,
      value: 15,
      suffix: '%',
      label: t.statsSection.averageRoi.label,
      description: t.statsSection.averageRoi.desc,
    },
    {
      icon: Landmark,
      value: 5,
      prefix: '৳',
      suffix: 'M+',
      label: t.statsSection.assetsManaged.label,
      description: t.statsSection.assetsManaged.desc,
    },
    {
      icon: FileCheck,
      value: 100,
      suffix: '%',
      label: t.statsSection.transparentReporting.label,
      description: t.statsSection.transparentReporting.desc,
    },
  ]

  return (
    <section className="py-16 bg-slate-900/60 border-y border-white/5 relative overflow-hidden">
      <div className="section-container">
        
        {/* Minimal Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map(({ icon: Icon, value, prefix, suffix, label, description }) => (
            <div
              key={label}
              className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 transition-colors"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <Icon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-mono mb-1">
                <CountUp value={value} prefix={prefix} suffix={suffix} label={`${value}${suffix || ''} ${label}`} />
              </h3>
              <p className="text-base font-bold text-slate-200">{label}</p>
              <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
