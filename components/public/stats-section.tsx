import { Users, TrendingUp, Leaf, Award } from 'lucide-react'

const stats = [
  { icon: Users, value: '500+', label: 'Active Investors', color: 'green' },
  { icon: TrendingUp, value: '৳2Cr+', label: 'Total Invested', color: 'emerald' },
  { icon: Leaf, value: '12', label: 'Active Farms', color: 'teal' },
  { icon: Award, value: '99%', label: 'Investor Satisfaction', color: 'green' },
]

export function StatsSection() {
  return (
    <section className="py-16 border-t border-b border-white/5 bg-slate-900/30">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="text-center group">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-${color}-500/10 border border-${color}-500/20 mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 text-${color}-400`} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-sm text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
