'use client'

import { useActionState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import type { InvestmentResult } from '@/actions/investments'

type ApproveAction = (formData: FormData) => Promise<InvestmentResult>

export function ApproveInvestmentButton({
  investmentId,
  action,
}: {
  investmentId: string
  action: ApproveAction
}) {
  const [state, formAction, pending] = useActionState<InvestmentResult, FormData>(
    async (_previousState, formData) => action(formData),
    { success: false },
  )

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="id" value={investmentId} />
        <button
          type="submit"
          disabled={pending}
          className="btn-primary w-full py-2 text-xs justify-center mt-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Approving…
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> Approve &amp; Activate
            </>
          )}
        </button>
      </form>
      {state.error && !pending && (
        <p className="text-xs leading-relaxed text-red-400" role="alert">
          {state.error}
        </p>
      )}
    </div>
  )
}
