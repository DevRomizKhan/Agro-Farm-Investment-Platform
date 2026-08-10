'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteInvestorAction } from '@/actions/auth'
import { useLanguage } from '@/lib/i18n/context'

export function DeleteInvestorButton({ profileId, userId }: { profileId: string; userId: string }) {
  const { lang } = useLanguage()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(lang === 'bn'
      ? 'আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না এবং সংশ্লিষ্ট বিনিয়োগ ও কেওয়াইসি জমাসহ সব তথ্য মুছে যাবে।'
      : 'Are you sure you want to delete this investor? This action cannot be undone and will delete all associated data including investments and KYC submissions.')) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteInvestorAction(profileId, userId)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error || (lang === 'bn' ? 'বিনিয়োগকারী মুছে ফেলা যায়নি' : 'Failed to delete investor'))
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
      title={lang === 'bn' ? 'বিনিয়োগকারী মুছুন' : 'Delete Investor'}
    >
      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </button>
  )
}
