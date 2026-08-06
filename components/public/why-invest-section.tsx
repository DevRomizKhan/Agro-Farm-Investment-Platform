import { ShieldCheck, TrendingUp, Clock, Users, Leaf, BarChart3 } from 'lucide-react'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Secured & Transparent',
    description:
      'Every investment is documented with comprehensive financial records. Independent auditors conduct annual reviews and investors receive full access to income and expense reports.',
  },
  {
    icon: TrendingUp,
    title: 'Variable Net Dividends',
    description:
      'Annual dividends are calculated after all operational costs under Sharia law — no fixed or guaranteed returns. True profit and loss sharing aligned with farm performance.',
  },
  {
    icon: Clock,
    title: '2-Year Program Duration',
    description:
      'Project Adi runs from July 1, 2026 to June 30, 2028. Upon conclusion, all assets are liquidated and net proceeds distributed proportionately to all investors.',
  },
  {
    icon: Users,
    title: 'Expert Farm Management',
    description:
      'Our team of experienced agronomists and farm managers ensure optimal productivity in both cattle and fish production across all farm sites.',
  },
  {
    icon: Leaf,
    title: 'Cow & Fish Production',
    description:
      'The project covers only cow and fish base producing assets. Investor ownership is strictly limited to production assets — not constructional or non-production assets.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Investor Portal',
    description:
      'Monitor your shareholding, access project updates and annual audit reports, and retrieve your investment records from a personal investor dashboard.',
  },
]

export function WhyInvestSection() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="badge-green mb-4 mx-auto w-fit">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Invest with{' '}
            <span className="gradient-text">Amanah Farm</span>?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We combine modern fintech transparency with time-tested agricultural expertise to deliver
            transparent agricultural ownership aligned with Sharia principles and actual farm performance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="glass-card p-6 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20 mb-5 group-hover:bg-green-500/20 transition-colors">
                <Icon className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
