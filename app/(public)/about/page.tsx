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
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:pb-28 sm:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.24em] text-emerald-400">
            <Leaf className="h-3.5 w-3.5 shrink-0" />
            <span>{t.about.badge}</span>
          </div>
          <h1 className="text-2xl font-black leading-tight text-white sm:text-4xl lg:text-[4.25rem] sm:leading-[1.05] break-words">
            {t.about.titlePrefix}
            <span className="gradient-text">{t.about.titleHighlight}</span>
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-3xl text-sm sm:text-[1.15rem] leading-7 sm:leading-8 text-slate-300">
            {t.about.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24">
        <div className="grid items-center gap-10 lg:gap-14 lg:grid-cols-2">
          <div className="group relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[32px] border border-emerald-500/20 shadow-2xl shadow-emerald-950/20">
            <Image
              src="/images/carousel/slide3.jpg"
              alt="Amanah Farm cattle operation in Bangladesh"
              width={1400}
              height={1050}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/85 p-3.5 sm:p-5 backdrop-blur-md">
              <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                {lang === 'bn' ? 'দায়িত্বশীল গবাদি পশু মোটাতাজাকরণ ও চাষ প্রাঙ্গণ' : 'Responsible Livestock Facilities'}
              </p>
              <p className="mt-1 text-[0.7rem] sm:text-xs text-slate-400 leading-snug">{COMPANY_INFO.farmLocations}</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl font-black leading-snug text-white sm:text-[2.6rem]">
              {lang === 'bn' ? 'স্বচ্ছতার ভিত্তিতে গঠিত, ' : 'Built on Transparency, '}
              <span className="gradient-text">{lang === 'bn' ? 'আস্থায় পরিচালিত' : 'Powered by Trust'}</span>
            </h2>
            <p className="text-sm sm:text-[1.05rem] leading-7 sm:leading-8 text-slate-300">
              {lang === 'bn'
                ? `আমানাহ ফার্ম প্রতিষ্ঠিত হয়েছে ${founderName}-এর দূরদর্শী নেতৃত্বে — মূল উদ্দেশ্য বাংলাদেশে কৃষি যৌথ বিনিয়োগকে স্বচ্ছ ও সহজলভ্য করে তোলা।`
                : `Amanah Farm was founded by ${founderName} with one goal: make agricultural co-ownership transparent and genuinely accessible to Bangladeshi investors.`}
            </p>
            <p className="text-xs sm:text-[1rem] leading-6 sm:leading-8 text-slate-400">
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

      <section className="border-y border-white/5 bg-slate-900/30 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:gap-10 px-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-2 sm:mb-3 text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.24em] text-emerald-400">
              {lang === 'bn' ? 'আমানাহ ফার্মের নেপথ্য কর্মীদল' : 'The people behind Amanah Farm'}
            </p>
            <h2 className="mb-5 sm:mb-6 text-xl sm:text-[2.4rem] font-black text-white leading-snug">
              {lang === 'bn' ? 'কৃষি বিশেষজ্ঞ ও সুদক্ষ ব্যবস্থাপনা' : 'Built by people who understand agriculture'}
            </h2>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {leadership.map(({ name, role }) => (
                <div key={name} className="rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-5">
                  <p className="text-base sm:text-lg font-bold text-white">{name}</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">{role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:min-w-[280px] rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6">
            <p className="mb-3 text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.24em] text-emerald-400">
              {lang === 'bn' ? 'সরাসরি যোগাযোগ করুন' : 'Connect with us'}
            </p>
            <p className="text-xs sm:text-sm text-slate-200">{COMPANY_INFO.phone}</p>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 break-all">{COMPANY_INFO.email}</p>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">{COMPANY_INFO.farmLocations}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-slate-900/40 py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3.5 sm:gap-6 px-4 md:grid-cols-4">
          {stats.map(({ icon: Icon, val, numericValue, suffix, label }) => (
            <div key={label} className="space-y-2 text-center rounded-xl border border-white/5 bg-slate-950/40 p-3 sm:p-4 md:border-none md:bg-transparent md:p-0">
              <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
              </div>
              <div className="text-base font-bold text-white sm:text-2xl">
                {numericValue !== undefined ? (
                  <span className="font-mono">
                    <CountUp value={numericValue} suffix={suffix} label={`${numericValue}${suffix || ''} ${label}`} />
                  </span>
                ) : (
                  <span className="font-semibold text-sm sm:text-xl break-words">{val}</span>
                )}
              </div>
              <p className="text-[0.7rem] sm:text-xs text-slate-400 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-xl sm:text-[2.4rem] font-black text-white leading-tight">
            {lang === 'bn' ? 'আমাদের মূল আদর্শ ও নীতিমালা' : 'Our Core Demodeploy issues Principles'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="space-y-3 sm:space-y-4 rounded-2xl sm:rounded-[28px] border border-white/10 bg-slate-900/50 p-5 sm:p-8 transition-all hover:border-emerald-500/30">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
              <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
