const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description:
      'Register with your email and basic details. Verification takes less than 2 minutes.',
  },
  {
    step: '02',
    title: 'Complete KYC Verification',
    description:
      'Submit your NID and bank details. Our team verifies your identity within 24 hours.',
  },
  {
    step: '03',
    title: 'Choose an Investment Plan',
    description:
      'Browse our investment plans and select one that matches your financial goals.',
  },
  {
    step: '04',
    title: 'Fund Your Investment',
    description:
      'Transfer your investment amount via bank transfer or mobile banking.',
  },
  {
    step: '05',
    title: 'Earn Monthly Returns',
    description:
      'Receive your ROI every month directly to your registered bank account.',
  },
  {
    step: '06',
    title: 'Grow &amp; Reinvest',
    description:
      'Reinvest your returns for compounding growth or withdraw at the end of your term.',
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
