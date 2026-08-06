'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Coins,
  Calendar,
  TrendingUp,
  Briefcase,
  ArrowLeftRight,
  Building2,
  FileText,
  AlertTriangle,
  UserCheck,
  Scale,
  CloudRain,
  Shield,
  Bell,
  MessageSquare,
  Edit3,
  FileCheck,
  Search,
  Printer,
  Mail,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
import { APP_NAME, COMPANY_INFO, ROUTES } from '@/constants'

interface PolicySection {
  id: string
  number: string
  title: string
  icon: React.ElementType
  category: 'Structure & Duration' | 'Returns & Ownership' | 'Transfers & Liquidation' | 'Governance & Risk' | 'Legal & Compliance'
  summary: string
  clauses: string[]
}

const SECTIONS: PolicySection[] = [
  {
    id: 'investment-structure',
    number: '1',
    title: 'Investment Structure',
    icon: Coins,
    category: 'Structure & Duration',
    summary: 'Investment shares priced at BDT 1,000 under Sharia-compliant principles.',
    clauses: [
      '1.1. Investment shares are priced at BDT 1,000 per share (One Thousand BDT).',
      '1.2. An investor may purchase multiple shares.',
      '1.3. Once an investment is confirmed, it is non-refundable during the first year of the investment period.',
      '1.4. All payments must be completed through available payment methods as provided by The Amanah.farm. Only BDT currency is supported.',
      '1.5. Investment is made in full compliance with Islamic Sharia Law principles.',
    ],
  },
  {
    id: 'project-duration',
    number: '2',
    title: 'Project Duration & Investment Period',
    icon: Calendar,
    category: 'Structure & Duration',
    summary: '2-year program duration focused strictly on cow and fish production.',
    clauses: [
      '2.1. The investment program operates for 2 (two) years, commencing July 1, 2026 and concluding June 30, 2028.',
      '2.2. The project encompasses only cow and fish producing assets and operations.',
    ],
  },
  {
    id: 'dividend-distribution',
    number: '3',
    title: 'Dividend Distribution and Returns',
    icon: TrendingUp,
    category: 'Returns & Ownership',
    summary: 'Annual net dividends based on shareholding % under Islamic Sharia principles.',
    clauses: [
      '3.1. Annual dividends are distributed to investors based on their shareholding percentage.',
      '3.2. Distributions are made in accordance with Islamic Sharia Law principles.',
      '3.3. Net dividends are calculated annually after deducting all operational costs, production expenses, maintenance, and project-related expenditures.',
      '3.4. Dividend payment schedules and amounts will be communicated by "Project Adi" on a 6-month basis.',
      '3.5. No fixed, guaranteed, or predetermined profit levels are offered. Returns are variable and dependent on project performance.',
    ],
  },
  {
    id: 'ownership-rights',
    number: '4',
    title: 'Share Ownership Rights',
    icon: Briefcase,
    category: 'Returns & Ownership',
    summary: 'Proportionate ownership rights in project base production assets.',
    clauses: [
      '4.1. Investors receive proportionate ownership rights in the project based on their total investment amount.',
      '4.2. Ownership entitlements include annual dividend participation and final asset distribution upon project conclusion.',
      '4.3. Ownership is non-transferable during the first year from the investment date.',
      '4.4. Investor is only entitled to ownership of project base assets, not the constructional or any other assets which are not purchased using the investment.',
    ],
  },
  {
    id: 'share-transfer-exit',
    number: '5',
    title: 'Share Transfer and Exit Options',
    icon: ArrowLeftRight,
    category: 'Transfers & Liquidation',
    summary: 'Exit and transfer allowed after 1 year with 1-month notice and 4-month settlement.',
    clauses: [
      '5.1. After the first year period, investors may request to sell or transfer their shares.',
      '5.2. Written notice of One (1) month is required for any transfer or withdrawal request.',
      '5.3. Share valuation is determined by prevailing market conditions at the time of the transfer request.',
      '5.4. All transfers and settlements are completed within Four (4) months of notice submission.',
      '5.5. Share transfers require approval and facilitation by "Project Adi".',
    ],
  },
  {
    id: 'final-asset-distribution',
    number: '6',
    title: 'Final Asset Distribution',
    icon: Building2,
    category: 'Transfers & Liquidation',
    summary: 'Full asset liquidation and net proceeds distribution upon project conclusion.',
    clauses: [
      '6.1. Upon project conclusion on June 30, 2029, all project assets will be liquidated.',
      '6.2. Net proceeds from asset sales are distributed proportionately among all investors based on their shareholding percentage.',
      '6.3. Final distribution is completed within a reasonable timeframe following asset liquidation and audit completion.',
    ],
  },
  {
    id: 'transparency-reporting',
    number: '7',
    title: 'Transparency and Financial Reporting',
    icon: FileText,
    category: 'Governance & Risk',
    summary: 'Comprehensive records with independent annual audits and open access.',
    clauses: [
      '7.1. "Project Adi" maintains comprehensive financial records including income, expenses, and operational details.',
      '7.2. Annual audits are conducted by independent, recognized audit firms.',
      '7.3. Investors receive annual audit reports and financial statements.',
      '7.4. Investors have access to income and expense records upon reasonable request.',
      '7.5. All communications regarding project progress and financial performance are provided transparently.',
    ],
  },
  {
    id: 'risk-factors',
    number: '8',
    title: 'Risk Factors',
    icon: AlertTriangle,
    category: 'Governance & Risk',
    summary: 'Agricultural risks disclosed; loss sharing proportionate to shareholding.',
    clauses: [
      '8.1. Cow farming and aquaculture carry inherent risks including livestock mortality, disease, adverse weather conditions, dependent crop/feed price shifts, and market price fluctuations.',
      '8.2. Project costs may increase due to natural disasters, disease outbreaks, commodity price increases, or unforeseen external factors.',
      '8.3. Losses or underperformance in any project segment are distributed proportionately among all investors based on shareholding.',
      '8.4. Project Adi does not guarantee specific profit returns, minimum dividend levels, or capital preservation.',
    ],
  },
  {
    id: 'investor-responsibilities',
    number: '9',
    title: 'Investor Responsibilities and Requirements',
    icon: UserCheck,
    category: 'Governance & Risk',
    summary: 'Requirement to provide accurate identification and use approved payment channels.',
    clauses: [
      '9.1. Investors must provide accurate personal identification and contact information.',
      '9.2. Investors are responsible for ensuring payments are made through approved payment methods only.',
      '9.3. Investors must maintain updated contact information with The Project Adi.',
      '9.4. Amanah.farm assumes no responsibility for unverified or incorrectly processed payments.',
    ],
  },
  {
    id: 'legal-compliance',
    number: '10',
    title: 'Legal and Regulatory Compliance',
    icon: Scale,
    category: 'Legal & Compliance',
    summary: 'Partnership-based Sharia compliant initiative; tax obligations apply.',
    clauses: [
      '10.1. This investment is not a regulated financial product offered by a bank or licensed financial institution.',
      '10.2. This is a partnership-based agricultural investment initiative with inherent profit and loss risks.',
      '10.3. The project operations comply with applicable Islamic Sharia principles.',
      '10.4. Applicable income taxes may be withheld from distributions in accordance with relevant tax jurisdictions.',
      '10.5. Investors are responsible for reporting investment income to their respective tax authorities.',
    ],
  },
  {
    id: 'force-majeure',
    number: '11',
    title: 'Force Majeure',
    icon: CloudRain,
    category: 'Legal & Compliance',
    summary: 'Protection in events beyond reasonable control including natural disasters.',
    clauses: [
      '11.1. The Project Adi shall not be liable for delays or failure to perform due to events beyond reasonable control, including acts of God, natural disasters, war, civil unrest, or government actions.',
      '11.2. In such circumstances, The Project Adi will make reasonable efforts to minimize impact on the project and investor returns.',
    ],
  },
  {
    id: 'confidentiality',
    number: '12',
    title: 'Confidentiality',
    icon: Shield,
    category: 'Legal & Compliance',
    summary: 'Mutual non-disclosure of sensitive business information and financial details.',
    clauses: [
      '12.1. Investors and The Project Adi agree to maintain confidentiality regarding sensitive business information, financial details, and proprietary operational strategies, except as required by law or for performance of contractual obligations.',
    ],
  },
  {
    id: 'communications-updates',
    number: '13',
    title: 'Communications and Project Updates',
    icon: Bell,
    category: 'Governance & Risk',
    summary: 'Regular electronic updates via email, investor portal, and notifications.',
    clauses: [
      '13.1. The Project Adi communicates project updates, financial reports, and important notices to investors regularly.',
      '13.2. Communications may be delivered via email, website portal, app notifications, or other electronic means.',
      '13.3. Investors are responsible for monitoring official communication channels for updates and important notices.',
    ],
  },
  {
    id: 'dispute-resolution',
    number: '14',
    title: 'Dispute Resolution',
    icon: MessageSquare,
    category: 'Legal & Compliance',
    summary: 'Amicable dispute resolution via support@amanah.farm or arbitration.',
    clauses: [
      '14.1. Any questions, concerns, or disputes regarding this investment should be directed to support@amanah.farm',
      '14.2. The Project Adi management will attempt to resolve disputes through discussion and negotiation.',
      '14.3. Unresolved disputes may be referred to arbitration or relevant legal authorities as appropriate.',
    ],
  },
  {
    id: 'amendment-modification',
    number: '15',
    title: 'Amendment and Modification',
    icon: Edit3,
    category: 'Legal & Compliance',
    summary: 'Right to modify terms with prior notification through official channels.',
    clauses: [
      '15.1. The Project Adi reserves the right to modify these terms and conditions at any time.',
      '15.2. Material changes will be communicated to investors through official channels.',
      '15.3. Continued investment participation following notification of changes constitutes acceptance of modified terms.',
    ],
  },
  {
    id: 'miscellaneous',
    number: '16',
    title: 'Miscellaneous Provisions',
    icon: FileCheck,
    category: 'Legal & Compliance',
    summary: 'Beneficiary transfer rights, complete agreement, and severability clauses.',
    clauses: [
      '16.1. In case of investor death or incapacity, shares and accrued proceeds transfer to designated beneficiaries.',
      '16.2. This agreement constitutes the complete terms between parties and supersedes all prior agreements or understandings.',
      '16.3. If any provision is found invalid or unenforceable, remaining provisions continue in full effect.',
      '16.4. Investors may not assign, transfer, or delegate rights or obligations without written consent from The Project Adi.',
    ],
  },
]

export default function TermsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', 'Structure & Duration', 'Returns & Ownership', 'Transfers & Liquidation', 'Governance & Risk', 'Legal & Compliance']

  const filteredSections = SECTIONS.filter((sec) => {
    const matchesCategory = activeCategory === 'All' || sec.category === activeCategory
    const matchesSearch =
      sec.title.toLowerCase().includes(search.toLowerCase()) ||
      sec.summary.toLowerCase().includes(search.toLowerCase()) ||
      sec.clauses.some((c) => c.toLowerCase().includes(search.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-emerald-500 selection:text-slate-950">
      {/* ── Header / Hero Section ──────────────────────── */}
      <section className="relative pt-36 pb-16 px-4 overflow-hidden border-b border-white/5 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.15),transparent)]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            Project Adi – 2 Year Ownership Program
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Terms &amp; Investment <span className="gradient-text">Policy</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Official summary of terms, rights, dividend policy, and risk disclosures governing investment participation in{' '}
            <strong className="text-emerald-400">The Amanah.farm (Project Adi)</strong>.
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">Share Price</p>
              <p className="text-xl font-black text-white font-mono mt-0.5">BDT 1,000</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Per Share (One Thousand BDT)</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">Project Term</p>
              <p className="text-xl font-black text-white font-mono mt-0.5">2 Years</p>
              <p className="text-[11px] text-slate-400 mt-0.5">July 1, 2026 – June 30, 2028</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">Production Scope</p>
              <p className="text-xl font-black text-white mt-0.5">Cow &amp; Fish</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Base Producing Assets</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">Sharia Governance</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">100% Sharia</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Variable Net Dividends</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs inline-flex items-center gap-2 py-2 px-4 border-white/10 bg-slate-900 hover:bg-slate-800"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save Terms PDF
            </button>
            <a
              href="mailto:support@amanah.farm"
              className="btn-secondary text-xs inline-flex items-center gap-2 py-2 px-4 border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact Legal Support: support@amanah.farm
            </a>
          </div>
        </div>
      </section>

      {/* ── Search & Filter Controls ─────────────────────── */}
      <section className="sticky top-20 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms (e.g. share price, exit, sharia)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Policy Sections List ────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {filteredSections.length === 0 ? (
          <div className="text-center py-16 glass-card border-dashed">
            <HelpCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <p className="text-white font-bold">No matching policy clauses found</p>
            <p className="text-xs text-slate-400 mt-1">Try searching with a different term or selecting "All" categories.</p>
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
              }}
              className="btn-secondary text-xs mt-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSections.map((sec) => {
            const IconComponent = sec.icon
            return (
              <article
                key={sec.id}
                id={sec.id}
                className="group relative rounded-3xl bg-slate-900/60 border border-white/8 hover:border-emerald-500/30 p-6 sm:p-8 transition-all duration-300 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Section {sec.number}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {sec.category}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white mt-1">{sec.title}</h2>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 italic max-w-xs">{sec.summary}</p>
                </div>

                <div className="space-y-3 pl-0 sm:pl-4">
                  {sec.clauses.map((clause, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-slate-200">
                      <ChevronRight className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                      <p>{clause}</p>
                    </div>
                  ))}
                </div>
              </article>
            )
          })
        )}

        {/* ── Contact & Support Notice Box ──────────────── */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Have questions regarding these terms &amp; conditions?</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Our legal and investor support team at <strong className="text-emerald-400 font-mono">The Project Adi</strong> is available to answer any questions.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:support@amanah.farm"
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3"
            >
              <Mail className="h-4 w-4" />
              Contact support@amanah.farm
            </a>
            <Link
              href={ROUTES.CONTACT}
              className="btn-secondary inline-flex items-center gap-2 text-sm px-6 py-3 border-white/10"
            >
              Visit Contact Page
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
