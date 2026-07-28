import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahnlwgrldwrbvkrxlhrv.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobmx3Z3JsZHdyYnZrcnhsaHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjUyOTMsImV4cCI6MjA5ODg0MTI5M30.Ss5DbU7QFmqe9v2XBam7NK7iN1d8vM_7i-Kzajt7FQM'

/**
 * Creates a Supabase client for use in browser/client components.
 * Uses the anon key — safe to expose.
 */
export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  )
}
