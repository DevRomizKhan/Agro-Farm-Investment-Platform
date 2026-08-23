'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas'
import { ROUTES } from '@/constants'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const supabase = useMemo(() => createClient(), [])
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=${ROUTES.RESET_PASSWORD}`,
      })
      if (error) toast.error(error.message)
      else { setSent(true); toast.success('পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে!') }
    } finally { setIsLoading(false) }
  }

  if (sent) {
    return (
      <div className="fade-in text-center">
        <div className="glass-card p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto mb-5">
            <Mail className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">ইমেইল পাঠানো হয়েছে!</h2>
          <p className="text-slate-400 text-sm mb-6">আপনার ইনবক্সে প্রেরিত লিংকে প্রবেশ করে নতুন পাসওয়ার্ড সেট করুন।</p>
          <Link href={ROUTES.LOGIN} className="btn-secondary w-full justify-center">{t.auth.backToLogin}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{t.auth.forgotPasswordTitle}</h2>
        <p className="text-slate-400 text-sm">{t.auth.forgotPasswordSubtitle}</p>
      </div>
      <div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.auth.email}</label>
            <input {...register('email')} type="email" placeholder={t.auth.emailPlaceholder} className="input-base" />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.auth.sendingLink}</> : t.auth.sendResetLink}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          {t.auth.alreadyHaveAccount}{' '}
          <Link href={ROUTES.LOGIN} className="text-emerald-400 hover:text-emerald-300 font-medium">{t.auth.signInBtn}</Link>
        </p>
      </div>
    </div>
  )
}
