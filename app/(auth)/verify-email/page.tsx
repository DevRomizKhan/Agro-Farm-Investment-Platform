import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const token = params.token as string | undefined
  const email = params.email as string | undefined
  const accessToken = params.access_token as string | undefined
  const refreshToken = params.refresh_token as string | undefined

  // Handle Supabase's hash-based verification (common in mobile email clients)
  if (accessToken && refreshToken) {
    const supabase = await createClient()
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (!error) {
      // Session set successfully, redirect to dashboard
      redirect(ROUTES.INVESTOR_DASHBOARD)
    }
  }

  // Handle token-based verification
  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6">
        <div className="glass-card p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Invalid Verification Link</h1>
          <p className="text-slate-400 mb-6 text-sm sm:text-base">
            The verification link is invalid or has expired. Please try logging in or request a new verification email.
          </p>
          <a href={ROUTES.LOGIN} className="btn-primary inline-flex w-full justify-center">
            Back to Login
          </a>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6">
        <div className="glass-card p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Verification Failed</h1>
          <p className="text-slate-400 mb-6 text-sm sm:text-base">{error.message}</p>
          <div className="space-y-3">
            <a href={ROUTES.LOGIN} className="btn-primary inline-flex w-full justify-center">
              Back to Login
            </a>
            <a href={`${ROUTES.REGISTER}?email=${encodeURIComponent(email)}`} className="btn-secondary inline-flex w-full justify-center">
              Register Again
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6">
      <div className="glass-card p-6 sm:p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Email Verified Successfully</h1>
        <p className="text-slate-400 mb-6 text-sm sm:text-base">
          Your email has been verified. You can now log in to your account.
        </p>
        <a href={ROUTES.LOGIN} className="btn-primary inline-flex w-full justify-center">
          Proceed to Login
        </a>
      </div>
    </div>
  )
}
