'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className={`inline-flex items-center rounded-xl bg-slate-900/80 p-1 border border-white/10 ${className}`}>
      <button
        type="button"
        onClick={() => setLang('bn')}
        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          lang === 'bn'
            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
            : 'text-slate-400 hover:text-white'
        }`}
        title="বাংলা সংস্করণ নির্বাচন করুন"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>বাংলা</span>
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          lang === 'en'
            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
            : 'text-slate-400 hover:text-white'
        }`}
        title="Switch to English Version"
      >
        <span>ENG</span>
      </button>
    </div>
  )
}
