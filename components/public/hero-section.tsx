import Link from 'next/link'
import { ArrowRight, ShieldCheck, TrendingUp, Leaf } from 'lucide-react'
import { ROUTES } from '@/constants'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden pt-16">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative section-container py-20 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8 fade-in">
          <ShieldCheck className="h-4 w-4" />
          <span>Bangladesh Registered &amp; Regulated Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight fade-in">
          Invest in{' '}
          <span className="gradient-text">Agriculture.</span>
          <br />
          <span className="text-slate-300">Harvest the Future.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed fade-in">
          Join thousands of smart investors earning{' '}
          <span className="text-green-400 font-semibold">12–18% annual returns</span> through
          sustainable, transparent agricultural investments in Bangladesh.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 fade-in">
          <Link href={ROUTES.REGISTER} className="btn-primary text-base px-8 py-4 group">
            Start Investing Today
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href={ROUTES.PLANS} className="btn-secondary text-base px-8 py-4">
            View Investment Plans
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 fade-in">
          {[
            { icon: ShieldCheck, label: 'SSL Secured & Safe' },
            { icon: TrendingUp, label: 'Consistent ROI' },
            { icon: Leaf, label: 'Sustainable Agriculture' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-green-500" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto fade-in">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
          <div className="relative glass-card p-1.5 shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 bg-slate-800/50 rounded-md px-4 py-1.5 text-xs text-slate-500 text-center">
                nhkagroinvest.com/dashboard
              </div>
            </div>
            {/* Dashboard content preview */}
            <div className="p-6 bg-slate-900/50 rounded-b-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Invested', value: '৳5,00,000', change: '+12%' },
                  { label: 'Total Earnings', value: '৳75,000', change: '+18%' },
                  { label: 'Active Plans', value: '3', change: '' },
                  { label: 'ROI This Month', value: '৳6,250', change: '+8%' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-800/60 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs text-green-400 mt-1">↑ {stat.change}</p>
                    )}
                  </div>
                ))}
              </div>
              {/* Chart placeholder */}
              <div className="bg-slate-800/60 rounded-xl p-4 h-32 flex items-end gap-2">
                {[40, 60, 45, 80, 65, 90, 75, 100, 85, 95, 80, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
