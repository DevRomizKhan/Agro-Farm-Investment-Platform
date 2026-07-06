import { Leaf, Target, Eye } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="py-24 bg-slate-900/30">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <p className="badge-green mb-4 w-fit">About NHK Agro</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Building Bangladesh&apos;s Future Through{' '}
              <span className="gradient-text">Agricultural Investment</span>
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              NHK Agro Invest was founded with a singular mission: to democratize agricultural investment in Bangladesh. We connect urban capital with rural farming expertise, creating a win-win for investors and farmers alike.
            </p>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Our farms span across Rajshahi, Comilla, and Rangpur — cultivating rice, vegetables, fish, and poultry. With over 5 years of operational experience, we have delivered consistent returns to our growing investor community.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Founded', value: '2019' },
                { label: 'Farm Sites', value: '12+' },
                { label: 'Investors', value: '500+' },
                { label: 'Total Distributed', value: '৳50L+' },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800/40 border border-white/5 rounded-xl p-4">
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mission/Vision cards */}
          <div className="space-y-4">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To provide transparent, secure, and profitable agricultural investment opportunities that create lasting wealth for investors while empowering Bangladeshi farmers.' },
              { icon: Eye, title: 'Our Vision', desc: 'To become Bangladesh\'s most trusted agro-investment platform, connecting 10,000+ investors with profitable farming operations across the country by 2030.' },
              { icon: Leaf, title: 'Our Values', desc: 'Transparency in every transaction, sustainability in every farm, and trust in every relationship. We never compromise on integrity.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 flex-shrink-0">
                  <Icon className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
