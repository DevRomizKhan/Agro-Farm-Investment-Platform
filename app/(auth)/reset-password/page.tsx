'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Lock, CheckCircle } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas'
import { resetPasswordAction } from '@/actions/auth'
import { ROUTES } from '@/constants'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    try {
      const result = await resetPasswordAction({ ...data, code: code || undefined })
      if (result.success) {
        setIsSuccess(true)
        toast.success(result.message || 'Password reset successfully')
      } else {
        toast.error(result.error || 'Failed to reset password')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!code) {
    return (
      <div className="fade-in text-center">
        <div className="glass-card p-10">
          <h2 className="text-xl font-bold text-white mb-3">Invalid Reset Link</h2>
          <p className="text-slate-400 text-sm mb-6">The password reset link is invalid or has expired.</p>
          <Link href={ROUTES.FORGOT_PASSWORD} className="btn-secondary w-full justify-center">Request New Link</Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="fade-in text-center">
        <div className="glass-card p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30 mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Password Reset!</h2>
          <p className="text-slate-400 text-sm mb-6">Your password has been successfully reset.</p>
          <Link href={ROUTES.LOGIN} className="btn-primary w-full justify-center">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-slate-400 text-sm">Enter your new password below</p>
      </div>
      <div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="input-base"
            />
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <input
              {...register('confirm_password')}
              type="password"
              placeholder="••••••••"
              className="input-base"
            />
            {errors.confirm_password && <p className="mt-1.5 text-xs text-red-400">{errors.confirm_password.message}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</> : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Remember your password?{' '}
          <Link href={ROUTES.LOGIN} className="text-green-400 hover:text-green-300 font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
