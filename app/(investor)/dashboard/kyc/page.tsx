'use client'

import { useEffect, useState } from 'react'
import { KYCForm } from '@/components/features/kyc/kyc-form'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

export default function KYCPage() {
  const { lang } = useLanguage()
  const [kyc, setKyc] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKyc = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('kyc_submissions')
        .select('*, documents:kyc_documents(*)')
        .eq('user_id', user.id)
        .maybeSingle()
      setKyc(data)
      setLoading(false)
    }
    fetchKyc()
  }, [])

  const status = kyc?.status || 'not_submitted'

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="fade-in space-y-8 max-w-4xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'কেওয়াইসি (KYC) পরিচয় যাচাইকরণ' : 'KYC Identity Verification'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'বিনিয়োগ ও লভ্যাংশ উত্তোলনের সুবিধা পেতে পরিচয় যাচাই করুন' : 'Verify your identity to enable account investing and payouts'}</p>
        </div>
      </div>

      {status === 'approved' && (
        <div className="glass-card p-8 text-center space-y-4 border-emerald-500/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{lang === 'bn' ? 'পরিচয় যাচাইকরণ সম্পন্ন!' : 'Verification Complete!'}</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {lang === 'bn' ? 'আপনার পরিচয় সফলভাবে যাচাই করা হয়েছে। আপনি এখন সকল বিনিয়োগ প্ল্যান অ্যাক্সেস করতে পারবেন।' : 'Your identity has been successfully verified. You now have full access to our investment plans.'}
          </p>
          <div className="pt-4">
            <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary">
              {lang === 'bn' ? 'বিনিয়োগ প্ল্যান দেখুন' : 'Browse Investment Plans'}
            </Link>
          </div>
        </div>
      )}

      {status === 'pending' && kyc && (
        <div className="glass-card p-8 text-center space-y-4 border-yellow-500/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 mx-auto">
            <Clock className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">{lang === 'bn' ? 'নথিপত্র নিরীক্ষাধীন রয়েছে' : 'Under Review'}</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {lang === 'bn' ? 'আপনার পরিচয়পত্র ও নথিপত্র আমাদের কমপ্লায়েন্স টিম নিরীক্ষা করছে। সাধারণত ২৪ ঘণ্টার মধ্যে সিদ্ধান্ত নেওয়া হয়।' : 'Your verification documents have been submitted and are under review by our compliance team. This typically takes up to 24 hours.'}
          </p>
          {kyc.submitted_at && (
            <p className="text-xs text-slate-500">{lang === 'bn' ? 'জমার তারিখ:' : 'Submitted on'} {formatDate(kyc.submitted_at)}</p>
          )}
          <div className="pt-4">
            <Link href={ROUTES.INVESTOR_DASHBOARD} className="btn-secondary">
              {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}
            </Link>
          </div>
        </div>
      )}

      {status === 'rejected' && kyc && (
        <div className="space-y-6">
          <div className="glass-card p-6 border-red-500/20 flex gap-4 items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">{lang === 'bn' ? 'কেওয়াইসি আবেদন বাতিল হয়েছে' : 'KYC Application Rejected'}</h2>
              <p className="text-sm text-slate-400 mt-1">
                {lang === 'bn' ? 'আপনার আবেদন বাতিল হয়েছে। নিচের কারণ পড়ুন এবং সঠিক নথিপত্রসহ পুনরায় জমা দিন।' : 'Your application was rejected. Please review the reason below and submit a new application with the correct documents.'}
              </p>
              {kyc.rejection_reason && (
                <div className="mt-4 p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-sm text-red-400">
                  <span className="font-semibold">{lang === 'bn' ? 'কারণ:' : 'Reason:'}</span> {kyc.rejection_reason}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-white/5 pt-6">
            <h3 className="text-lg font-semibold text-white mb-6">{lang === 'bn' ? 'কেওয়াইসি পুনরায় জমা দিন' : 'Resubmit KYC Verification'}</h3>
            <KYCForm />
          </div>
        </div>
      )}

      {status === 'not_submitted' && <KYCForm />}
    </div>
  )
}
