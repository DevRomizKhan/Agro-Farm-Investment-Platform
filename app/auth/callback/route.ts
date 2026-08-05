import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Ensure user profile exists in database
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
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
