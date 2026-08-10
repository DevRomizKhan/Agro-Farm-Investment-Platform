import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlanForm } from '@/components/features/investments/plan-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch the plan
  const { data: plan } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!plan) {
    redirect(ROUTES.ADMIN_PLANS)
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <Link href={ROUTES.ADMIN_PLANS} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" />
          প্ল্যানের তালিকায় ফিরে যান
        </Link>
        <div>
          <h1 className="page-title">বিনিয়োগ প্ল্যান সম্পাদনা</h1>
          <p className="page-subtitle">প্ল্যানের তথ্য ও কনফিগারেশন হালনাগাদ করুন</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass-card p-6 max-w-2xl mx-auto">
        <PlanForm initialPlan={plan} />
      </div>
    </div>
  )
}
