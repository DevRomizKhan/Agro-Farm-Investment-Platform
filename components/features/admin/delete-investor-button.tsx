'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteInvestorAction } from '@/actions/auth'

export function DeleteInvestorButton({ profileId, userId }: { profileId: string; userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this investor? This action cannot be undone and will delete all associated data including investments and KYC submissions.')) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteInvestorAction(profileId, userId)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error || 'Failed to delete investor')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete Investor"
    >
      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </button>
  )
}
