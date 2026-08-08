'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRightLeft, Banknote, Send, Wallet } from 'lucide-react'
import { createWithdrawalRequestAction } from '@/actions/investments'

type ExitRequestFormProps = {
  investmentId: string
  principal: number
  profit: number
  shares: number
  lockPeriodDays: number
}

export function ExitRequestForm({ investmentId, principal, profit, shares, lockPeriodDays }: ExitRequestFormProps) {
  const router = useRouter()
  const [requestType, setRequestType] = useState<'profit_only' | 'full_amount' | 'share_transfer'>(profit > 0 ? 'profit_only' : 'full_amount')
  const [transferShares, setTransferShares] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const total = principal + profit
  const transferValue = Math.round((principal / Math.max(shares, 1)) * transferShares * 100) / 100

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (requestType === 'profit_only' && profit <= 0) {
      toast.error('There is no recorded profit available for withdrawal yet')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await createWithdrawalRequestAction(new FormData(event.currentTarget))
      if (!result.success) {
        toast.error(result.error || 'Unable to submit exit request')
        return
      }
      toast.success('Exit request submitted to the owner for review')
      router.refresh()
    } catch {
      toast.error('Unable to submit exit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-green-400" />
        <p className="text-sm font-semibold text-white">Request after {lockPeriodDays} days</p>
      </div>
      <p className="text-xs text-slate-400">Choose how you want to exit. The owner reviews every request and records the final settlement.</p>
      <input type="hidden" name="investment_id" value={investmentId} />
      <div className="grid grid-cols-3 gap-2">
        {[
          ['profit_only', 'Profit', Banknote],
          ['full_amount', 'Whole amount', Wallet],
          ['share_transfer', 'Transfer shares', ArrowRightLeft],
        ].map(([value, label, Icon]) => {
          const IconComponent = Icon as typeof Banknote
          return (
          <button key={value as string} type="button" disabled={value === 'profit_only' && profit <= 0} onClick={() => setRequestType(value as typeof requestType)}
              className={`rounded-lg border p-2 text-left text-xs transition-colors ${requestType === value ? 'border-green-400 bg-green-500/15 text-green-300' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
              <IconComponent className="mb-1 h-3.5 w-3.5" />{label as string}
            </button>
          )
        })}
      </div>
      <input type="hidden" name="withdrawal_type" value={requestType} />
      <input type="hidden" name="amount" value={requestType === 'full_amount' ? total : requestType === 'share_transfer' ? transferValue : Math.max(profit, 1)} />
      {requestType === 'profit_only' && <p className="text-xs text-slate-500">Available recorded profit: ৳{profit.toLocaleString()}</p>}
      {requestType === 'profit_only' && profit <= 0 && <p className="text-xs text-yellow-400">Profit withdrawal is unavailable until the owner records actual ROI.</p>}
      {requestType === 'full_amount' && <p className="text-xs text-slate-500">Settlement value: ৳{total.toLocaleString()}</p>}
      {requestType === 'share_transfer' && (
        <div className="space-y-2">
          <input name="transfer_recipient_email" type="email" required placeholder="Recipient investor email" className="input-base w-full" />
          <div className="grid grid-cols-2 gap-2">
            <input name="transfer_shares" type="number" min="1" max={shares} value={transferShares} onChange={(event) => setTransferShares(Math.min(shares, Math.max(1, Number(event.target.value) || 1)))} required className="input-base w-full" />
            <p className="flex items-center rounded-lg bg-slate-900/50 px-3 text-xs text-slate-400">Value ৳{transferValue.toLocaleString()}</p>
          </div>
        </div>
      )}
      <textarea name="request_reason" rows={2} placeholder="Optional note for the owner" className="input-base w-full resize-none" />
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"><Send className="h-3.5 w-3.5" />{isSubmitting ? 'Submitting...' : 'Submit request'}</button>
    </form>
  )
}
