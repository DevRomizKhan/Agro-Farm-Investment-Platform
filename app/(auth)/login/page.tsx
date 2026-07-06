'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/schemas'
import { loginAction, resendVerificationEmailAction } from '@/actions/auth'
import { ROUTES } from '@/constants'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [emailForResend, setEmailForResend] = useState('')
  const [isResending, setIsResending] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await loginAction(data)
      if (result.success) {
        toast.success('Welcome back!')
        router.push(ROUTES.INVESTOR_DASHBOARD)
        router.refresh()
      } else {
        if (result.needsVerification) {
          setNeedsVerification(true)
          setEmailForResend(result.email || data.email)
          toast.error(result.error || 'Email not verified')
        } else {
          toast.error(result.error || 'Login failed')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      const result = await resendVerificationEmailAction(emailForResend)
      if (result.success) {
        toast.success(result.message || 'Verification email sent!')
      } else {
        toast.error(result.error || 'Failed to resend verification email')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 text-sm">Sign in to access your investment dashboard</p>
      </div>

      {needsVerification && (
        <div className="glass-card p-4 mb-6 bg-yellow-500/10 border-yellow-500/30">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-200 font-medium mb-2">Email Verification Required</p>
              <p className="text-xs text-yellow-300/80 mb-3">
                Please verify your email address before logging in. Check your inbox for the verification link.
              </p>
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="text-xs text-yellow-400 hover:text-yellow-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="input-base"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-base pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm text-green-400 hover:text-green-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing In...</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-green-400 hover:text-green-300 font-medium transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}
