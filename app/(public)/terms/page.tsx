import { Metadata } from 'next'
import { APP_NAME } from '@/constants'

export const metadata: Metadata = {
  title: `Terms & Conditions - ${APP_NAME}`,
  description: `Terms and conditions governing the use of ${APP_NAME} platform.`,
}

export default function TermsPage() {
  return (
    <div className="py-16 bg-slate-950 text-slate-300">
      <div className="section-container max-w-4xl space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Terms &amp; Conditions</h1>
        <p className="text-sm text-slate-400">Last updated: July 2026</p>
        
        <div className="space-y-6 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Investor Agreement</h2>
            <p>
              By registering on {APP_NAME}, you agree to participate in asset-backed agricultural investments under Shariah-compliant Mudarabah and Musharakah contracts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Payouts &amp; Returns</h2>
            <p>
              Dividend distributions are disbursed according to the agreed plan schedule. Projected ROI rates are calculated based on historic yields and active farm asset performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. KYC Compliance</h2>
            <p>
              Investors must complete mandatory identity verification prior to plan activation or dividend withdrawal processing.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
