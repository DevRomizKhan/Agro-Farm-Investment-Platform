import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FileText, Download, Calendar } from 'lucide-react'
import { ROUTES } from '@/constants'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Documents</h1>
          <p className="page-subtitle">View and download your investment documents and agreements</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Documents Available</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Your investment documents will appear here once you have active investment contracts.
          </p>
        </div>
      </div>
    </div>
  )
}
