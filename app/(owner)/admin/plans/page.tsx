import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlanForm } from '@/components/features/investments/plan-form'
import { formatCurrency } from '@/lib/utils'
import { FileText, Plus, ShieldCheck, HelpCircle, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import { deleteInvestmentPlanAction } from '@/actions/investments'
import type { InvestmentPlan } from '@/types'

export default async function AdminPlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch all plans
  const { data: plans } = await supabase
    .from('investment_plans')
    .select('id, name, description, min_amount, max_amount, roi_percentage, duration_months, is_active, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Investment Plans Management</h1>
          <p className="page-subtitle">Configure agricultural investment packages, ROI rates, and limits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Plans List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              Existing Investment Plans ({plans?.length || 0})
            </h2>

            {!plans || plans.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-12">No investment plans configured yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="p-5 rounded-xl border border-white/5 bg-slate-900/40 space-y-4 hover:border-green-500/20 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-white text-base">{plan.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{plan.duration_months} Months Duration</p>
                      </div>
                      <span className={plan.is_active ? 'badge-green' : 'badge-gray'}>
                        {plan.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>

                    {plan.description && (
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{plan.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-white/5">
                      <div>
                        <span className="text-slate-500 block">Min Amount</span>
                        <span className="text-white font-medium">{formatCurrency(Number(plan.min_amount))}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Max Amount</span>
                        <span className="text-white font-medium">{formatCurrency(Number(plan.max_amount))}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Annual ROI Rate</span>
                        <span className="text-green-400 font-bold text-sm">{plan.roi_percentage}% / Year</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      <Link
                        href={`${ROUTES.ADMIN_PLANS}/${plan.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800/50 text-white text-xs font-medium hover:bg-slate-700/50 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <form action={async () => {
                        'use server'
                        const result = await deleteInvestmentPlanAction(plan.id)
                        if (!result.success) {
                          // In a real app, you'd show an error toast
                          console.error(result.error)
                        }
                      }}>
                        <button
                          type="submit"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Creation Form */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
            <Plus className="h-5 w-5 text-green-400" />
            <h2 className="text-base font-semibold text-white">Create New Plan</h2>
          </div>
          <PlanForm />
        </div>
      </div>
    </div>
  )
}
