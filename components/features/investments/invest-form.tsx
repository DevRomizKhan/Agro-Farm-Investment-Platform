'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Wallet, AlertCircle } from 'lucide-react'
import { investSchema, type InvestFormData } from '@/schemas'
import { createInvestmentAction } from '@/actions/investments'
import { formatCurrency } from '@/lib/utils'
import type { InvestmentPlan } from '@/types'

interface InvestFormProps {
  plans: InvestmentPlan[]
  planSharesSold?: Record<string, number>
}

export function InvestForm({ plans, planSharesSold = {} }: InvestFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<InvestFormData>({
    resolver: zodResolver(investSchema),
    defaultValues: {
      plan_id: '',
      shares: 0,
    },
  })

  const sharesWatch = useWatch({ control, name: 'shares' })

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = plans.find((p) => p.id === e.target.value) || null
    setSelectedPlan(plan)
    setValue('plan_id', e.target.value, { shouldValidate: true })
  }

  const onSubmit = async (data: InvestFormData) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('plan_id', data.plan_id)
      formData.append('shares', String(data.shares))

      const result = await createInvestmentAction(formData)
      if (result.success) {
        toast.success('Interest request submitted. The owner will review it before any payment is made.')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to submit investment')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate probable profit based on shares
  const calculateExpectedProfit = () => {
    if (!selectedPlan || !sharesWatch) return 0
    const shares = Number(sharesWatch)
    if (isNaN(shares) || shares <= 0) return 0
    const amount = shares * (selectedPlan.shares_per_amount || 10000)
    const monthlyRate = selectedPlan.roi_percentage / 100 / 12
    return amount * monthlyRate * selectedPlan.duration_months
  }

  // Calculate total investment amount from shares
  const calculateInvestmentAmount = () => {
    if (!selectedPlan || !sharesWatch) return 0
    const shares = Number(sharesWatch)
    if (isNaN(shares) || shares <= 0) return 0
    return shares * (selectedPlan.shares_per_amount || 10000)
  }

  // Calculate available shares for selected plan (excluding owner shares)
  const getAvailableShares = () => {
    if (!selectedPlan) return 0
    const totalShares = selectedPlan.total_shares || 150
    const ownerShares = Math.floor(totalShares * ((selectedPlan.owner_share_percentage || 40) / 100))
    const soldShares = planSharesSold[selectedPlan.id] || 0
    // Available = Total - Owner Reserved - Sold
    return Math.max(0, totalShares - ownerShares - soldShares)
  }

  const getShareRequestIssues = () => {
    if (!selectedPlan || !sharesWatch) return []
    const requestedShares = Number(sharesWatch)
    if (!Number.isFinite(requestedShares) || requestedShares <= 0) return []
    const issues: string[] = []
    const availableShares = getAvailableShares()
    const maximumShares = selectedPlan.max_shares_per_investor || 30
    if (requestedShares > availableShares) {
      issues.push(`You requested ${requestedShares} shares, but only ${availableShares} shares are currently available.`)
    }
    if (requestedShares > maximumShares) {
      issues.push(`This plan allows a maximum of ${maximumShares} shares per investor; your request is ${requestedShares} shares.`)
    }
    return issues
  }

  return (
    <div className="glass-card p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <Wallet className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-semibold text-white">New Investment</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Choose Plan */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Investment Plan</label>
          <select onChange={handlePlanChange} className="input-base" defaultValue="">
            <option value="" disabled>Choose an active plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} ({plan.roi_percentage}% / yr)
              </option>
            ))}
          </select>
          {errors.plan_id && <p className="mt-1.5 text-xs text-red-400">{errors.plan_id.message}</p>}
        </div>

        {selectedPlan && (() => {
          const total = selectedPlan.total_shares || 150
          return (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Price / Share</span>
                  <span className="text-white font-semibold">{formatCurrency(selectedPlan.shares_per_amount || 10000)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Annual ROI</span>
                  <span className="text-emerald-400 font-semibold">{selectedPlan.roi_percentage}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Max Shares / Investor</span>
                  <span className="text-white font-semibold">{selectedPlan.max_shares_per_investor || 30}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Duration</span>
                  <span className="text-white font-semibold">{selectedPlan.duration_months} months</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Exit Lock</span>
                  <span className="text-yellow-400 font-semibold">{selectedPlan.lock_period_days} days</span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Shares</span>
                  <span className="text-white font-medium">{total}</span>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Shares */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Number of Shares</label>
          <div className="relative">
            <input
              {...register('shares')}
              type="number"
              className="input-base"
              placeholder="e.g. 10"
              disabled={!selectedPlan}
              min="1"
              max={selectedPlan?.total_shares || undefined}
            />
          </div>
          {errors.shares && <p className="mt-1.5 text-xs text-red-400">{errors.shares.message}</p>}
          {selectedPlan && (
            <p className="mt-1.5 text-xs text-slate-500">
              Maximum {selectedPlan.max_shares_per_investor || 30} shares per investor. The owner will confirm final availability when reviewing your request.
            </p>
          )}
        </div>

        {getShareRequestIssues().length > 0 && (
          <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 p-4" role="alert">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
              <div>
                <p className="text-sm font-semibold text-orange-200">This share request cannot be submitted</p>
                <ul className="mt-2 space-y-1 text-xs leading-relaxed text-orange-100/80">
                  {getShareRequestIssues().map(issue => <li key={issue}>• {issue}</li>)}
                </ul>
                <p className="mt-2 text-xs text-orange-100/70">Reduce the requested shares and submit again, or choose another active plan.</p>
              </div>
            </div>
          </div>
        )}

        {/* Investment amount calculation */}
        {selectedPlan && sharesWatch && (
          <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-xs">Investment Amount</span>
              <span className="text-white font-bold">{formatCurrency(calculateInvestmentAmount())}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Probable Return Rate</span>
              <span className="text-green-400 font-semibold">{selectedPlan.roi_percentage}% / Year</span>
            </div>
          </div>
        )}

        {/* Probable profit calculation */}
        {selectedPlan && sharesWatch && (
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-sm flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-xs block">Probable Return at Maturity</span>
              <span className="text-green-400 font-bold text-lg">
                {formatCurrency(calculateExpectedProfit())}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs block">Total Capital + ROI</span>
              <span className="text-white font-semibold">
                {formatCurrency(calculateInvestmentAmount() + calculateExpectedProfit())}
              </span>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-200">
          No payment is required now. If the owner approves your request, bank-transfer details and receipt upload will become available in your investment history.
        </div>

        <button type="submit" disabled={isLoading || !selectedPlan || getShareRequestIssues().length > 0} className="btn-primary w-full py-3.5">
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...</>
          ) : (
            'Request Investment Approval'
          )}
        </button>
      </form>
    </div>
  )
}
