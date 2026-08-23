'use client'

import { useLanguage } from '@/lib/i18n/context'
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPage() {
  const { lang } = useLanguage()

  if (lang === 'en') {
    return (
      <div className="py-16 bg-slate-950 text-slate-300 min-h-screen">
        <div className="section-container max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h2>
            <p className="text-sm text-slate-400">Last updated: July 2026</p>
          </div>
          
          <div className="space-y-6 text-sm sm:text-base leading-relaxed glass-card p-8 bg-slate-900/60 border border-white/10">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-400">1. Information We Collect</h2>
              <p>
                We collect personal details provided during account creation and KYC verification, including full name, contact information, National ID (NID) details, and bank account credentials for dividend transfers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-400">2. How We Use Your Information</h2>
              <p>
                Your data is used strictly to process investments, manage annual dividend distributions, verify investor identity under financial guidelines, and issue legal certificates.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-400">3. Data Security &amp; Protection</h2>
              <p>
                We employ bank-grade SSL encryption and secure cloud database instances to ensure your identity and financial records remain 100% protected against unauthorized access.
              </p>
            </section>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 bg-slate-950 text-slate-300 min-h-screen">
      <div className="section-container max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mx-auto mb-2">
            <ShieldCheck className="h-4 w-4" />
            <span>গোপনীয়তা ও তথ্য সুরক্ষা নীতি</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">গোপনীয়তা নীতি (Privacy Policy)</h2>
          <p className="text-sm text-slate-400">সর্বশেষ হালনাগাদ: জুলাই ২০২৬</p>
        </div>
        
        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-emerald-400">
              <Eye className="h-5 w-5" />
              <h2 className="text-xl font-bold text-white">১. আমরা কী তথ্য সংগ্রহ করি</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              অ্যাকাউন্ট তৈরি এবং কেওয়াইসি (KYC) পরিচয় যাচাইকরণ প্রক্রিয়া সম্পন্ন করার জন্য আমরা আপনার পূর্ণ নাম, মোবাইল নম্বর, ইমেইল ঠিকানা, জাতীয় পরিচয়পত্র (NID) সম্পর্কিত তথ্য এবং লভ্যাংশ প্রেরণের জন্য ব্যাংক/বিকাশ অ্যাকাউন্টের বিবরণ সংগ্রহ করে থাকি।
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-emerald-400">
              <FileText className="h-5 w-5" />
              <h2 className="text-xl font-bold text-white">২. তথ্যের যথাযথ ব্যবহার</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              আপনার ব্যক্তিগত তথ্য শুধুমাত্র শেয়ার বরাদ্দ প্রক্রিয়া, বাৎসরিক নিট লভ্যাংশ বণ্টন, বিনিয়োগকারী পরিচয় নিশ্চিতকরণ এবং আইনি অংশীদারিত্ব চুক্তিমালা ও ডিজিটাল সনদপত্র তৈরির কাজে ব্যবহৃত হয়।
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-emerald-400">
              <Lock className="h-5 w-5" />
              <h2 className="text-xl font-bold text-white">৩. তথ্য সুরক্ষা ও নিরাপত্তা ব্যবস্থা</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              আমরা ব্যাংক-মানের ২৫৬-বিট SSL এনক্রিপশন এবং নিরাপদ ক্লাউড ডেটাবেস অবকাঠামো ব্যবহার করি। আপনার ব্যক্তিগত ও আর্থিক তথ্য অত্যন্ত গোপনীয় এবং এটি কখনোই কোনো তৃতীয় পক্ষের সাথে বাণিজ্যিক উদ্দেশ্যে শেয়ার করা হয় না।
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
