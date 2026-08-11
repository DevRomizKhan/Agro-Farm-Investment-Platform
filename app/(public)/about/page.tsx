'use client'

import Image from 'next/image'
import Link from 'next/link'
import { COMPANY_INFO, ROUTES } from '@/constants'
import { Leaf, ShieldCheck, Target, Eye, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { CountUp } from '@/components/ui/count-up'
import { useLanguage } from '@/lib/i18n/context'

export default function AboutPage() {
  const { lang, t } = useLanguage()

  const founderName = lang === 'bn' ? 'কাজী শাকিব' : COMPANY_INFO.founder
  const executiveName = lang === 'bn' ? 'নীরব হাসান' : COMPANY_INFO.executive
  const founderTitle = lang === 'bn' ? 'প্রতিষ্ঠাতা ও সিইও' : COMPANY_INFO.founderTitle
  const executiveTitle = lang === 'bn' ? 'প্রাক্তন কার্যনির্বাহী' : COMPANY_INFO.executiveTitle

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
    { icon: Users, val: lang === 'bn' ? '৪+' : '4+', numericValue: 4, suffix: '+', label: lang === 'bn' ? 'সক্রিয় বিনিয়োগকারী' : 'Active Investors' },
    { icon: Leaf, val: lang === 'bn' ? 'গরু ও মৎস্য' : 'Cow & Fish', label: lang === 'bn' ? 'উৎপাদন খাত' : 'Production Scope' },
    { icon: ShieldCheck, val: lang === 'bn' ? '১০০% শরীয়াহ' : '100% Sharia', label: lang === 'bn' ? 'সম্মত পরিচালনা' : 'Compliant Operations' },
  ]

  const leadership = [
    { name: founderName, role: founderTitle },
    { name: executiveName, role: executiveTitle },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">
            <Leaf className="h-3.5 w-3.5" />
            {t.about.badge}
          </div>
          <h1 className="text-[2.65rem] font-black leading-[1.05] text-white sm:text-[3.35rem] lg:text-[4.25rem]">
            {t.about.titlePrefix}
            <span className="gradient-text">{t.about.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-[1.02rem] leading-8 text-slate-300 sm:text-[1.15rem]">
            {t.about.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="group relative aspect-[4/3] min-h-[320px] overflow-hidden rounded-[32px] border border-emerald-500/20 shadow-2xl shadow-emerald-950/20">
            <Image
              src="/images/carousel/slide3.jpg"
              alt="Amanah Farm cattle operation in Bangladesh"
              width={1400}
              height={1050}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md">
              <p className="text-sm font-bold text-white">
                {lang === 'bn' ? 'দায়িত্বশীল গবাদি পশু মোটাতাজাকরণ ও চাষ প্রাঙ্গণ' : 'Responsible Livestock Facilities'}
              </p>
              <p className="mt-1 text-xs text-slate-400">{COMPANY_INFO.farmLocations}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[2rem] font-black leading-tight text-white sm:text-[2.6rem]">
              {lang === 'bn' ? 'স্বচ্ছতার ভিত্তিতে গঠিত, ' : 'Built on Transparency, '}
              <span className="gradient-text">{lang === 'bn' ? 'আস্থায় পরিচালিত' : 'Powered by Trust'}</span>
            </h2>
            <p className="text-[1rem] leading-8 text-slate-300 sm:text-[1.05rem]">
              {lang === 'bn'
                ? `আমানাহ ফার্ম প্রতিষ্ঠিত হয়েছে ${founderName}-এর দূরদর্শী নেতৃত্বে — মূল উদ্দেশ্য বাংলাদেশে কৃষি যৌথ বিনিয়োগকে স্বচ্ছ ও সহজলভ্য করে তোলা।`
                : `Amanah Farm was founded by ${founderName} with one goal: make agricultural co-ownership transparent and genuinely accessible to Bangladeshi investors.`}
            </p>
            <p className="text-[0.97rem] leading-8 text-slate-400 sm:text-[1rem]">
              {lang === 'bn'
                ? 'আমাদের বর্তমান উদ্যোগ, প্রজেক্ট আদি, হলো একটি ২ বছর মেয়াদী (জুলাই ২০২৬ – জুন ২০২৮) গরু ও মৎস্য চাষ প্রকল্প। বিনিয়োগকারীরা শরীয়াহ অংশীদারিত্ব নীতি মেনে মূল সম্পদের আনুপাতিক মালিকানা এবং বাৎসরিক নিট লভ্যাংশ পান।'
                : 'Our current initiative, Project Adi, is a 2-year ownership program (July 2026 – June 2028) focused on cow and fish production. Investors receive proportionate ownership rights and annual net dividends under Islamic Sharia partnership principles.'}
            </p>
            <Link href={ROUTES.REGISTER} className="btn-primary inline-flex items-center gap-2 rounded-xl text-sm font-semibold">
              {t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/30 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">
              {lang === 'bn' ? 'আমানাহ ফার্মের নেপথ্য কর্মীদল' : 'The people behind Amanah Farm'}
            </p>
            <h2 className="mb-6 text-[1.9rem] font-black text-white sm:text-[2.4rem]">
              {lang === 'bn' ? 'কৃষি বিশেষজ্ঞ ও সুদক্ষ ব্যবস্থাপনা' : 'Built by people who understand agriculture'}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {leadership.map(({ name, role }) => (
                <div key={name} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-lg font-bold text-white">{name}</p>
                  <p className="mt-1 text-sm text-slate-400">{role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-[280px] rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">
              {lang === 'bn' ? 'সরাসরি যোগাযোগ করুন' : 'Connect with us'}
            </p>
            <p className="text-sm text-slate-200">{COMPANY_INFO.phone}</p>
            <p className="mt-2 text-sm text-slate-300">{COMPANY_INFO.email}</p>
            <p className="mt-2 text-sm text-slate-400">{COMPANY_INFO.farmLocations}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/40 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {stats.map(({ icon: Icon, val, numericValue, suffix, label }) => (
            <div key={label} className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <Icon className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="font-mono text-[1.65rem] font-black text-white sm:text-[1.9rem]">
                {numericValue !== undefined ? (
                  <CountUp value={numericValue} suffix={suffix} label={`${numericValue}${suffix || ''} ${label}`} />
                ) : val}
              </p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-[1.9rem] font-black text-white sm:text-[2.4rem]">
            {lang === 'bn' ? 'আমাদের মূল আদর্শ ও নীতিমালা' : 'Our Core Principles'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="space-y-4 rounded-[28px] border border-white/10 bg-slate-900/50 p-8 transition-all hover:border-emerald-500/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-sm leading-7 text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
