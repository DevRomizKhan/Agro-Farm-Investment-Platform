'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { ROUTES } from '@/constants'
import { resendVerificationEmailAction } from '@/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface VerifyEmailClientProps {
  isVerified: boolean
  errorMessage?: string | null
  initialEmail?: string
}

export default function VerifyEmailClient({
  isVerified: initialVerified,
  errorMessage,
  initialEmail = '',
}: VerifyEmailClientProps) {
  const [isVerified, setIsVerified] = useState(initialVerified)
  const [email, setEmail] = useState(initialEmail)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    // 1. Check URL hash fragment (common in Supabase redirects)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=email')) {
        setIsVerified(true)
      }
    }

    // 2. Check active auth session on client
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsVerified(true)
        if (session.user.email) setEmail(session.user.email)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || session?.user?.email_confirmed_at) {
        setIsVerified(true)
        if (session?.user?.email) setEmail(session.user.email)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (isVerified) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center fade-in">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Email Verified Successfully!</h1>
          <p className="text-slate-300 mb-8 text-sm leading-relaxed">
            Your email address has been confirmed. You now have full access to your account and investment dashboard.
          </p>
          <div className="space-y-3">
            <Link
              href={ROUTES.INVESTOR_DASHBOARD}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 group"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="btn-secondary w-full inline-flex items-center justify-center"
            >
              Proceed to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)
    try {
      const result = await resendVerificationEmailAction(email)
      if (result.success) {
        setResendSuccess(true)
        toast.success(result.message || 'Verification email sent!')
      } else {
        toast.error(result.error || 'Failed to send verification email')
      }
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
          {errorMessage ? (
            <XCircle className="w-10 h-10 text-red-400" />
          ) : (
            <Mail className="w-10 h-10 text-amber-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          {errorMessage ? 'Verification Failed' : 'Check Your Email'}
        </h1>

        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          {errorMessage
            ? errorMessage
            : 'We sent a verification link to your email address. Please click the link in the email to activate your account.'}
        </p>

        {resendSuccess ? (
          <div className="glass-card p-4 bg-green-500/10 border-green-500/30 mb-6 text-left">
            <p className="text-sm font-medium text-green-300 mb-1">Verification Email Sent!</p>
            <p className="text-xs text-slate-300">
              Please check your inbox (and spam folder) for the verification link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleResend} className="space-y-4 mb-6 text-left">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Need a new verification link?
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-base text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isResending}
              className="btn-secondary w-full text-sm py-2.5 flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-800">
          <Link href={ROUTES.LOGIN} className="text-sm text-slate-400 hover:text-white transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
