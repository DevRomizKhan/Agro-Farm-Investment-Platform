'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '@/schemas'
import { registerAction } from '@/actions/auth'
import { ROUTES } from '@/constants'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const result = await registerAction(data)
      if (result.success) {
        setDone(true)
        toast.success(result.message || 'Account created!')
      } else {
        toast.error(result.error || 'Registration failed')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (done) {
    return (
      <div className="fade-in text-center">
        <div className="glass-card p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30 mx-auto mb-5">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Check Your Email!</h2>
          <p className="text-slate-400 text-sm mb-6">
            We&apos;ve sent a verification link to your email address. Please verify your account to continue.
          </p>
          <Link href={ROUTES.LOGIN} className="btn-primary w-full justify-center">
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
        <p className="text-slate-400 text-sm">Join NHK Agro and start investing today</p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input {...register('full_name')} type="text" placeholder="Your full name" className="input-base" />
            {errors.full_name && <p className="mt-1.5 text-xs text-red-400">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input {...register('email')} type="email" placeholder="you@example.com" className="input-base" />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <input {...register('phone')} type="tel" placeholder="01XXXXXXXXX" className="input-base" />
            {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" className="input-base pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <input {...register('confirm_password')} type="password" placeholder="Repeat password" className="input-base" />
            {errors.confirm_password && <p className="mt-1.5 text-xs text-red-400">{errors.confirm_password.message}</p>}
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input {...register('accept_terms')} id="terms" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 accent-green-500 cursor-pointer" />
            <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer">
              I agree to the{' '}
              <Link href={ROUTES.TERMS} className="text-green-400 hover:underline">Terms & Conditions</Link>
              {' '}and{' '}
              <Link href={ROUTES.PRIVACY} className="text-green-400 hover:underline">Privacy Policy</Link>
            </label>
          </div>
          {errors.accept_terms && <p className="text-xs text-red-400">{errors.accept_terms.message}</p>}

          <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating Account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-green-400 hover:text-green-300 font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
