import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      const targetOrigin = isLocalEnv
        ? origin
        : forwardedHost
          ? `https://${forwardedHost}`
          : origin

      return NextResponse.redirect(`${targetOrigin}${next}`)
    }
  }

  const nextPath = searchParams.get('next') || '/'
  const redirectUrl = new URL(nextPath, origin)
  redirectUrl.searchParams.set('error', 'auth-code-error')
  return NextResponse.redirect(redirectUrl)
}
