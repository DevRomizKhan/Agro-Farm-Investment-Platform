'use client'

import { useActionState } from 'react'
import { Loader2, BadgeCheck, XCircle } from 'lucide-react'
import type { InvestmentResult } from '@/actions/investments'

export function ConfirmInvestmentPaymentButton({ investmentId, action, reject }: { investmentId: string; action: (formData: FormData) => Promise<InvestmentResult>; reject: (formData: FormData) => Promise<InvestmentResult> }) {
  const [state, formAction, pending] = useActionState<InvestmentResult, FormData>(async (_, data) => action(data), { success: false })
  const [rejectState, rejectAction, rejecting] = useActionState<InvestmentResult, FormData>(async (_, data) => reject(data), { success: false })
  return <div className="space-y-2"><form action={formAction} className="space-y-2"><input type="hidden" name="id" value={investmentId} /><input name="notes" placeholder="Optional verification note" className="input-base w-full text-xs" /><button disabled={pending || rejecting} className="btn-primary w-full justify-center py-2 text-xs">{pending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying…</> : <><BadgeCheck className="h-3.5 w-3.5" /> Verify Payment &amp; Activate</>}</button></form><form action={rejectAction} className="space-y-2"><input type="hidden" name="id" value={investmentId} /><input name="notes" required placeholder="Reason for rejecting payment" className="input-base w-full text-xs" /><button disabled={pending || rejecting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2 text-xs font-semibold text-red-300">{rejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} Reject Payment</button></form>{(state.error || rejectState.error) && <p className="mt-2 text-xs text-red-400">{state.error || rejectState.error}</p>}</div>
}
