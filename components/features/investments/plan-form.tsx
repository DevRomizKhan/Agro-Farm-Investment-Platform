'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Plus, Edit3, CalendarClock, Info } from 'lucide-react'
import { investmentPlanSchema, type InvestmentPlanFormData } from '@/schemas'
import { manageInvestmentPlanAction } from '@/actions/investments'
import type { InvestmentPlan } from '@/types'

interface PlanFormProps {
  initialPlan?: InvestmentPlan | null
  onSuccess?: () => void
}

/** Convert a stored ISO string → "datetime-local" input value (YYYY-MM-DDTHH:mm) */
function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  // datetime-local expects exactly "YYYY-MM-DDTHH:mm"
  return iso.slice(0, 16)
}

/** Convert a "datetime-local" value → full ISO string (UTC) */
function fromDatetimeLocal(local: string): string | null {
  if (!local) return null
  return new Date(local).toISOString()
}

export function PlanForm({ initialPlan, onSuccess }: PlanFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvestmentPlanFormData>({
    resolver: zodResolver(investmentPlanSchema),
    defaultValues: initialPlan
      ? {
          name: initialPlan.name,
          description: initialPlan.description || '',
          min_amount: Number(initialPlan.min_amount),
          max_amount: Number(initialPlan.max_amount),
          roi_percentage: Number(initialPlan.roi_percentage),
          duration_months: initialPlan.duration_months,
          is_active: initialPlan.is_active,
          starts_at: toDatetimeLocal(initialPlan.starts_at) || undefined,
          ends_at: toDatetimeLocal(initialPlan.ends_at) || undefined,
        }
      : {
          name: '',
          description: '',
          min_amount: 10000,
          max_amount: 1000000,
          roi_percentage: 12,
          duration_months: 12,
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
          initialPlan ? 'Investment plan updated successfully' : 'New investment plan created'
        )
        if (onSuccess) onSuccess()
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to save plan')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Plan Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Plan Name</label>
        <input
          {...register('name')}
          type="text"
          className="input-base py-2.5 text-sm"
          placeholder="e.g. Rice Farm Starter"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
        <textarea
          {...register('description')}
          rows={2}
          className="input-base py-2.5 text-sm resize-none"
          placeholder="Short description of agricultural yields and farm location"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Min / Max Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Min Investment (৳)
          </label>
          <input {...register('min_amount')} type="number" className="input-base py-2.5 text-sm" />
          {errors.min_amount && (
            <p className="mt-1 text-xs text-red-400">{errors.min_amount.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Max Investment (৳)
          </label>
          <input {...register('max_amount')} type="number" className="input-base py-2.5 text-sm" />
          {errors.max_amount && (
            <p className="mt-1 text-xs text-red-400">{errors.max_amount.message}</p>
          )}
        </div>
      </div>

      {/* ROI / Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            ROI Percentage (%)
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
            Duration (Months)
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
          <CalendarClock className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-slate-300">Visibility Schedule</span>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-400">
            The plan is visible to investors only between the <strong className="text-slate-300">Start</strong> and{' '}
            <strong className="text-slate-300">End</strong> times. Leave both blank to make it
            permanently visible (while Active is checked).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Opens At <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              {...register('starts_at')}
              type="datetime-local"
              className="input-base py-2.5 text-sm"
            />
            {errors.starts_at ? (
              <p className="mt-1 text-xs text-red-400">{errors.starts_at.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">Plan becomes visible from this time</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Closes At <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              {...register('ends_at')}
              type="datetime-local"
              className="input-base py-2.5 text-sm"
            />
            {errors.ends_at ? (
              <p className="mt-1 text-xs text-red-400">{errors.ends_at.message}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">Plan disappears after this time</p>
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
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-green-500 cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm text-slate-300 cursor-pointer">
          Plan is Active{' '}
          <span className="text-slate-500 font-normal">
            (uncheck to force-hide even within schedule)
          </span>
        </label>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2">
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
        ) : initialPlan ? (
          <><Edit3 className="h-4 w-4" /> Save Plan Changes</>
        ) : (
          <><Plus className="h-4 w-4" /> Create Investment Plan</>
        )}
      </button>
    </form>
  )
}
