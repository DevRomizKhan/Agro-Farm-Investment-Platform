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
  const accessToken = params.access_token as string | undefined
  const refreshToken = params.refresh_token as string | undefined
  const hasError = params.error === 'auth-code-error'

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

  // 3. Supabase hash / token session
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (!error) {
      return <VerifyEmailClient isVerified={true} />
    }
  }

  // 4. OTP verification
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

  // 5. Default view
  return (
    <VerifyEmailClient
      isVerified={false}
      errorMessage={hasError ? 'The verification link has expired or is invalid.' : null}
      initialEmail={email || ''}
    />
  )
}
