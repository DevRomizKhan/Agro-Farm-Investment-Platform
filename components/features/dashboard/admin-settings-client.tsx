'use client'

import { User, Bell, LogOut } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

interface AdminSettingsClientProps {
  profile: { full_name: string | null; email: string | null; role: string }
  userEmail: string
  bankSettings: any
  saveBankSettings: (formData: FormData) => Promise<void>
  handleLogout: () => Promise<void>
}

export function AdminSettingsClient({ profile, userEmail, bankSettings, saveBankSettings, handleLogout }: AdminSettingsClientProps) {
  const { lang } = useLanguage()

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'সেটিংস' : 'Settings'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'অ্যাকাউন্টের পছন্দ ও ব্যাংক তথ্য পরিচালনা করুন' : 'Manage your account preferences'}</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Bank Transfer Details */}
        <div className="glass-card p-6">
          <h2 className="mb-2 font-semibold text-white">{lang === 'bn' ? 'বিনিয়োগকারীর ব্যাংক ট্রান্সফার তথ্য' : 'Investor Bank Transfer Details'}</h2>
          <p className="mb-4 text-xs text-slate-400">
            {lang === 'bn' ? 'এই তথ্য শুধুমাত্র বিনিয়োগ অনুমোদনের পরে বিনিয়োগকারীকে দেখানো হয়। অর্থপ্রদান কেবল ব্যাংক ট্রান্সফারের মাধ্যমে গ্রহণ করুন।' : 'These details appear only after you approve an investor request. Investors must pay through bank transfer only.'}
          </p>
          <form action={saveBankSettings} className="grid gap-3 sm:grid-cols-2">
            <input name="account_name" defaultValue={bankSettings?.account_name || ''} required placeholder={lang === 'bn' ? 'হিসাবধারীর নাম' : 'Account holder name'} className="input-base" />
            <input name="bank_name" defaultValue={bankSettings?.bank_name || ''} required placeholder={lang === 'bn' ? 'ব্যাংকের নাম' : 'Bank name'} className="input-base" />
            <input name="account_number" defaultValue={bankSettings?.account_number || ''} required placeholder={lang === 'bn' ? 'হিসাব নম্বর' : 'Account number'} className="input-base" />
            <input name="branch_name" defaultValue={bankSettings?.branch_name || ''} placeholder={lang === 'bn' ? 'শাখার নাম' : 'Branch'} className="input-base" />
            <input name="routing_number" defaultValue={bankSettings?.routing_number || ''} placeholder={lang === 'bn' ? 'রাউটিং নম্বর' : 'Routing number'} className="input-base" />
            <textarea name="instructions" defaultValue={bankSettings?.instructions || ''} placeholder={lang === 'bn' ? 'পেমেন্ট নির্দেশনা' : 'Payment instructions'} className="input-base sm:col-span-2" rows={3} />
            <button className="btn-primary justify-center sm:col-span-2">{lang === 'bn' ? 'ব্যাংক তথ্য সংরক্ষণ করুন' : 'Save Bank Details'}</button>
          </form>
        </div>

        {/* Profile Info */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-400" />
            {lang === 'bn' ? 'প্রোফাইল তথ্য' : 'Profile Information'}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</label>
              <p className="text-white">{profile.full_name || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'ইমেইল' : 'Email'}</label>
              <p className="text-white">{profile.email || userEmail}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'ভূমিকা' : 'Role'}</label>
              <p className="text-white capitalize">{lang === 'bn' ? 'মালিক' : profile.role}</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-400" />
            {lang === 'bn' ? 'বিজ্ঞপ্তি সেটিংস' : 'Notifications'}
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">{lang === 'bn' ? 'নতুন বিনিয়োগে ইমেইল বিজ্ঞপ্তি' : 'Email notifications for new investments'}</span>
              <input type="checkbox" defaultChecked disabled className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-emerald-500 opacity-50" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">{lang === 'bn' ? 'কেওয়াইসি জমায় ইমেইল বিজ্ঞপ্তি' : 'Email notifications for KYC submissions'}</span>
              <input type="checkbox" defaultChecked disabled className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-emerald-500 opacity-50" />
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-3">{lang === 'bn' ? 'বিজ্ঞপ্তি পছন্দ পরবর্তী আপডেটে পাওয়া যাবে।' : 'Notification preferences will be available in a future update.'}</p>
        </div>

        {/* Logout */}
        <form action={handleLogout}>
          <button type="submit" className="w-full py-3 px-4 rounded-lg bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" />
            {lang === 'bn' ? 'সাইন আউট করুন' : 'Sign Out'}
          </button>
        </form>
      </div>
    </div>
  )
}
