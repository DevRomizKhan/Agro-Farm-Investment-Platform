'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export interface UpcomingPlan {
  id: string
  name: string
  totalShares: number
  sharePrice: number
  maxSharesPerInvestor: number
  roiPercentage: number
  durationMonths: number
  startsAt: string
}

function getTimeRemaining(startsAt: string) {
  const remaining = Math.max(0, new Date(startsAt).getTime() - Date.now())

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
    complete: remaining === 0,
  }
}

function Countdown({ startsAt }: { startsAt: string }) {
  const router = useRouter()
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, complete: false })

  useEffect(() => {
    const updateTime = () => {
      const nextTime = getTimeRemaining(startsAt)
      setTime(nextTime)
      if (nextTime.complete) router.refresh()
    }

    updateTime()
    const interval = window.setInterval(updateTime, 1_000)
    return () => window.clearInterval(interval)
  }, [router, startsAt])

  if (time.complete) return <p className="text-center text-sm font-semibold text-emerald-400">Opening now…</p>

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="Time remaining until plan opens">
      {units.map(({ label, value }) => (
        <div key={label} className="rounded-lg border border-amber-400/15 bg-slate-950/70 px-1.5 py-2 text-center">
          <p className="font-mono text-base font-black tabular-nums text-white sm:text-lg">{String(value).padStart(2, '0')}</p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  )
}

export function UpcomingPlanCard({ plan }: { plan: UpcomingPlan }) {
  const opensAt = new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(plan.startsAt))

  return (
    <article className="relative flex flex-col rounded-3xl border border-amber-400/30 bg-slate-900/50 p-6 opacity-85 sm:p-8">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-950">Coming Soon</span>
      </div>

      <div className="mb-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">Upcoming plan</span>
        <h3 className="mb-3 mt-1 text-xl font-bold text-white">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-4xl font-extrabold text-white">{plan.roiPercentage}%</span>
          <span className="text-xs font-medium text-slate-400">/ year ROI</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">{plan.durationMonths} months · ৳{plan.sharePrice.toLocaleString()} per share</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-400/10 bg-slate-950/80 p-3.5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-amber-200">
          <CalendarDays className="h-4 w-4" />
          Opens {opensAt}
        </div>
        <Countdown startsAt={plan.startsAt} />
      </div>

      <div className="mb-6 rounded-xl border border-white/5 bg-slate-950/80 p-3.5">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="mb-0.5 text-slate-400">Price / Share</p>
            <p className="font-mono font-semibold text-white">{formatCurrency(plan.sharePrice)}</p>
          </div>
          <div>
            <p className="mb-0.5 text-slate-400">Total Shares</p>
            <p className="font-mono font-semibold text-white">{plan.totalShares}</p>
          </div>
          <div className="col-span-2">
            <p className="mb-0.5 text-slate-400">Max Per Investor</p>
            <p className="font-semibold text-white">{plan.maxSharesPerInvestor} shares ({formatCurrency(plan.maxSharesPerInvestor * plan.sharePrice)} max)</p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-semibold text-slate-400">
        <Clock className="h-4 w-4" />
        Opens Soon
      </div>
    </article>
  )
}