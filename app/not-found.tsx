'use client'

import Link from 'next/link'
import { Leaf, Home } from 'lucide-react'
import { ROUTES } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'

export default function NotFound() {
  const { lang } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 mx-auto mb-8">
          <Leaf className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-8xl font-black text-slate-800 mb-4">৪০৪</h1>
        <h2 className="text-2xl font-bold text-white mb-3">
          {lang === 'bn' ? 'পৃষ্ঠাটি পাওয়া যায়নি' : 'Page Not Found'}
        </h2>
        <p className="text-slate-400 mb-8">
          {lang === 'bn' ? 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই অথবা সরিয়ে নেওয়া হয়েছে।' : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <Link href={ROUTES.HOME} className="btn-primary">
          <Home className="h-4 w-4" />
          {lang === 'bn' ? 'মূল পাতায় ফিরে যান' : 'Back to Home'}
        </Link>
      </div>
    </div>
  )
}
