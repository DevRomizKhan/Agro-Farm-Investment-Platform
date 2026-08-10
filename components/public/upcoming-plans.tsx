'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

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
  const { t } = useLanguage()

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

  if (time.complete) return <p className="text-center text-sm font-semibold text-emerald-400">{t.plans.openingNow}</p>

  const units = [
    { label: t.plans.timeUnits.days, value: time.days },
    { label: t.plans.timeUnits.hours, value: time.hours },
    { label: t.plans.timeUnits.minutes, value: time.minutes },
    { label: t.plans.timeUnits.seconds, value: time.seconds },
  ]

  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="Time remaining until plan opens">
      {units.map(({ label, value }) => (
        <div key={label} className="rounded-lg border border-amber-400/15 bg-slate-950/70 px-1.5 py-2 text-center">
          <p className="font-mono text-base font-black tabular-nums text-white sm:text-lg">{String(value).padStart(2, '0')}</p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        </div>
      ))}
    </div>
  )
}

export function UpcomingPlanCard({ plan }: { plan: UpcomingPlan }) {
  const { t, lang } = useLanguage()

  const opensAt = new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(plan.startsAt))

  return (
    <article className="relative flex flex-col rounded-3xl border border-amber-400/30 bg-slate-900/50 p-6 opacity-85 sm:p-8">
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <span className="rounded-full bg-amber-400 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-950">{t.plans.comingSoon}</span>
      </div>

      <div className="mb-5">
        <span className="block text-sm font-bold uppercase tracking-wider text-amber-300">{t.plans.upcomingPlan}</span>
        <h3 className="mb-3 mt-1 text-2xl font-bold text-white">{plan.name}</h3>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-5xl font-extrabold text-white">{plan.roiPercentage}%</span>
          <span className="text-sm font-medium text-slate-300">{t.plans.perYearRoi}</span>
        </div>
        <p className="mt-1.5 text-sm text-slate-400">{plan.durationMonths} {t.plans.months} · ৳{plan.sharePrice.toLocaleString()} {t.plans.perShareText}</p>
      </div>

      <div className="mb-5 rounded-xl border border-amber-400/10 bg-slate-950/80 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-200">
          <CalendarDays className="h-4 w-4" />
          {t.plans.opensAt} {opensAt}
        </div>
        <Countdown startsAt={plan.startsAt} />
      </div>

      <div className="mb-6 rounded-xl border border-white/5 bg-slate-950/80 p-4">
        <div className="grid grid-cols-2 gap-2.5 text-sm">
          <div>
            <p className="mb-0.5 text-slate-400">{t.plans.pricePerShare}</p>
            <p className="font-mono font-semibold text-white">{formatCurrency(plan.sharePrice)}</p>
          </div>
          <div>
            <p className="mb-0.5 text-slate-400">{t.plans.totalShares}</p>
            <p className="font-mono font-semibold text-white">{plan.totalShares}</p>
          </div>
          <div className="col-span-2">
            <p className="mb-0.5 text-slate-400">{t.plans.maxPerInvestor}</p>
            <p className="font-semibold text-white">{plan.maxSharesPerInvestor} ({formatCurrency(plan.maxSharesPerInvestor * plan.sharePrice)} {t.plans.maxLabel})</p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-slate-800 py-3.5 text-base font-semibold text-slate-400">
        <Clock className="h-4 w-4" />
        {t.plans.opensSoon}
      </div>
    </article>
  )
}