'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { submitInvestmentPaymentAction } from '@/actions/investments'

export function PaymentReceiptForm({ investmentId }: { investmentId: string }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  async function submit() {
    if (!file) return toast.error('Please choose your bank transfer receipt')
    setLoading(true)
    const data = new FormData(); data.set('investment_id', investmentId); data.set('receipt', file)
    const result = await submitInvestmentPaymentAction(data)
    setLoading(false)
    if (!result.success) return toast.error(result.error || 'Could not submit receipt')
    toast.success('Payment receipt submitted for owner verification'); router.refresh()
  }
  return <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
    <p className="text-xs font-semibold text-emerald-200">After transferring through the bank</p>
    <p className="text-xs text-slate-300">Upload the bank slip or official transfer statement. Your investment becomes active only after owner verification.</p>
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-emerald-400/30 px-3 py-3 text-xs text-slate-300">
      <Upload className="h-4 w-4 text-emerald-300" /><span className="truncate">{file?.name || 'Choose receipt (image or PDF)'}</span>
      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={event => setFile(event.target.files?.[0] || null)} />
    </label>
    <button type="button" onClick={submit} disabled={loading} className="btn-primary w-full justify-center py-2 text-xs disabled:opacity-60">
      {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…</> : 'Submit Payment Receipt'}
    </button>
  </div>
}
