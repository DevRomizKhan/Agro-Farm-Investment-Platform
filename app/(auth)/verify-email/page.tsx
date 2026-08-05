import { createClient } from '@/lib/supabase/server'
import VerifyEmailClient from './VerifyEmailClient'

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
  const hasError = params.error === 'auth-code-error'

  const supabase = await createClient()

  // 1. Check if user already has an active authenticated session (e.g. redirected from /auth/callback)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    return <VerifyEmailClient isVerified={true} initialEmail={user.email || ''} />
  }

  // 2. Handle Supabase hash-based / session tokens if provided
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (!error) {
      return <VerifyEmailClient isVerified={true} />
    }
  }

  // 3. Handle OTP token verification
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

  // 4. Default state (no token, or error param from code exchange)
  return (
    <VerifyEmailClient
      isVerified={false}
      errorMessage={hasError ? 'The verification link has expired or is invalid.' : null}
      initialEmail={email || ''}
    />
  )
}
