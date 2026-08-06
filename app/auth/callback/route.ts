import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const errorParam = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')

  // Explicit failure returned directly from Supabase (e.g. expired OTP link)
  if (errorParam || errorCode) {
    console.error('Supabase auth callback error:', errorParam, errorCode, errorDescription)
    const redirectUrl = new URL(next, origin)
    redirectUrl.searchParams.set('error', 'auth-code-error')
    if (errorDescription) {
      redirectUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(redirectUrl)
  }

  const supabase = await createClient()

  // 1. Handle PKCE code exchange
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data?.session) {
      await ensureProfileExists(supabase)
      return NextResponse.redirect(`${origin}${next}?verified=true`)
    }
    console.error('Callback PKCE code exchange error:', error)
  }

  // 2. Handle token_hash verification (SSR OTP flow)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    if (!error) {
      await ensureProfileExists(supabase)
      return NextResponse.redirect(`${origin}${next}?verified=true`)
    }
    console.error('Callback token_hash verification error:', error)
  }

  // 3. Check if user is already authenticated (e.g. email verified directly by Supabase)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await ensureProfileExists(supabase)
    return NextResponse.redirect(`${origin}${next}?verified=true`)
  }

  // 4. Fallback for email verification flow:
  // If redirecting from Supabase email verification (next is /verify-email) without explicit Supabase error,
  // Supabase has already verified the email address prior to redirecting to our callback route.
  const isVerifyEmailFlow = next.includes('verify-email') || type === 'signup' || type === 'email'
  if (isVerifyEmailFlow) {
    return NextResponse.redirect(`${origin}${next}?verified=true`)
  }

  // 5. Explicit failure case for flows requiring session (e.g., reset-password)
  const redirectUrl = new URL(next, origin)
  redirectUrl.searchParams.set('error', 'auth-code-error')
  return NextResponse.redirect(redirectUrl)
}

async function ensureProfileExists(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile) {
      await adminClient.from('profiles').insert({
        user_id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        phone: user.user_metadata?.phone || null,
        role: user.user_metadata?.role || 'investor',
      })
    }
  } catch (err) {
    console.error('Callback profile check error:', err)
  }
}
