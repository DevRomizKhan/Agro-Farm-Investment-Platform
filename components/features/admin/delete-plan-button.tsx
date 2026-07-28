'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteInvestmentPlanAction } from '@/actions/investments'

const BLOCKED_MESSAGE =
  'Cannot delete a plan that has investments. Deactivate it instead to hide it from investors.'

export function DeletePlanButton({ planId, hasInvestments }: { planId: string; hasInvestments: boolean }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (hasInvestments) {
      toast.error(BLOCKED_MESSAGE)
      return
    }

    if (!confirm('Are you sure you want to delete this investment plan? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteInvestmentPlanAction(planId)
      if (result.success) {
        toast.success('Investment plan deleted')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete plan')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || hasInvestments}
      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={hasInvestments ? BLOCKED_MESSAGE : 'Delete plan'}
    >
      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
