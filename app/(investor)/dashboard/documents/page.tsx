'use client'

import { FileText } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export default function DocumentsPage() {
  const { lang } = useLanguage()

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'আমার দলিলপত্র' : 'My Documents'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'আপনার বিনিয়োগ চুক্তি ও গুরুত্বপূর্ণ নথিপত্র দেখুন ও ডাউনলোড করুন' : 'View and download your investment documents and agreements'}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{lang === 'bn' ? 'কোনো দলিলপত্র পাওয়া যায়নি' : 'No Documents Available'}</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {lang === 'bn' ? 'আপনার সক্রিয় বিনিয়োগ চুক্তি সম্পন্ন হলে সংশ্লিষ্ট দলিলপত্র এখানে প্রদর্শিত হবে।' : 'Your investment documents will appear here once you have active investment contracts.'}
          </p>
        </div>
      </div>
    </div>
  )
}
