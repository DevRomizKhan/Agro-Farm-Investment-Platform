import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication
const INVESTOR_ROUTES = ['/dashboard']
const OWNER_ROUTES = ['/admin']
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahnlwgrldwrbvkrxlhrv.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobmx3Z3JsZHdyYnZrcnhsaHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjUyOTMsImV4cCI6MjA5ODg0MTI5M30.Ss5DbU7QFmqe9v2XBam7NK7iN1d8vM_7i-Kzajt7FQM'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isInvestorRoute = INVESTOR_ROUTES.some((route) => pathname.startsWith(route))
  const isOwnerRoute = OWNER_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Public pages do not need a Supabase session lookup. Avoiding this network
  // round-trip keeps the landing page fast while protected/auth pages still
  // receive the full session and role checks below.
  if (!isInvestorRoute && !isOwnerRoute && !isAuthRoute) {
    return NextResponse.next()
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
  } = await supabase.auth.getUser()

  if ((isInvestorRoute || isOwnerRoute) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
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
