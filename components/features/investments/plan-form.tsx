'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Plus, Edit3, CalendarClock, Info } from 'lucide-react'
import { investmentPlanSchema, type InvestmentPlanFormData } from '@/schemas'
import { manageInvestmentPlanAction } from '@/actions/investments'
import type { InvestmentPlan } from '@/types'
import { useLanguage } from '@/lib/i18n/context'

interface PlanFormProps {
  initialPlan?: InvestmentPlan | null
  onSuccess?: () => void
}

/** Convert a stored ISO string → "datetime-local" input value (YYYY-MM-DDTHH:mm) */
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Convert a "datetime-local" value → full ISO string (UTC) */
function fromDatetimeLocal(local: string): string | null {
  if (!local) return null
  const d = new Date(local)
  if (isNaN(d.getTime())) return null
  return d.toISOString()
}

export function PlanForm({ initialPlan, onSuccess }: PlanFormProps) {
  const { lang } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvestmentPlanFormData>({
    resolver: zodResolver(investmentPlanSchema),
    defaultValues: initialPlan
      ? {
          name: initialPlan.name,
          description: initialPlan.description || '',
          total_shares: initialPlan.total_shares,
          shares_per_amount: initialPlan.shares_per_amount,
          owner_share_percentage: initialPlan.owner_share_percentage,
          max_shares_per_investor: initialPlan.max_shares_per_investor,
          roi_percentage: Number(initialPlan.roi_percentage),
          duration_months: initialPlan.duration_months,
          lock_period_days: initialPlan.lock_period_days || 366,
          is_active: initialPlan.is_active,
          starts_at: toDatetimeLocal(initialPlan.starts_at) || undefined,
          ends_at: toDatetimeLocal(initialPlan.ends_at) || undefined,
        }
      : {
          name: '',
          description: '',
          total_shares: 150,
          shares_per_amount: 10000,
          owner_share_percentage: 40,
          max_shares_per_investor: 30,
          roi_percentage: 12,
          duration_months: 12,
          lock_period_days: 366,
          is_active: true,
          starts_at: undefined,
          ends_at: undefined,
        },
  })

  const onSubmit = async (data: InvestmentPlanFormData) => {
    // Convert datetime-local strings back to ISO before sending
    const payload: InvestmentPlanFormData = {
      ...data,
      starts_at: data.starts_at ? fromDatetimeLocal(data.starts_at as string) : null,
      ends_at: data.ends_at ? fromDatetimeLocal(data.ends_at as string) : null,
    }

    setIsLoading(true)
    try {
      const result = await manageInvestmentPlanAction(payload, initialPlan?.id)
      if (result.success) {
        toast.success(
          initialPlan ? (lang === 'bn' ? 'বিনিয়োগ প্ল্যান সফলভাবে হালনাগাদ হয়েছে' : 'Investment plan updated successfully') : (lang === 'bn' ? 'নতুন বিনিয়োগ প্ল্যান তৈরি হয়েছে' : 'New investment plan created')
        )
        if (onSuccess) onSuccess()
        if (initialPlan) {
          router.push('/admin/plans')
          router.refresh()
        } else {
          reset()
          router.refresh()
        }
      } else {
        toast.error(result.error || (lang === 'bn' ? 'প্ল্যান সংরক্ষণ করা যায়নি' : 'Failed to save plan'))
      }
    } catch {
      toast.error(lang === 'bn' ? 'একটি অপ্রত্যাশিত সমস্যা হয়েছে' : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Plan Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">প্ল্যানের নাম</label>
        <input
          {...register('name')}
          type="text"
          className="input-base py-2.5 text-sm"
          placeholder={lang === 'bn' ? 'যেমন: ধান চাষ স্টার্টার' : 'e.g. Rice Farm Starter'}
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">বিবরণ</label>
        <textarea
          {...register('description')}
          rows={2}
          className="input-base py-2.5 text-sm resize-none"
          placeholder={lang === 'bn' ? 'কৃষি উৎপাদন ও খামারের অবস্থানের সংক্ষিপ্ত বিবরণ' : 'Short description of agricultural yields and farm location'}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Share Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            মোট শেয়ার
          </label>
          <input {...register('total_shares')} type="number" className="input-base py-2.5 text-sm" />
          {errors.total_shares && (
            <p className="mt-1 text-xs text-red-400">{errors.total_shares.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            প্রতি শেয়ারের মূল্য (৳)
          </label>
          <input {...register('shares_per_amount')} type="number" className="input-base py-2.5 text-sm" />
          {errors.shares_per_amount && (
            <p className="mt-1 text-xs text-red-400">{errors.shares_per_amount.message}</p>
          )}
        </div>
      </div>

      {/* Investor exit lock */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          লক সময়কাল (দিন)
        </label>
        <input {...register('lock_period_days')} type="number" min="1" max="3650" className="input-base py-2.5 text-sm" />
        {errors.lock_period_days ? (
          <p className="mt-1 text-xs text-red-400">{errors.lock_period_days.message}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">এই সময়ের পর বিনিয়োগকারীরা উত্তোলন বা শেয়ার হস্তান্তরের আবেদন করতে পারবেন।</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          এই মান পরিবর্তন করলে প্ল্যানের সব সক্রিয় ও অপেক্ষমাণ বিনিয়োগ হালনাগাদ হবে।
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            মালিকের শেয়ার (%)
          </label>
          <input {...register('owner_share_percentage')} type="number" step="0.1" className="input-base py-2.5 text-sm" />
          {errors.owner_share_percentage && (
            <p className="mt-1 text-xs text-red-400">{errors.owner_share_percentage.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            বিনিয়োগকারীপ্রতি সর্বোচ্চ শেয়ার
          </label>
          <input {...register('max_shares_per_investor')} type="number" className="input-base py-2.5 text-sm" />
          {errors.max_shares_per_investor && (
            <p className="mt-1 text-xs text-red-400">{errors.max_shares_per_investor.message}</p>
          )}
        </div>
      </div>

      {/* ROI / Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            লাভের হার (%)
          </label>
          <input
            {...register('roi_percentage')}
            type="number"
            step="0.1"
            className="input-base py-2.5 text-sm"
          />
          {errors.roi_percentage && (
            <p className="mt-1 text-xs text-red-400">{errors.roi_percentage.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            মেয়াদ (মাস)
          </label>
          <input
            {...register('duration_months')}
            type="number"
            className="input-base py-2.5 text-sm"
          />
          {errors.duration_months && (
            <p className="mt-1 text-xs text-red-400">{errors.duration_months.message}</p>
          )}
        </div>
      </div>

      {/* ─── Plan Visibility Schedule ────────────────────────────────── */}
      <div className="pt-3 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-slate-300">দৃশ্যমানতার সময়সূচি</span>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <Info className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-400">
            {lang === 'bn' ? <>প্ল্যানটি শুধু <strong className="text-slate-300">শুরুর</strong> এবং <strong className="text-slate-300">শেষের</strong> সময়ের মধ্যে বিনিয়োগকারীরা দেখতে পারবেন। সবসময় দৃশ্যমান রাখতে দুটি ঘরই খালি রাখুন (এবং সক্রিয় রাখুন)।</> : <>The plan is visible to investors only between the <strong className="text-slate-300">Start</strong> and <strong className="text-slate-300">End</strong> times. Leave both blank to make it permanently visible (while Active is checked).</>}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {lang === 'bn' ? 'শুরুর সময়' : 'Opens At'} <span className="text-slate-500 font-normal">({lang === 'bn' ? 'ঐচ্ছিক' : 'optional'})</span>
            </label>
            <input
              {...register('starts_at')}
              type="datetime-local"
              className="input-base py-2.5 text-sm"
            />
            {errors.starts_at ? (
              <p className="mt-1 text-xs text-red-400">{errors.starts_at.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">{lang === 'bn' ? 'এই সময় থেকে প্ল্যানটি দৃশ্যমান হবে' : 'Plan becomes visible from this time'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {lang === 'bn' ? 'শেষের সময়' : 'Closes At'} <span className="text-slate-500 font-normal">({lang === 'bn' ? 'ঐচ্ছিক' : 'optional'})</span>
            </label>
            <input
              {...register('ends_at')}
              type="datetime-local"
              className="input-base py-2.5 text-sm"
            />
            {errors.ends_at ? (
              <p className="mt-1 text-xs text-red-400">{errors.ends_at.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">{lang === 'bn' ? 'এই সময়ের পর প্ল্যানটি লুকানো থাকবে' : 'Plan disappears after this time'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Manual active toggle */}
      <div className="flex items-center gap-3 pt-1">
        <input
          {...register('is_active')}
          id="is_active"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-emerald-500 cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm text-slate-300 cursor-pointer">
          {lang === 'bn' ? 'প্ল্যানটি সক্রিয় ' : 'Plan is Active '}
          <span className="text-slate-500 font-normal">
            {lang === 'bn' ? '(সময়সূচির মধ্যে থাকলেও লুকাতে আনচেক করুন)' : '(uncheck to force-hide even within schedule)'}
          </span>
        </label>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2">
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> {lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</>
        ) : initialPlan ? (
          <><Edit3 className="h-4 w-4" /> {lang === 'bn' ? 'প্ল্যানের পরিবর্তন সংরক্ষণ করুন' : 'Save Plan Changes'}</>
        ) : (
          <><Plus className="h-4 w-4" /> {lang === 'bn' ? 'বিনিয়োগ প্ল্যান তৈরি করুন' : 'Create Investment Plan'}</>
        )}
      </button>
    </form>
  )
}
