'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { markNotificationReadAction } from '@/actions/notifications'

export function InvestmentStatusNotice({
  notification,
}: {
  notification: { id: string; title: string; message: string; type: string } | null
}) {
  const router = useRouter()

  useEffect(() => {
    if (!notification) return

    const isApproved = /approved|activated/i.test(notification.title)
    const toastId = toast.custom((id) => (
      <div className="w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-emerald-500/25 bg-slate-900/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isApproved ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>
            {isApproved ? <CheckCircle2 className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Amanah Farm · Investment Update
            </p>
            <h3 className="mt-1 text-sm font-semibold text-white">{notification.title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-300">{notification.message}</p>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(id)
                router.push('/dashboard/investments')
              }}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
            >
              View investment details <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    ), { duration: 10000 })

    void markNotificationReadAction(notification.id)
    return () => {
      toast.dismiss(toastId)
    }
  }, [notification, router])

  return null
}
