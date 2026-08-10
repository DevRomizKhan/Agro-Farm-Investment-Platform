'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

type Submission = {
  id: string
  user_id: string
  full_name?: string
  email?: string
  status: string
  submitted_at?: string
  created_at: string
  reviewed_at?: string
  updated_at?: string
}

type Profile = {
  user_id: string
  full_name: string | null
  email: string | null
}

export default function AdminKYCManagementPage() {
  const { lang } = useLanguage()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [profileMap, setProfileMap] = useState<Map<string, Profile>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: subs } = await supabase
        .from('kyc_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      const userIds = subs?.map((s: Submission) => s.user_id) || []
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email')
        .in('user_id', userIds)

      setSubmissions(subs || [])
      setProfileMap(new Map((profiles as Profile[] | null)?.map(p => [p.user_id, p]) || []))
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  const pendingSubmissions = submissions.filter(s => s.status === 'pending')
  const verifiedSubmissions = submissions.filter(s => s.status === 'approved')
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected')

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'কেওয়াইসি (KYC) নথি যাচাইকরণ' : 'KYC Document Verification'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'NID নথিপত্র যাচাই করুন এবং বিনিয়োগকারীর অ্যাকাউন্ট অনুমোদন দিন' : 'Verify NID documentation and approve user accounts'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <Clock className="h-4.5 w-4.5 text-yellow-400" />
            {lang === 'bn' ? `অপেক্ষমাণ যাচাইকরণ (${pendingSubmissions.length})` : `Pending Verification (${pendingSubmissions.length})`}
          </h2>
          {pendingSubmissions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{lang === 'bn' ? 'কোনো অপেক্ষমাণ কেওয়াইসি নেই' : 'No pending KYC submissions'}</p>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map((sub) => {
                const userProfile = profileMap.get(sub.user_id)
                return (
                  <div key={sub.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-yellow-500/20 transition-colors flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{userProfile?.full_name || sub.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile?.email || sub.email}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{lang === 'bn' ? 'জমার তারিখ:' : 'Submitted'} {sub.submitted_at ? formatDate(sub.submitted_at) : formatDate(sub.created_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${sub.id}`} className="btn-primary py-1.5 px-3 text-xs flex-shrink-0">
                      {lang === 'bn' ? 'নিরীক্ষা' : 'Review'}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Approved */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
            {lang === 'bn' ? `অনুমোদিত অ্যাকাউন্ট (${verifiedSubmissions.length})` : `Approved Accounts (${verifiedSubmissions.length})`}
          </h2>
          {verifiedSubmissions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{lang === 'bn' ? 'কোনো অনুমোদিত জমা নেই' : 'No approved submissions'}</p>
          ) : (
            <div className="space-y-3">
              {verifiedSubmissions.map((sub) => {
                const userProfile = profileMap.get(sub.user_id)
                return (
                  <div key={sub.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 transition-colors flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{userProfile?.full_name || sub.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile?.email || sub.email}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{lang === 'bn' ? 'অনুমোদিত:' : 'Approved'} {formatDate(sub.reviewed_at || sub.updated_at || sub.created_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${sub.id}`} className="btn-secondary py-1.5 px-3 text-xs flex-shrink-0">
                      {lang === 'bn' ? 'দেখুন' : 'View'}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Rejected */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-semibold text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <XCircle className="h-4.5 w-4.5 text-red-400" />
            {lang === 'bn' ? `বাতিলকৃত অ্যাকাউন্ট (${rejectedSubmissions.length})` : `Rejected Accounts (${rejectedSubmissions.length})`}
          </h2>
          {rejectedSubmissions.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">{lang === 'bn' ? 'কোনো বাতিলকৃত জমা নেই' : 'No rejected submissions'}</p>
          ) : (
            <div className="space-y-3">
              {rejectedSubmissions.map((sub) => {
                const userProfile = profileMap.get(sub.user_id)
                return (
                  <div key={sub.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-red-500/20 transition-colors flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white text-sm truncate">{userProfile?.full_name || sub.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile?.email || sub.email}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{lang === 'bn' ? 'বাতিলের তারিখ:' : 'Rejected'} {formatDate(sub.reviewed_at || sub.updated_at || sub.created_at)}</p>
                    </div>
                    <Link href={`${ROUTES.ADMIN_KYC}/${sub.id}`} className="btn-secondary py-1.5 px-3 text-xs flex-shrink-0">
                      {lang === 'bn' ? 'দেখুন' : 'View'}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
