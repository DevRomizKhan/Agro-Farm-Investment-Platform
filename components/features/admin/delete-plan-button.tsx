'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteInvestmentPlanAction } from '@/actions/investments'

export function DeletePlanButton({ planId, hasActiveInvestments }: { planId: string; hasActiveInvestments: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (hasActiveInvestments) {
      alert('Cannot delete plan with active investments. Please wait for investments to complete or expire.')
      return
    }

    if (!confirm('Are you sure you want to delete this investment plan? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteInvestmentPlanAction(planId)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error || 'Failed to delete plan')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || hasActiveInvestments}
      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={hasActiveInvestments ? 'Cannot delete plan with active investments' : 'Delete plan'}
    >
      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
