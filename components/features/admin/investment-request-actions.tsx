'use client'

import { useActionState } from 'react'
import { Loader2, ShieldCheck, XCircle } from 'lucide-react'
import type { InvestmentResult } from '@/actions/investments'

type Action = (formData: FormData) => Promise<InvestmentResult>

export function InvestmentRequestActions({ investmentId, approve, reject }: { investmentId: string; approve: Action; reject: Action }) {
  const [approveState, approveAction, approving] = useActionState<InvestmentResult, FormData>(async (_, data) => approve(data), { success: false })
  const [rejectState, rejectAction, rejecting] = useActionState<InvestmentResult, FormData>(async (_, data) => reject(data), { success: false })
  return <div className="space-y-2">
    <form action={approveAction}><input type="hidden" name="id" value={investmentId} /><button disabled={approving || rejecting} className="btn-primary mt-1 w-full justify-center py-2 text-xs">{approving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Approving…</> : <><ShieldCheck className="h-3.5 w-3.5" /> Approve Request</>}</button></form>
    <form action={rejectAction} className="space-y-2"><input type="hidden" name="id" value={investmentId} /><input name="notes" required placeholder="Reason for rejection" className="input-base w-full text-xs" /><button disabled={approving || rejecting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2 text-xs font-semibold text-red-300">{rejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} Reject Request</button></form>
    {(approveState.error || rejectState.error) && <p className="text-xs text-red-400">{approveState.error || rejectState.error}</p>}
  </div>
}
