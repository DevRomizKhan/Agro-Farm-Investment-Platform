'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteInvestmentPlanAction } from '@/actions/investments'
import { useLanguage } from '@/lib/i18n/context'

export function DeletePlanButton({ planId, hasActiveInvestments }: { planId: string; hasActiveInvestments: boolean }) {
  const { lang } = useLanguage()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (hasActiveInvestments) {
      alert(lang === 'bn' ? 'সক্রিয় বিনিয়োগ থাকা প্ল্যান মুছে ফেলা যাবে না। বিনিয়োগ সম্পন্ন বা মেয়াদ শেষ হওয়া পর্যন্ত অপেক্ষা করুন।' : 'Cannot delete plan with active investments. Please wait for investments to complete or expire.')
      return
    }

    if (!confirm(lang === 'bn' ? 'আপনি কি এই বিনিয়োগ প্ল্যানটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।' : 'Are you sure you want to delete this investment plan? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteInvestmentPlanAction(planId)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error || (lang === 'bn' ? 'প্ল্যান মুছে ফেলা যায়নি' : 'Failed to delete plan'))
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
      title={hasActiveInvestments ? (lang === 'bn' ? 'সক্রিয় বিনিয়োগ থাকা প্ল্যান মুছে ফেলা যাবে না' : 'Cannot delete plan with active investments') : (lang === 'bn' ? 'প্ল্যান মুছুন' : 'Delete plan')}
    >
      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {isDeleting ? (lang === 'bn' ? 'মোছা হচ্ছে...' : 'Deleting...') : (lang === 'bn' ? 'মুছুন' : 'Delete')}
    </button>
  )
}
