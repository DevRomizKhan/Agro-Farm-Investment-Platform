import { ShieldCheck, TrendingUp, Clock, Users, Leaf, BarChart3 } from 'lucide-react'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Secured & Transparent',
    description:
      'Every investment is documented with full transparency. You can track your investment in real-time from your dashboard.',
  },
  {
    icon: TrendingUp,
    title: 'Consistent High Returns',
    description:
      'Earn 12–18% annual ROI from proven agricultural operations with a track record of consistent profitability.',
  },
  {
    icon: Clock,
    title: 'Flexible Investment Duration',
    description:
      'Choose from 6 to 24-month investment plans. Your capital is deployed into active farming operations immediately.',
  },
  {
    icon: Users,
    title: 'Expert Farm Management',
    description:
      'Our team of experienced agronomists and farm managers ensure optimal productivity across all farm sites.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Agriculture',
    description:
      'We use environmentally responsible farming practices that improve soil health and long-term agricultural viability.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Monitor your investment performance, view ROI history, and access detailed reports from your personal dashboard.',
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
            <span className="gradient-text">NHK Agro</span>?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We combine modern fintech transparency with time-tested agricultural expertise to deliver
            consistent returns to our investors.
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
