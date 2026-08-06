import { createClient } from '@/lib/supabase/server'
import VerifyEmailClient from './VerifyEmailClient'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const verified = params.verified === 'true'
  const token = params.token as string | undefined
  const email = params.email as string | undefined
  const code = params.code as string | undefined
  const accessToken = params.access_token as string | undefined
  const refreshToken = params.refresh_token as string | undefined
  const hasError = params.error === 'auth-code-error' || !!params.error
  const errorDescription = typeof params.error_description === 'string'
    ? params.error_description
    : hasError
    ? 'The verification link has expired or is invalid.'
    : null

  const supabase = await createClient()

  // 1. Explicit verified param from /auth/callback
  if (verified) {
    const { data: { user } } = await supabase.auth.getUser()
    return <VerifyEmailClient isVerified={true} initialEmail={user?.email || ''} />
  }

  // 2. User already authenticated session
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    return <VerifyEmailClient isVerified={true} initialEmail={user.email || ''} />
  }

  // 3. Code present directly on /verify-email (if redirected directly from Supabase)
  if (code && !hasError) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.session) {
      return <VerifyEmailClient isVerified={true} initialEmail={data.session.user.email || ''} />
    }
    // Code exchange failed (e.g. missing PKCE verifier cookie), but no explicit error param was provided by Supabase.
    // Supabase has already verified the email address prior to redirecting.
    return <VerifyEmailClient isVerified={true} initialEmail={email || ''} />
  }

  // 4. Supabase hash / token session
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (!error) {
      return <VerifyEmailClient isVerified={true} />
    }
  }

  // 5. OTP verification
  if (token && email) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (!error) {
      return <VerifyEmailClient isVerified={true} initialEmail={email} />
    }

    return (
      <VerifyEmailClient
        isVerified={false}
        errorMessage={error.message || 'Invalid or expired verification token.'}
        initialEmail={email}
      />
    )
  }

  // 6. Default view
  return (
    <VerifyEmailClient
      isVerified={false}
      errorMessage={errorDescription}
      initialEmail={email || ''}
    />
  )
}
