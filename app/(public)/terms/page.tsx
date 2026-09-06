'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Coins, Calendar, TrendingUp, Briefcase, ArrowLeftRight,
  Building2, FileText, AlertTriangle, UserCheck, Scale,
  CloudRain, Shield, Bell, MessageSquare, Edit3, FileCheck,
  Search, Printer, Mail, CheckCircle2, Sparkles, HelpCircle, ChevronRight
} from 'lucide-react'
import { ROUTES } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'

interface PolicySection {
  id: string
  number: string
  title: string
  icon: React.ElementType
  category: string
  summary: string
  clauses: string[]
}

const SECTIONS_BN: PolicySection[] = [
  {
    id: 'investment-structure',
    number: '১',
    title: 'বিনিয়োগের কাঠামো ও নিয়মাবলী',
    icon: Coins,
    category: 'কাঠামো ও সময়কাল',
    summary: 'শরীয়াহ সম্মত নীতিতে প্রতি শেয়ারের নির্ধারিত মূল্যায়নে বিনিয়োগ।',
    clauses: [
      '১.১. বিনিয়োগ শেয়ারের মূল্য প্রতি শেয়ার ১,০০০ টাকা (এক হাজার টাকা)।',
      '১.২. একজন বিনিয়োগকারী তার সামর্থ্য অনুযায়ী একাধিক শেয়ার অর্জন করতে পারেন।',
      '১.৩. বিনিয়োগ নিশ্চিত করার পর প্রথম ১ (এক) বছর বিনিয়োগের মূলধন অফেরতযোগ্য থাকবে।',
      '১.৪. সকল লেনদেন আমানাহ ফার্ম অনুমোদিত পেমেন্ট চ্যানেলে সম্পূর্ণ করতে হবে (শুধুমাত্র বিডিটি টাকা প্রযোজ্য)।',
      '১.৫. সমগ্র বিনিয়োগ প্রক্রিয়া সম্পূর্ণ ইসলামী শরীয়াহ অংশীদারিত্ব নীতি মেনে পরিচালিত হবে।',
    ],
  },
  {
    id: 'project-duration',
    number: '২',
    title: 'প্রকল্পের মেয়াদ ও পরিচালনা ক্ষেত্র',
    icon: Calendar,
    category: 'কাঠামো ও সময়কাল',
    summary: '২ বছর মেয়াদী প্রোগ্রাম যা শুধুমাত্র Fish Project ও মাছ উৎপাদন সম্পদে সীমাবদ্ধ।',
    clauses: [
      '২.১. Fish Project ২ (দুই) বছর মেয়াদের জন্য পরিচালিত হবে (১ জুলাই ২০২৬ থেকে ৩০ জুন ২০২৮)।',
      '২.২. প্রকল্পটি শুধুমাত্র Fish Project এবং মৎস্য চাষের উৎপাদনশীল মূল সম্পদে প্রয়োগ করা হবে।',
    ],
  },
  {
    id: 'dividend-distribution',
    number: '৩',
    title: 'বাৎসরিক লভ্যাংশ নীতি ও বন্টন',
    icon: TrendingUp,
    category: 'লভ্যাংশ ও মালিকানা',
    summary: 'শরীয়াহ নীতি অনুযায়ী শেয়ারের আনুপাতিক হারে বাৎসরিক নিট লভ্যাংশ বণ্টন।',
    clauses: [
      '৩.১. বিনিয়োগকারীর অর্জিত শেয়ারের শতকরা হারের উপর ভিত্তি করে বাৎসরিক নিট লভ্যাংশ বিতরণ করা হবে।',
      '৩.২. লভ্যাংশ বণ্টন সম্পূর্ণ ইসলামিক শরীয়াহ নীতিমালায় পরিচালিত হবে।',
      '৩.৩. খামারের যাবতীয় পরিচালন ব্যয়, খাদ্য খরচ, পরিচর্যা ও প্রশাসনিক খরচ বাদ দিয়ে নিট লভ্যাংশ হিসাব করা হবে।',
      '৩.৪. লভ্যাংশের হালনাগাদ অগ্রগতি প্রতি ৬ মাস পর পর এবং চূড়ান্ত বণ্টন বাৎসরিক ভিত্তিতে প্রদান করা হবে।',
      '৩.৫. কোনো নির্দিষ্ট, স্থির বা পূর্বনির্ধারিত সুদের অফার করা হয় না। লভ্যাংশ খামারের প্রকৃত উৎপাদনের উপর নির্ভর করে পরিবর্তনশীল।',
    ],
  },
  {
    id: 'ownership-rights',
    number: '৪',
    title: 'শেয়ার মালিকানা অধিকার',
    icon: Briefcase,
    category: 'লভ্যাংশ ও মালিকানা',
    summary: 'উৎপাদনশীল মূল সম্পদে বিনিয়োগকারীদের আনুপাতিক মালিকানা স্বত্ব।',
    clauses: [
      '৪.১. বিনিয়োগকারী মোট বিনিয়োগের অনুপাত অনুযায়ী খামারের মূল সম্পদে আনুপাতিক মালিকানা লাভ করবেন।',
      '৪.২. মালিকানা অধিকারের মধ্যে বাৎসরিক লভ্যাংশ প্রাপ্তি এবং প্রকল্প সমাপনী সম্পদ অবায়িতকরণ অর্থ বন্টন অন্তর্ভুক্ত।',
      '৪.৩. প্রথম ১ বছরের মধ্যে এই শেয়ার হস্তান্তর বা বিক্রয়যোগ্য নয়।',
      '৪.৪. বিনিয়োগকারী শুধুমাত্র সরাসরি অর্জিত মূল সম্পদে মালিকানা পাবেন, খামারের অবকাঠামোগত অকৃষি সম্পদে নয়।',
    ],
  },
  {
    id: 'share-transfer-exit',
    number: '৫',
    title: 'শেয়ার বিক্রয়, হস্তান্তর ও এক্সিট সুবিধা',
    icon: ArrowLeftRight,
    category: 'হস্তান্তর ও সমাপনী',
    summary: '১ বছর পর ১ মাসের লিখিত নোটিশে শেয়ার বিক্রয়ের সুযোগ।',
    clauses: [
      '৫.১. ১ম বছর অতিক্রান্ত হওয়ার পর বিনিয়োগকারী শেয়ার বিক্রয় বা হস্তান্তরের আবেদন করতে পারবেন।',
      '৫.২. যেকোনো শেয়ার বিক্রয় আবেদনের জন্য ন্যূনতম ১ (এক) মাসের লিখিত বিজ্ঞপ্তির প্রয়োজন।',
      '৫.৩. আবেদনের সময় তৎকালীন খামার বাজারদরের উপর ভিত্তি করে শেয়ারের মূল্য নির্ধারিত হবে।',
      '৫.৪. আবেদন গ্রহণের পর সর্বোচ্চ ৪ (চার) মাসের মধ্যে সমাপনী হিসাব সম্পন্ন করা হবে।',
      '৫.৫. শেয়ার হস্তান্তর কার্যক্রমে আমানাহ ফার্মের অনুমোদন ও সুবিধা প্রয়োজন হবে।',
    ],
  },
  {
    id: 'final-asset-distribution',
    number: '৬',
    title: 'প্রকল্প মেয়াদান্তে চূড়ান্ত সম্পদ বন্টন',
    icon: Building2,
    category: 'হস্তান্তর ও সমাপনী',
    summary: '২০২৯ সালে খামার সম্পদ অবায়িতকরণ এবং বিক্রয়লব্ধ অর্থ বন্টন।',
    clauses: [
      '৬.১. ৩০ জুন ২০২৮ তারিখে প্রকল্প সমাপ্তির পর সমস্ত মূল সম্পদ অবায়িতকরণ করা হবে।',
      '৬.২. অবায়িতকরণ থেকে অর্জিত নিট অর্থ সকল শেয়ারহোল্ডারদের শেয়ারের শতকরা হারে বন্টন করা হবে।',
      '৬.৩. অডিট সম্পাদন শেষে যুক্তিসঙ্গত সময়সীমার মধ্যে বিনিয়োগকারীদের অর্থ প্রদান করা হবে।',
    ],
  },
  {
    id: 'transparency-reporting',
    number: '৭',
    title: 'আর্থিক স্বচ্ছতা ও চার্টার্ড অডিট ব্যবস্থা',
    icon: FileText,
    category: 'পরিচালনা ও ঝুঁকি',
    summary: 'স্বতন্ত্র সিএ ফার্ম দ্বারা বাৎসরিক অডিট ও আয়-ব্যয় বিবরণী প্রকাশ।',
    clauses: [
      '৭.১. Fish Project সমস্ত আয়, ব্যয় ও পরিচালন তথ্যের নিখুঁত হিসাব সংরক্ষণ করে।',
      '৭.২. প্রতি বছর স্বাধীন চার্টার্ড অ্যাকাউন্ট্যান্ট ফার্ম দ্বারা বাৎসরিক হিসাব অডিট সম্পন্ন করা হয়।',
      '৭.৩. বিনিয়োগকারীদের জন্য বাৎসরিক অডিট রিপোর্ট ও আর্থিক বিবরণী উন্মুক্ত রাখা হয়।',
      '৭.৪. যেকোনো যুক্তিসঙ্গত আবেদনে আয়-ব্যয় বিবরণী পর্যালোচনা করার অধিকার রয়েছে।',
    ],
  },
  {
    id: 'risk-factors',
    number: '৮',
    title: 'খামার ঝুঁকি ও সতর্কতা',
    icon: AlertTriangle,
    category: 'পরিচালনা ও ঝুঁকি',
    summary: 'কৃষি ও প্রাকৃতিক ঝুঁকি প্রকাশ; শরীয়াহ মতে আনুপাতিক ঝুঁকি বহন।',
    clauses: [
      '৮.১. পশু মোটাতাজাকরণ ও মৎস্য চাষে প্রাণীর রোগব্যাধি, প্রাকৃতিক দুর্যোগ, খাদ্যের মূল্যবৃদ্ধি ও বাজারদর পরিবর্তনের ঝুঁকি বিদ্যমান।',
      '৮.২. যেকোনো অনাকাঙ্ক্ষিত পরিস্থিতিতে উৎপাদন ব্যয় বৃদ্ধি পেতে পারে।',
      '৮.৩. শরীয়াহ নীতি অনুযায়ী খামারের প্রকৃত লাভ ও ক্ষতি সকল শেয়ারহোল্ডারদের মাঝে আনুপাতিক হারে বন্টন হবে।',
      '৮.৪. Fish Project কোনো নির্দিষ্ট স্থির লভ্যাংশ বা ক্যাপিটাল গ্যারান্টি প্রদান করে না।',
    ],
  },
  {
    id: 'legal-compliance',
    number: '৯',
    title: 'আইনি ও নিয়ন্ত্রক নীতিমালা',
    icon: Scale,
    category: 'আইনি বিষয়াবলী',
    summary: 'অংশীদারিত্বভিত্তিক কৃষি বিনিয়োগ উদ্যোগ; শরীয়াহ নীতিতে পরিচালিত।',
    clauses: [
      '৯.১. এটি কোনো ব্যাংক বা ফিন্যান্স কোম্পানির ফিক্সড ডিপোজিট নয়; এটি একটি যৌথ কৃষি অংশীদারিত্ব।',
      '৯.২. প্রকল্পটি পরিচালিত হয় ইসলামিক শরীয়াহ নীতি অনুযায়ী।',
      '৯.৩. বিনিয়োগকারীদের জন্য নিজ নিজ আয়কর আইনের সকল বাধ্যবাধকতা প্রযোজ্য।',
    ],
  },
]

const SECTIONS_EN: PolicySection[] = [
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
      '1.4. All payments must be completed through available payment methods as provided by Amanah Farm (amanahfarm.com). Only BDT currency is supported.',
      '1.5. Investment is made in full compliance with Islamic Sharia Law principles.',
    ],
  },
  {
    id: 'project-duration',
    number: '2',
    title: 'Project Duration & Investment Period',
    icon: Calendar,
    category: 'Structure & Duration',
    summary: '2-year program duration focused strictly on Fish Project and fish production.',
    clauses: [
      '2.1. The investment program operates for 2 (two) years.',
      '2.2. The project encompasses only Fish Project and fish producing assets and operations.',
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
      '3.4. Dividend payment schedules and amounts will be communicated by "Fish Project" on a 6-month basis.',
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
]

export default function TermsPage() {
  const { lang } = useLanguage()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const sections = lang === 'bn' ? SECTIONS_BN : SECTIONS_EN
  const categories = lang === 'bn'
    ? ['সব', 'কাঠামো ও সময়কাল', 'লভ্যাংশ ও মালিকানা', 'হস্তান্তর ও সমাপনী', 'পরিচালনা ও ঝুঁকি', 'আইনি বিষয়াবলী']
    : ['All', 'Structure & Duration', 'Returns & Ownership', 'Transfers & Liquidation', 'Governance & Risk', 'Legal & Compliance']

  const filteredSections = sections.filter((sec) => {
    const matchesCategory = activeCategory === 'All' || activeCategory === 'সব' || sec.category === activeCategory
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
            {lang === 'bn' ? 'Fish Project – ২ বছর মেয়াদী কৃষি মালিকানা প্রোগ্রাম' : 'Fish Project – 2 Year Ownership Program'}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            {lang === 'bn' ? 'নিয়মাবলি ও বিনিয়োগ ' : 'Terms & Investment '}
            <span className="gradient-text">{lang === 'bn' ? 'নীতিমালা' : 'Policy'}</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'আমানাহ ফার্ম (Fish Project) পরিচালনা, লভ্যাংশ বণ্টন ও বিনিয়োগ স্বত্ব সংক্রান্ত আইনি নির্দেশিকা।'
              : 'Official summary of terms, rights, dividend policy, and risk disclosures governing investment participation.'}
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">{lang === 'bn' ? 'শেয়ার মূল্য' : 'Share Price'}</p>
              <p className="text-xl font-black text-white font-mono mt-0.5">৳১০,০০০</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">{lang === 'bn' ? 'প্রতি শেয়ার (এক হাজার টাকা)' : 'Per Share (One Thousand BDT)'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">{lang === 'bn' ? 'প্রকল্প মেয়াদ' : 'Project Term'}</p>
              <p className="text-xl font-black text-white font-mono mt-0.5">{lang === 'bn' ? '২ বছর' : '2 Years'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">{lang === 'bn' ? 'উৎপাদন খাত' : 'Production Scope'}</p>
              <p className="text-xl font-black text-white mt-0.5">{lang === 'bn' ? 'Fish Project ও মাছ' : 'Fish Project'}</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">{lang === 'bn' ? 'মূল উৎপাদন সম্পদ' : 'Base Producing Assets'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase text-slate-400">{lang === 'bn' ? 'শরীয়াহ চুক্তি' : 'Sharia Governance'}</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{lang === 'bn' ? '১০০% শরীয়াহ' : '100% Sharia'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{lang === 'bn' ? 'বাৎসরিক নিট লভ্যাংশ' : 'Variable Net Dividends'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-xs inline-flex items-center gap-2 py-2 px-4 border-white/10 bg-slate-900 hover:bg-slate-800"
            >
              <Printer className="h-3.5 w-3.5" />
              {lang === 'bn' ? 'প্রিন্ট / পিডিএফ ডাউনলোড' : 'Print / Save Terms PDF'}
            </button>
            <a
              href="mailto:support@amanahfarm.com"
              className="btn-secondary text-xs inline-flex items-center gap-2 py-2 px-4 border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              <Mail className="h-3.5 w-3.5" />
              {lang === 'bn' ? 'আইনি সহায়তা: support@amanahfarm.com' : 'Contact Legal Support: support@amanahfarm.com'}
            </a>
          </div>
        </div>
      </section>

      {/* ── Search & Filter Controls ─────────────────────── */}
      <section className="sticky top-20 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'bn' ? 'অনুসন্ধান করুন (যেমন: শেয়ার মূল্য, লভ্যাংশ, অডিট)...' : 'Search terms...'}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${activeCategory === cat
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
            <p className="text-white font-bold">{lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No matching policy clauses found'}</p>
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory(lang === 'bn' ? 'সব' : 'All')
              }}
              className="btn-secondary text-xs mt-4"
            >
              {lang === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
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
                          {lang === 'bn' ? `ধারা ${sec.number}` : `Section ${sec.number}`}
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

        {/* Notice Box */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'আইনি বা বিনিয়োগ শর্তাবলী নিয়ে কোনো প্রশ্ন আছে?' : 'Have questions regarding these terms & conditions?'}
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {lang === 'bn'
              ? 'আমাদের টিম আপনাকে সম্পূর্ণ সহায়তা প্রদান করবে।'
              : 'Our legal and investor support team is available to answer any questions.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:support@amanahfarm.com"
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3"
            >
              <Mail className="h-4 w-4" />
              support@amanahfarm.com
            </a>
            <Link
              href={ROUTES.CONTACT}
              className="btn-secondary inline-flex items-center gap-2 text-sm px-6 py-3 border-white/10"
            >
              {lang === 'bn' ? 'যোগাযোগ পাতায় যান' : 'Visit Contact Page'}
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
