'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas'
import { forgotPasswordAction } from '@/actions/auth'
import { ROUTES } from '@/constants'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const result = await forgotPasswordAction(data)
      if (result.success) { setSent(true); toast.success(result.message) }
      else toast.error(result.error)
    } finally { setIsLoading(false) }
  }

  if (sent) {
    return (
      <div className="fade-in text-center">
        <div className="glass-card p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 mx-auto mb-5">
            <Mail className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Email Sent!</h2>
          <p className="text-slate-400 text-sm mb-6">Check your inbox for the password reset link.</p>
          <Link href={ROUTES.LOGIN} className="btn-secondary w-full justify-center">Back to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
        <p className="text-slate-400 text-sm">Enter your email and we&apos;ll send a reset link</p>
      </div>
      <div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input {...register('email')} type="email" placeholder="you@example.com" className="input-base" />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
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
