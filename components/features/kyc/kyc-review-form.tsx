'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { kycReviewSchema, type KYCReviewFormData } from '@/schemas'
import { ROUTES } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'

interface KYCReviewFormProps {
  kycId: string
}

export function KYCReviewForm({ kycId }: KYCReviewFormProps) {
  const { lang } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'approved' | 'rejected' | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<KYCReviewFormData>({
    resolver: zodResolver(kycReviewSchema),
  })

  const onSubmit = async (data: KYCReviewFormData) => {
    if (!status) return toast.error(lang === 'bn' ? 'অনুমোদন বা প্রত্যাখ্যানের একটি সিদ্ধান্ত বেছে নিন' : 'Please select approval or rejection action')
    if (status === 'rejected' && !data.rejection_reason) {
      return toast.error(lang === 'bn' ? 'প্রত্যাখ্যানের কারণ লিখুন' : 'Please provide a reason for rejection')
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/kyc/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kycId,
          status,
          rejection_reason: data.rejection_reason,
          notes: data.notes,
        }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        toast.success(lang === 'bn' ? `কেওয়াইসি আবেদন সফলভাবে ${status === 'approved' ? 'অনুমোদন' : 'প্রত্যাখ্যান'} করা হয়েছে` : `KYC application ${status} successfully`)
        router.push(ROUTES.ADMIN_KYC)
      } else {
        toast.error(result.error || (lang === 'bn' ? 'কেওয়াইসি অবস্থা হালনাগাদ করা যায়নি' : 'Failed to update KYC status'))
      }
    } catch {
      toast.error(lang === 'bn' ? 'একটি অপ্রত্যাশিত সমস্যা হয়েছে' : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-6">
      <h3 className="font-semibold text-white text-base pb-3 border-b border-white/5">
        {lang === 'bn' ? 'যাচাইকরণ সিদ্ধান্ত' : 'Verification Action'}
      </h3>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            setStatus('approved')
            setValue('status', 'approved', { shouldValidate: true })
          }}
          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
            status === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
              : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-500'
          }`}
        >
          <CheckCircle className="h-6 w-6 mb-2" />
          {lang === 'bn' ? 'যাচাইকরণ অনুমোদন করুন' : 'Approve Verification'}
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('rejected')
            setValue('status', 'rejected', { shouldValidate: true })
          }}
          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
            status === 'rejected'
              ? 'bg-red-500/10 border-red-500 text-red-400 font-semibold'
              : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-500'
          }`}
        >
          <XCircle className="h-6 w-6 mb-2" />
          {lang === 'bn' ? 'আবেদন প্রত্যাখ্যান করুন' : 'Reject Application'}
        </button>
      </div>

      <input type="hidden" {...register('status')} />

      {status === 'rejected' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{lang === 'bn' ? 'প্রত্যাখ্যানের কারণ' : 'Rejection Reason'}</label>
          <textarea
            {...register('rejection_reason')}
            rows={3}
            placeholder={lang === 'bn' ? 'যেমন: এনআইডি ছবিটি অস্পষ্ট, ঠিকানায় অমিল' : 'e.g. NID image blurry, address mismatch'}
            className="input-base resize-none"
          />
          {errors.rejection_reason && <p className="mt-1.5 text-xs text-red-400">{errors.rejection_reason.message}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{lang === 'bn' ? 'পর্যালোচনার নোট (ঐচ্ছিক)' : 'Review Notes (Optional)'}</label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder={lang === 'bn' ? 'অডিট লগের জন্য অভ্যন্তরীণ নোট' : 'Internal notes for audit log'}
          className="input-base resize-none"
        />
        {errors.notes && <p className="mt-1.5 text-xs text-red-400">{errors.notes.message}</p>}
      </div>

      <button type="submit" disabled={isLoading || !status} className="btn-primary w-full py-3">
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> {lang === 'bn' ? 'পর্যালোচনা জমা হচ্ছে...' : 'Submitting review...'}</>
        ) : (
          lang === 'bn' ? 'পর্যালোচনার সিদ্ধান্ত নিশ্চিত করুন' : 'Confirm Review Decision'
        )}
      </button>
    </form>
  )
}
