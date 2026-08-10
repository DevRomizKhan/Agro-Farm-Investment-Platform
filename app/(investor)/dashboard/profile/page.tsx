'use client'

import { useEffect, useState } from 'react'
import { User, Mail, Phone, Calendar, Edit } from 'lucide-react'
import { ROUTES } from '@/constants'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

export default function InvestorProfilePage() {
  const { lang } = useLanguage()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { window.location.href = ROUTES.LOGIN; return }
      setUser(u)
      const { data } = await supabase.from('profiles').select('*').eq('user_id', u.id).maybeSingle()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'আপনার ব্যক্তিগত তথ্য পরিচালনা করুন' : 'Manage your personal information'}</p>
        </div>
        <Link href={`${ROUTES.INVESTOR_PROFILE}/edit`} className="btn-secondary flex items-center gap-2">
          <Edit className="h-4 w-4" />
          {lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Profile'}
        </Link>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-400" />
            {lang === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</label>
                <p className="text-white">{profile?.full_name || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}</label>
                <p className="text-white">{profile?.email || user?.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                <p className="text-white">{profile?.phone || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{lang === 'bn' ? 'সদস্যপদ গ্রহণের তারিখ' : 'Member Since'}</label>
                <p className="text-white">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US') : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">{lang === 'bn' ? 'অ্যাকাউন্টের অবস্থা' : 'Account Status'}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <span className="text-sm text-slate-300">{lang === 'bn' ? 'অ্যাকাউন্টের ধরন' : 'Account Type'}</span>
              <span className="text-white font-medium capitalize">
                {profile?.role === 'investor' ? (lang === 'bn' ? 'বিনিয়োগকারী' : 'Investor') : profile?.role || 'Investor'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <span className="text-sm text-slate-300">{lang === 'bn' ? 'ইমেইল যাচাইকরণ' : 'Email Verified'}</span>
              {user?.email_confirmed_at ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5 text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {lang === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                </span>
              ) : (
                <span className="text-amber-400 font-medium flex items-center gap-1.5 text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {lang === 'bn' ? 'যাচাই বাকি' : 'Unverified'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
