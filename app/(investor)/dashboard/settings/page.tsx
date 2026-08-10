'use client'

import { useEffect, useState } from 'react'
import { User, Bell, LogOut } from 'lucide-react'
import { ROUTES } from '@/constants'
import { logoutAction } from '@/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

export default function InvestorSettingsPage() {
  const { lang } = useLanguage()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { window.location.href = ROUTES.LOGIN; return }
      setUser(u)
      const { data } = await supabase.from('profiles').select('role, full_name, email').eq('user_id', u.id).maybeSingle()
      setProfile(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'সেটিংস' : 'Settings'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'আপনার অ্যাকাউন্টের পছন্দ ও প্রাধান্য পরিচালনা করুন' : 'Manage your account preferences'}</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-400" />
            {lang === 'bn' ? 'প্রোফাইল তথ্য' : 'Profile Information'}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</label>
              <p className="text-white">{profile?.full_name || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'ইমেইল' : 'Email'}</label>
              <p className="text-white">{profile?.email || user?.email}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-400" />
            {lang === 'bn' ? 'বিজ্ঞপ্তি সেটিংস' : 'Notifications'}
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">{lang === 'bn' ? 'বিনিয়োগ আপডেটের জন্য ইমেইল বিজ্ঞপ্তি' : 'Email notifications for investment updates'}</span>
              <input type="checkbox" defaultChecked disabled className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-emerald-500 opacity-50" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">{lang === 'bn' ? 'লভ্যাংশ পরিশোধের জন্য ইমেইল বিজ্ঞপ্তি' : 'Email notifications for ROI payouts'}</span>
              <input type="checkbox" defaultChecked disabled className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-emerald-500 opacity-50" />
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-3">{lang === 'bn' ? 'বিজ্ঞপ্তি পছন্দ পরবর্তী আপডেটে পাওয়া যাবে।' : 'Notification preferences will be available in a future update.'}</p>
        </div>

        <form action={logoutAction}>
          <button type="submit" className="w-full py-3 px-4 rounded-lg bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" />
            {lang === 'bn' ? 'সাইন আউট করুন' : 'Sign Out'}
          </button>
        </form>
      </div>
    </div>
  )
}
