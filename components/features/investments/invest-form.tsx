'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Upload, Wallet, AlertCircle } from 'lucide-react'
import { investSchema, type InvestFormData } from '@/schemas'
import { createInvestmentAction } from '@/actions/investments'
import { formatCurrency } from '@/lib/utils'
import { MAX_FILE_SIZE, ALLOWED_DOCUMENT_TYPES } from '@/constants'
import type { InvestmentPlan } from '@/types'

interface InvestFormProps {
  plans: InvestmentPlan[]
  planSharesSold?: Record<string, number>
}

export function InvestForm({ plans, planSharesSold = {} }: InvestFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<InvestFormData>({
    resolver: zodResolver(investSchema),
    defaultValues: {
      plan_id: '',
      shares: 0,
    },
  })

  const sharesWatch = watch('shares')

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = plans.find((p) => p.id === e.target.value) || null
    setSelectedPlan(plan)
    setValue('plan_id', e.target.value, { shouldValidate: true })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Please upload an image (JPEG, PNG, WebP) or PDF')
        e.target.value = ''
        return
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 5MB limit. Please upload a smaller file.')
        e.target.value = ''
        return
      }
      
      setReceiptFile(file)
    }
  }

  const onSubmit = async (data: InvestFormData) => {
    if (!receiptFile) return toast.error('Deposit receipt image or PDF is required')

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('plan_id', data.plan_id)
      formData.append('shares', String(data.shares))
      formData.append('receipt', receiptFile)

      const result = await createInvestmentAction(formData)
      if (result.success) {
        toast.success('Investment request submitted! Your application is under review.')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to submit investment')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate expected profit based on shares
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

  // Calculate owner shares for selected plan
  const getOwnerShares = () => {
    if (!selectedPlan) return 0
    const totalShares = selectedPlan.total_shares || 150
    return Math.floor(totalShares * ((selectedPlan.owner_share_percentage || 40) / 100))
  }

  // Calculate total investor shares for selected plan (total - owner reserved)
  const getInvestorShares = () => {
    if (!selectedPlan) return 0
    const totalShares = selectedPlan.total_shares || 150
    const ownerShares = getOwnerShares()
    return totalShares - ownerShares
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
          const ownerShares = getOwnerShares()
          const sold = planSharesSold[selectedPlan.id] || 0
          const available = getAvailableShares()
          const investorShares = getInvestorShares()
          const soldPercentage = investorShares > 0 ? Math.round((sold / investorShares) * 100) : 0
          const almostFull = available <= Math.ceil(investorShares * 0.2)
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
              </div>
              {/* Share allocation breakdown */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Shares</span>
                  <span className="text-white font-medium">{total}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Owner Shares (Reserved)</span>
                  <span className="text-purple-400 font-medium">{ownerShares}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Shares Sold</span>
                  <span className="text-green-400 font-medium">{sold}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Available Shares</span>
                  <span className="text-blue-400 font-medium">{available}</span>
                </div>
                {/* Live share availability */}
                <div className="pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-semibold ${almostFull ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {available} shares available for purchase
                    </span>
                    <span className="text-xs text-slate-500">{soldPercentage}% of investor shares sold</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${almostFull ? 'bg-orange-500' : 'bg-emerald-500'}`}
                      style={{ width: `${soldPercentage}%` }}
                    />
                  </div>
                  {almostFull && available > 0 && (
                    <p className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Limited availability — act fast
                    </p>
                  )}
                  {available === 0 && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Fully subscribed — no shares available
                    </p>
                  )}
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
              disabled={!selectedPlan || getAvailableShares() === 0}
              min="1"
              max={Math.min(selectedPlan?.max_shares_per_investor || 30, getAvailableShares())}
            />
          </div>
          {errors.shares && <p className="mt-1.5 text-xs text-red-400">{errors.shares.message}</p>}
          {selectedPlan && (
            <p className="mt-1.5 text-xs text-slate-500">
              Maximum {Math.min(selectedPlan.max_shares_per_investor || 30, getAvailableShares())} shares per investor ({getAvailableShares()} available)
            </p>
          )}
        </div>

        {/* Investment amount calculation */}
        {selectedPlan && sharesWatch && (
          <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-xs">Investment Amount</span>
              <span className="text-white font-bold">{formatCurrency(calculateInvestmentAmount())}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Expected Return Rate</span>
              <span className="text-green-400 font-semibold">{selectedPlan.roi_percentage}% / Year</span>
            </div>
          </div>
        )}

        {/* Expected profit calculation */}
        {selectedPlan && sharesWatch && (
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-sm flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-xs block">Expected Return at Maturity</span>
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

        {/* Receipt Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Bank Transfer / Deposit Receipt
          </label>
          <div className="relative border border-dashed border-slate-700 hover:border-green-500/50 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-800/20 transition-colors">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={!selectedPlan}
            />
            <Upload className="h-6 w-6 text-slate-400 mb-2" />
            <p className="text-xs text-slate-400">
              {receiptFile ? receiptFile.name : 'Upload bank statement, slip, or mobile transaction screenshot'}
            </p>
          </div>
        </div>

        <button type="submit" disabled={isLoading || !selectedPlan || getAvailableShares() === 0} className="btn-primary w-full py-3.5">
          {isLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...</>
          ) : getAvailableShares() === 0 ? (
            'Plan Fully Subscribed'
          ) : (
            'Request Investment Approval'
          )}
        </button>
      </form>
    </div>
  )
}
