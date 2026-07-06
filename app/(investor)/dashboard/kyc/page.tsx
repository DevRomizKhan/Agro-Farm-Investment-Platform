import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KYCForm } from '@/components/features/kyc/kyc-form'
import { FileText, ShieldAlert, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { formatDate } from '@/lib/utils'

export default async function KYCPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Fetch current KYC submission
  const { data: kyc } = await supabase
    .from('kyc_submissions')
    .select('*, documents:kyc_documents(*)')
    .eq('user_id', user.id)
    .maybeSingle()

  const status = kyc?.status || 'not_submitted'

  return (
    <div className="fade-in space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">KYC Identity Verification</h1>
          <p className="page-subtitle">Verify your identity to enable account investing and payouts</p>
        </div>
      </div>

      {/* Conditional Status Display */}
      {status === 'approved' && (
        <div className="glass-card p-8 text-center space-y-4 border-green-500/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mx-auto">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Verification Complete!</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Your identity has been successfully verified. You now have full access to our investment plans.
          </p>
          <div className="pt-4">
            <Link href={ROUTES.INVESTOR_INVESTMENTS} className="btn-primary">Browse Investment Plans</Link>
          </div>
        </div>
      )}

      {status === 'pending' && kyc && (
        <div className="glass-card p-8 text-center space-y-4 border-yellow-500/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 mx-auto">
            <Clock className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white">Under Review</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Your verification documents have been submitted and are under review by our compliance team. This typically takes up to 24 hours.
          </p>
          {kyc.submitted_at && (
            <p className="text-xs text-slate-500">Submitted on {formatDate(kyc.submitted_at)}</p>
          )}
          <div className="pt-4">
            <Link href={ROUTES.INVESTOR_DASHBOARD} className="btn-secondary">Back to Dashboard</Link>
          </div>
        </div>
      )}

      {status === 'rejected' && kyc && (
        <div className="space-y-6">
          <div className="glass-card p-6 border-red-500/20 flex gap-4 items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">KYC Application Rejected</h2>
              <p className="text-sm text-slate-400 mt-1">
                Your application was rejected. Please review the reason below and submit a new application with the correct documents.
              </p>
              {kyc.rejection_reason && (
                <div className="mt-4 p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-sm text-red-400">
                  <span className="font-semibold">Reason:</span> {kyc.rejection_reason}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-6">
            <h3 className="text-lg font-semibold text-white mb-6">Resubmit KYC Verification</h3>
            <KYCForm />
          </div>
        </div>
      )}

      {status === 'not_submitted' && (
        <KYCForm />
      )}
    </div>
  )
}
