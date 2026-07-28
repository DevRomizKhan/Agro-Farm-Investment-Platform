import { Metadata } from 'next'
import { APP_NAME } from '@/constants'

export const metadata: Metadata = {
  title: `Privacy Policy - ${APP_NAME}`,
  description: `Privacy policy and data protection guidelines for ${APP_NAME}.`,
}

export default function PrivacyPage() {
  return (
    <div className="py-16 bg-slate-950 text-slate-300">
      <div className="section-container max-w-4xl space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-sm text-slate-400">Last updated: July 2026</p>
        
        <div className="space-y-6 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p>
              We collect personal details provided during account creation and KYC verification, including full name, contact information, National ID (NID) details, and bank account credentials for dividend transfers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
            <p>
              Your data is used strictly to process investments, disburse monthly/quarterly returns, verify investor identity under financial guidelines, and issue legal certificates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Data Security &amp; Protection</h2>
            <p>
              We employ bank-grade SSL encryption and secure cloud database instances to ensure your identity and financial records remain 100% protected against unauthorized access.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
