'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '@/schemas'
import { registerAction } from '@/actions/auth'
import { ROUTES } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'

export default function RegisterPage() {
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [emailConfirmationDisabled, setEmailConfirmationDisabled] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const password = useWatch({ control, name: 'password' })
  const confirmPassword = useWatch({ control, name: 'confirm_password' })

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, feedback: '' }

    let score = 0
    const feedback = []

    if (password.length >= 8) score += 1
    else feedback.push('8+ অক্ষর')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('বড় হাতের অক্ষর')

    if (/[a-z]/.test(password)) score += 1
    else feedback.push('ছোট হাতের অক্ষর')

    if (/[0-9]/.test(password)) score += 1
    else feedback.push('সংখ্যা')

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push('বিশেষ চিহ্ন')

    const strengthLabels = ['দুর্বল', 'সাধারণ', 'ভালো', 'শক্তিশালী', 'অত্যন্ত শক্তিশালী']
    return {
      score,
      feedback: feedback.length > 0 ? `যোগ করুন: ${feedback.join(', ')}` : strengthLabels[score - 1] || '',
    }
  }, [password])

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const result = await registerAction(data)
      if (result.success) {
        setEmailConfirmationDisabled(result.needsVerification === false)
        setDone(true)
        toast.success(result.message || 'অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে!')
      } else {
        toast.error(result.error || 'অ্যাকাউন্ট খুলতে ব্যর্থ হয়েছে')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (done) {
    return (
      <div className="fade-in text-center">
        <div className="glass-card p-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {emailConfirmationDisabled ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'আপনার ইমেইল বার্তাটি পরীক্ষা করুন!'}
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {emailConfirmationDisabled
              ? 'আপনার অ্যাকাউন্ট প্রস্তুত। আপনি এখন প্রবেশ করে বিনিয়োগ শুরু করতে পারেন।'
              : 'আমরা আপনার ইমেইলে একটি যাচাইকরণ লিংক পাঠিয়েছি। অনুগ্রহ করে আপনার অ্যাকাউন্টটি সক্রিয় করুন।'}
          </p>
          <Link href={ROUTES.LOGIN} className="btn-primary w-full justify-center group">
            {t.auth.signInBtn}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">{t.auth.createAccountTitle}</h1>
        <p className="text-slate-400 text-base">{t.auth.createAccountSubtitle}</p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.auth.fullName}</label>
            <input
              {...register('full_name')}
              type="text"
              placeholder={t.auth.fullNamePlaceholder}
              className={`input-base transition-colors ${errors.full_name ? 'border-red-500/50 focus:border-red-500' : ''}`}
            />
            {errors.full_name && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <Circle className="h-3 w-3 fill-red-500" />
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.auth.email}</label>
            <input
              {...register('email')}
              type="email"
              placeholder={t.auth.emailPlaceholder}
              autoComplete="email"
              className={`input-base transition-colors ${errors.email ? 'border-red-500/50 focus:border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <Circle className="h-3 w-3 fill-red-500" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.auth.phone}</label>
            <input
              {...register('phone')}
              type="tel"
              placeholder={t.auth.phonePlaceholder}
              autoComplete="tel"
              className={`input-base transition-colors ${errors.phone ? 'border-red-500/50 focus:border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <Circle className="h-3 w-3 fill-red-500" />
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.auth.password}</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t.auth.passwordPlaceholder}
                autoComplete="new-password"
                className={`input-base pr-12 transition-colors ${errors.password ? 'border-red-500/50 focus:border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= passwordStrength.score
                          ? passwordStrength.score <= 2
                            ? 'bg-red-500'
                            : passwordStrength.score <= 3
                              ? 'bg-yellow-500'
                              : 'bg-emerald-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400">{passwordStrength.feedback}</p>
              </div>
            )}
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <Circle className="h-3 w-3 fill-red-500" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t.auth.confirmPassword}</label>
            <div className="relative">
              <input
                {...register('confirm_password')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t.auth.confirmPasswordPlaceholder}
                autoComplete="new-password"
                className={`input-base pr-12 transition-colors ${
                  errors.confirm_password ? 'border-red-500/50 focus:border-red-500' : ''
                } ${
                  confirmPassword && !errors.confirm_password && password === confirmPassword
                    ? 'border-emerald-500/50 focus:border-emerald-500'
                    : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && password === confirmPassword && !errors.confirm_password && (
              <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 fill-emerald-500" />
                {t.auth.passwordsMatch}
              </p>
            )}
            {errors.confirm_password && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <Circle className="h-3 w-3 fill-red-500" />
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              {...register('accept_terms')}
              id="terms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 accent-emerald-500 cursor-pointer transition-colors"
            />
            <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer leading-relaxed">
              {t.auth.acceptTerms}{' '}
              <Link href={ROUTES.TERMS} className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                {t.auth.termsLink}
              </Link>
              {' '}এবং{' '}
              <Link href={ROUTES.PRIVACY} className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                {t.auth.privacyLink}
              </Link>
            </label>
          </div>
          {errors.accept_terms && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <Circle className="h-3 w-3 fill-red-500" />
              {errors.accept_terms.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-4 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.auth.creatingAccount}
              </>
            ) : (
              <>
                {t.auth.createAccountBtn}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          {t.auth.alreadyHaveAccount}{' '}
          <Link href={ROUTES.LOGIN} className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors">
            {t.auth.signInBtn}
          </Link>
        </p>
      </div>
    </div>
  )
}
