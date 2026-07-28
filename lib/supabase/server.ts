import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahnlwgrldwrbvkrxlhrv.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobmx3Z3JsZHdyYnZrcnhsaHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjUyOTMsImV4cCI6MjA5ODg0MTI5M30.Ss5DbU7QFmqe9v2XBam7NK7iN1d8vM_7i-Kzajt7FQM'

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Reads cookies from the Next.js cookie store.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll called from Server Component — middleware handles refresh
          }
        },
      },
    },
  )
}
