'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

export function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      title="Refresh share availability"
      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Refreshing…' : 'Refresh Availability'}
    </button>
  )
}
