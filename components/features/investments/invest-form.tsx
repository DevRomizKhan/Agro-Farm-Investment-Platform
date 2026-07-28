'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Upload, Wallet } from 'lucide-react'
import { investSchema, type InvestFormData } from '@/schemas'
import { createInvestmentAction } from '@/actions/investments'
import { formatCurrency, calculateROI } from '@/lib/utils'
import { MAX_FILE_SIZE, ALLOWED_DOCUMENT_TYPES } from '@/constants'
import type { InvestmentPlan } from '@/types'

interface InvestFormProps {
  plans: InvestmentPlan[]
}

export function InvestForm({ plans }: InvestFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const { register, handleSubmit, setValue, setError, watch, reset, formState: { errors } } = useForm<InvestFormData>({
    resolver: zodResolver(investSchema),
    defaultValues: {
      plan_id: '',
      amount: 0,
    },
  })

  const amountWatch = watch('amount')
  const amountValue = Number(amountWatch)
  const hasAmount = Number.isFinite(amountValue) && amountValue > 0

  const clearReceipt = () => {
    setReceiptFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plan = plans.find((p) => p.id === e.target.value) || null
    setSelectedPlan(plan)
    setValue('plan_id', e.target.value, { shouldValidate: true })
    setValue('amount', 0)
    clearReceipt()
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
    if (!selectedPlan) {
      setError('plan_id', { message: 'Please select an investment plan' })
      return
    }

    const min = Number(selectedPlan.min_amount)
    const max = Number(selectedPlan.max_amount)
    if (data.amount < min || data.amount > max) {
      setError('amount', {
        message: `Amount must be between ${formatCurrency(min)} and ${formatCurrency(max)} for this plan`,
      })
      return
    }

    if (!receiptFile) return toast.error('Deposit receipt image or PDF is required')

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('plan_id', data.plan_id)
      formData.append('amount', String(data.amount))
      formData.append('receipt', receiptFile)

      const result = await createInvestmentAction(formData)
      if (result.success) {
        toast.success('Investment requested successfully! Awaiting review.')
        reset({ plan_id: '', amount: 0 })
        setSelectedPlan(null)
        clearReceipt()
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

  // Calculate expected profit based on inputs
  const expectedProfit =
    selectedPlan && hasAmount
      ? calculateROI(amountValue, Number(selectedPlan.roi_percentage), Number(selectedPlan.duration_months))
      : 0

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
          <select onChange={handlePlanChange} value={selectedPlan?.id ?? ''} className="input-base">
            <option value="" disabled>Choose an active plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} ({plan.roi_percentage}% / yr)
              </option>
            ))}
          </select>
          {errors.plan_id && <p className="mt-1.5 text-xs text-red-400">{errors.plan_id.message}</p>}
        </div>

        {selectedPlan && (
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-800/40 border border-white/5 text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Min Investment</span>
              <span className="text-white font-medium">{formatCurrency(Number(selectedPlan.min_amount))}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Max Investment</span>
              <span className="text-white font-medium">{formatCurrency(Number(selectedPlan.max_amount))}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Expected Return Rate</span>
              <span className="text-green-400 font-semibold">{selectedPlan.roi_percentage}% / Year</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Duration</span>
              <span className="text-white font-medium">{selectedPlan.duration_months} Months</span>
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Investment Amount (BDT)</label>
          <div className="relative">
            <input
              {...register('amount')}
              type="number"
              step={100}
              className="input-base pl-12"
              placeholder="e.g. 50000"
              disabled={!selectedPlan}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-lg">
              ৳
            </div>
          </div>
          {errors.amount && <p className="mt-1.5 text-xs text-red-400">{errors.amount.message}</p>}
        </div>

        {/* Expected profit calculation */}
        {selectedPlan && hasAmount && (
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-sm flex justify-between items-center">
            <div>
              <span className="text-slate-400 text-xs block">Expected Return at Maturity</span>
              <span className="text-green-400 font-bold text-lg">
                {formatCurrency(expectedProfit)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs block">Total Capital + ROI</span>
              <span className="text-white font-semibold">
                {formatCurrency(amountValue + expectedProfit)}
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
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_DOCUMENT_TYPES.join(',')}
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

        <button type="submit" disabled={isLoading || !selectedPlan || !receiptFile} className="btn-primary w-full py-3.5">
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
