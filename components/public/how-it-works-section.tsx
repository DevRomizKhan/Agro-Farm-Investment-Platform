const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description:
      'Register with your email and basic personal details. Email verification takes less than 2 minutes.',
  },
  {
    step: '02',
    title: 'Complete KYC Verification',
    description:
      'Submit your NID and accurate contact information. Our team verifies your identity and activates your investor account.',
  },
  {
    step: '03',
    title: 'Purchase Shares (BDT 1,000 each)',
    description:
      'Buy shares at BDT 1,000 per share through approved payment methods in BDT currency only. Multiple shares can be purchased.',
  },
  {
    step: '04',
    title: 'Own Production Assets',
    description:
      'Your investment is allocated proportionately into cow and fish production assets under Sharia-compliant partnership principles.',
  },
  {
    step: '05',
    title: 'Receive Annual Dividends',
    description:
      'Net dividends (after all operational costs) are communicated on a 6-month basis and distributed annually to all investors.',
  },
  {
    step: '06',
    title: 'Exit or Reinvest After Year 1',
    description:
      'After the first year, submit a 1-month written notice to sell or transfer shares. All settlements completed within 4 months.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="badge-green mb-4 mx-auto w-fit">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It{' '}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Start earning from agricultural investments in 6 easy steps. The entire process is
            transparent, secure, and completely digital.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map(({ step, title, description }, index) => (
            <div key={step} className="relative glass-card p-7 group hover:border-green-500/30 transition-all duration-300">
              {/* Step number */}
              <div className="flex items-center gap-4 mb-5">
                <div className="text-5xl font-black text-green-500/20 group-hover:text-green-500/30 transition-colors leading-none">
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-green-500/20 to-transparent" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
              <p
                className="text-sm text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
