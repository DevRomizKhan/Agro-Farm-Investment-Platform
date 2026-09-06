'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Refreshes server-rendered plan data while a visitor is viewing a plan-aware
 * screen. The database remains the single source of truth; this only removes
 * the need for a manual browser refresh after an owner edits a plan.
 */
export function PlanRealtimeRefresh() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('investment-plans-live-refresh')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'investment_plans' },
        () => router.refresh(),
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [router])

  return null
}
