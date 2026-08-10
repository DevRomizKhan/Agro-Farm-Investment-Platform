'use client'

import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME, COMPANY_INFO, ROUTES } from '@/constants'
import { Leaf, ShieldCheck, Target, Eye, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'
import { useLanguage } from '@/lib/i18n/context'

export default function AboutPage() {
  const { lang, t } = useLanguage()

  const values = [
    {
      icon: Target,
      title: lang === 'bn' ? 'আমাদের লক্ষ্য (Mission)' : 'Our Mission',
      desc: lang === 'bn'
        ? 'স্বচ্ছ ও শরীয়াহ সম্মত অংশীদারিত্বের মাধ্যমে বাংলাদেশের সাধারণ বিনিয়োগকারীদের গরু ও মাছের উৎপাদনশীল খামার সম্পদের আনুপাতিক মালিকানায় যুক্ত করা।'
        : 'Connect everyday investors to real, asset-backed agricultural production — offering transparent, Sharia-compliant co-ownership of cow and fish farming in Bangladesh.',
    },
    {
      icon: Eye,
      title: lang === 'bn' ? 'আমাদের ভিশন (Vision)' : 'Our Vision',
      desc: lang === 'bn'
        ? 'কৃষি খাতে বাংলাদেশের সবচেয়ে বিশ্বস্ত ও আধুনিক বিনিয়োগ প্ল্যাটফর্ম গড়ে তোলা, যেখানে শতভাগ নৈতিক ও সম্পদ-ভিত্তিক অংশীদারিত্ব নিশ্চিত হয়।'
        : 'Build Bangladesh\'s most trusted agro-investment ecosystem, empowering thousands of investors through ethical, proportionate ownership of production-based assets.',
    },
    {
      icon: ShieldCheck,
      title: lang === 'bn' ? 'আমাদের প্রতিশ্রুতি' : 'Our Promise',
      desc: lang === 'bn'
        ? '১০০% শরীয়াহ আইন অনুসরণ, বাৎসরিক চার্টার্ড অডিট এবং আয়-ব্যয়ের পূর্ণ স্বচ্ছতা — কোনো অনৈতিক চুক্তি বা ফিক্সড ইন্টারেস্ট সুদের সুযোগ নেই।'
        : '100% Shariah compliance, independent annual audits, and full transparency in income, expenses, and dividends — no fixed guarantees, no compromises.',
    },
  ]

  const stats = [
    { icon: TrendingUp, val: lang === 'bn' ? 'পরিবর্তনশীল' : 'Variable', label: lang === 'bn' ? 'বাৎসরিক নিট লভ্যাংশ' : 'Net Annual Returns' },
    { icon: Users, val: '500+', numericValue: 500, suffix: '+', label: lang === 'bn' ? 'সক্রিয় বিনিয়োগকারী' : 'Active Investors' },
    { icon: Leaf, val: lang === 'bn' ? 'গরু ও মৎস্য' : 'Cow & Fish', label: lang === 'bn' ? 'উৎপাদন খাত' : 'Production Scope' },
    { icon: ShieldCheck, val: lang === 'bn' ? '১০০% শরীয়াহ' : '100% Sharia', label: lang === 'bn' ? 'সম্মত পরিচালনা' : 'Compliant Operations' },
  ]

  const leadership = [
    { name: 'কাজী শাকিব', role: lang === 'bn' ? 'প্রতিষ্ঠাতা ও সিইও' : 'Founder & CEO' },
    { name: 'নীরব হাসান', role: lang === 'bn' ? 'প্রাক্তন কার্যনির্বাহী' : 'Former Executor' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Page Hero ─────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Leaf className="h-3.5 w-3.5" />
            {t.about.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            {t.about.titlePrefix}<span className="gradient-text">{t.about.titleHighlight}</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.about.description}
          </p>
        </div>
      </section>

      {/* ── Two-column story ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl group">
            <Image
              src="/images/carousel/slide3.jpg"
              alt="Amanah Farm cattle operation in Bangladesh"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10">
              <p className="text-sm font-bold text-white">
                {lang === 'bn' ? 'দায়িত্বশীল গবাদি পশু মোটাতাজাকরণ ও চাষ প্রাঙ্গণ' : 'Responsible Livestock Facilities'}
              </p>
              <p className="text-xs text-slate-400">{COMPANY_INFO.farmLocations}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {lang === 'bn' ? 'স্বচ্ছতার ভিত্তিতে গঠিত, ' : 'Built on Transparency, '}
              <span className="gradient-text">
                {lang === 'bn' ? 'আস্থায় পরিচালিত' : 'Powered by Trust'}
              </span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {lang === 'bn'
                ? `আমানাহ ফার্ম প্রতিষ্ঠিত হয়েছে ${COMPANY_INFO.founder}-এর দূরদর্শী নেতৃত্বে — মূল উদ্দেশ্য বাংলাদেশে কৃযি যৌথ বিনিয়োগকে স্বচ্ছ ও বিনিয়োগকারীদের জন্য ব্যাপকভাবে সুগম করা।`
                : `Amanah Farm was founded by ${COMPANY_INFO.founder} with one goal: make agricultural co-ownership transparent and genuinely accessible to Bangladeshi investors.`}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {lang === 'bn'
                ? 'আমাদের বর্তমান উদ্যোগ, প্রজেক্ট আদি, হলো একটি ২ বছর মেয়াদী (জুলাই ২০২৬ – জুন ২০২৮) গরু ও মৎস্য চাষ প্রকল্প। বিনিয়োগকারীরা শরীয়াহ অংশীদারিত্ব নীতি মেনে মূল সম্পদের আনুপাতিক মালিকানা এবং বাৎসরিক নিট লভ্যাংশ পান।'
                : 'Our current initiative, Project Adi, is a 2-year ownership program (July 2026 – June 2028) focused on cow and fish production. Investors receive proportionate ownership rights and annual net dividends under Islamic Sharia partnership principles.'}
            </p>
            <Link href={ROUTES.REGISTER} className="btn-primary inline-flex items-center gap-2 text-sm rounded-xl">
              {t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Leadership & contact ─────────────────────── */}
      <section className="border-y border-white/5 bg-slate-900/30 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
              {lang === 'bn' ? 'আমানাহ ফার্মের নেপথ্য কর্মীদল' : 'The people behind Amanah Farm'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
              {lang === 'bn' ? 'কৃষি বিশেষজ্ঞ ও সুদক্ষ ব্যবস্থাপনা' : 'Built by people who understand agriculture'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leadership.map(({ name, role }) => (
                <div key={name} className="rounded-2xl bg-slate-950/70 border border-white/10 p-5">
                  <p className="text-lg font-bold text-white">{name}</p>
                  <p className="text-sm text-slate-400 mt-1">{role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 min-w-[280px]">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              {lang === 'bn' ? 'সরাসরি যোগাযোগ করুন' : 'Connect with us'}
            </p>
            <p className="text-sm text-slate-200">{COMPANY_INFO.phone}</p>
            <p className="text-sm text-slate-300 mt-2">{COMPANY_INFO.email}</p>
            <p className="text-sm text-slate-400 mt-2">{COMPANY_INFO.farmLocations}</p>
          </div>
        </div>
      </section>

      {/* ── Stats Row ─────────────────────────────────── */}
      <section className="border-y border-white/5 bg-slate-900/40 py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, val, numericValue, suffix, label }) => (
            <div key={label} className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Icon className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {numericValue !== undefined ? (
                  <CountUp value={numericValue} suffix={suffix} label={`${numericValue}${suffix || ''} ${label}`} />
                ) : val}
              </p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {lang === 'bn' ? 'আমাদের মূল আদর্শ ও নীতিমালা' : 'Our Core Principles'}
          </h2>
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
