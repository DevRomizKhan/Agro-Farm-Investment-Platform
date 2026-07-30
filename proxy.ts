import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication
const INVESTOR_ROUTES = ['/dashboard']
const OWNER_ROUTES = ['/admin']
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function clearAuthCookies(response: NextResponse, request: NextRequest) {
  // Supabase may split its auth session across several `sb-*` cookies.
  for (const { name } of request.cookies.getAll()) {
    if (name.startsWith('sb-')) {
      response.cookies.set(name, '', { path: '/', maxAge: 0 })
    }
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isInvestorRoute = INVESTOR_ROUTES.some((route) => pathname.startsWith(route))
  const isOwnerRoute = OWNER_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    clearAuthCookies(supabaseResponse, request)

    if (isInvestorRoute || isOwnerRoute) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirectTo', pathname)
      const redirectResponse = NextResponse.redirect(loginUrl)
      clearAuthCookies(redirectResponse, request)
      return redirectResponse
    }

    return supabaseResponse
  }

  if ((isInvestorRoute || isOwnerRoute) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    const redirectResponse = NextResponse.redirect(loginUrl)
    clearAuthCookies(redirectResponse, request)
    return redirectResponse
  }

  if (isAuthRoute && user) {
    const role = user.user_metadata?.role as string | undefined
    const redirectTo = role === 'owner' ? '/admin' : '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  if (isOwnerRoute && user) {
    const role = user.user_metadata?.role as string | undefined
    if (role !== 'owner') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
