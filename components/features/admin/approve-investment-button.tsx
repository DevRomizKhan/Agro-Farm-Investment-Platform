'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'
import { approveInvestmentAction } from '@/actions/investments'

export function ApproveInvestmentButton({ investmentId }: { investmentId: string }) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      const result = await approveInvestmentAction(investmentId)
      if (result.success) {
        toast.success('Investment approved and activated')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to approve investment')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={isApproving}
      className="btn-primary w-full py-2 text-xs justify-center mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isApproving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
      {isApproving ? 'Approving...' : 'Approve & Activate'}
    </button>
  )
}
