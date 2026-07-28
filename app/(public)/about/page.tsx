import { Metadata } from 'next'
import Link from 'next/link'
import { APP_NAME, ROUTES } from '@/constants'
import { Leaf, ShieldCheck, Target, Eye, TrendingUp, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: `About Us — ${APP_NAME}`,
  description: `Learn about ${APP_NAME}, Bangladesh's premier Shariah-compliant agricultural investment platform.`,
}

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'Democratise agricultural investment in Bangladesh — connecting everyday investors to insured, high-yield cattle farming with full transparency.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    desc: 'Build Bangladesh\'s most trusted agro-investment ecosystem, empowering 10,000+ investors by 2030 through ethical, asset-backed growth.',
  },
  {
    icon: ShieldCheck,
    title: 'Our Promise',
    desc: '100% Shariah compliance, quarterly financial audits, and guaranteed dividend disbursements — no hidden fees, no compromises.',
  },
]

const stats = [
  { icon: TrendingUp, val: '18%', label: 'Max Annual ROI' },
  { icon: Users, val: '1,250+', label: 'Active Investors' },
  { icon: Leaf, val: '25+', label: 'Farm Locations' },
  { icon: ShieldCheck, val: '100%', label: 'On-Time Payouts' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Page Hero ─────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Leaf className="h-3.5 w-3.5" />
            About Amanah Farm
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Pioneering <span className="gradient-text">Agro Investment</span> in Bangladesh
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Since 2019, we have connected urban capital with sustainable cattle farming — delivering ethical, Shariah-compliant returns to 1,250+ investors.
          </p>
        </div>
      </section>

      {/* ── Two-column story ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=900&q=80"
              alt="Bangladesh cattle farm aerial view"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10">
              <p className="text-sm font-bold text-white">Modern Livestock Facilities</p>
              <p className="text-xs text-slate-400">Dhaka · Rajshahi · Comilla · Rangpur</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Built on Transparency,{' '}
              <span className="gradient-text">Powered by Trust</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Amanah Farm was founded with a singular goal: make agricultural investment accessible, transparent, and genuinely profitable for every Bangladeshi investor — not just institutions.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We operate 25+ verified farm hubs equipped with IoT health monitoring, resident veterinarians, and comprehensive insurance. Every cattle unit is registered, tracked, and insured before investor capital is deployed.
            </p>
            <Link href={ROUTES.REGISTER} className="btn-primary inline-flex items-center gap-2 text-sm rounded-xl">
              Start Your Investment Journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Row ─────────────────────────────────── */}
      <section className="border-y border-white/5 bg-slate-900/40 py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, val, label }) => (
            <div key={label} className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Icon className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white font-mono">{val}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Our Core Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-8 rounded-3xl bg-slate-900/50 border border-white/8 hover:border-emerald-500/30 transition-all space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
