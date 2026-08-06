import Image from 'next/image'
import Link from 'next/link'
import { Leaf, ShieldCheck, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { COMPANY_INFO, ROUTES } from '@/constants'

const features = [
  { icon: ShieldCheck, label: 'Shariah-Compliant Contracts' },
  { icon: TrendingUp, label: 'Annual Net Dividends' },
  { icon: Users, label: 'Proportionate Asset Ownership' },
  { icon: Leaf, label: 'Cow & Fish Production' },
]

const stats = [
  { val: '2019', label: 'Founded' },
  { val: '25+', label: 'Farm Sites' },
  { val: '500+', label: 'Active Investors' },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Leaf className="h-3.5 w-3.5" />
              Who We Are
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Empowering Investors,{' '}
              <span className="gradient-text">Transforming Agriculture</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Amanah Farm is a partnership-based agricultural investment initiative connecting investors to proportionate ownership in cow and fish production assets. Project Adi operates under Islamic Sharia principles, with annual net dividends calculated after project expenses, transparent financial records, and no fixed or guaranteed returns.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Key numbers */}
            <div className="flex gap-10 pt-4 border-t border-white/10">
              {stats.map(({ val, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-emerald-400 font-mono">{val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <Link
              href={ROUTES.ABOUT}
              className="btn-secondary"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl group">
              <Image
                src="/images/carousel/slide3.jpg"
                alt="Amanah Farm cattle operation in Bangladesh"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 sm:left-8 sm:right-8 rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur-md shadow-xl">
              <p className="text-sm font-bold text-white">Managed by {COMPANY_INFO.founder}</p>
              <p className="mt-1 text-xs text-slate-400">{COMPANY_INFO.founderTitle} · {COMPANY_INFO.farmLocations}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
