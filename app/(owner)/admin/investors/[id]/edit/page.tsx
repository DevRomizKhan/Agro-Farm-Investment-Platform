import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/constants'
import Link from 'next/link'

export default async function EditInvestorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch investor details
  const { data: investor } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!investor) {
    redirect(ROUTES.ADMIN_INVESTORS)
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <Link href={`${ROUTES.ADMIN_INVESTORS}/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Investor Details
        </Link>
        <div>
          <h1 className="page-title">Edit Investor</h1>
          <p className="page-subtitle">Update investor information</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass-card p-6 max-w-2xl mx-auto">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              defaultValue={investor.full_name || ''}
              className="input-base py-2.5 text-sm"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              defaultValue={investor.email || ''}
              className="input-base py-2.5 text-sm"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
            <input
              type="tel"
              defaultValue={investor.phone || ''}
              className="input-base py-2.5 text-sm"
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Save Changes
            </button>
            <Link
              href={`${ROUTES.ADMIN_INVESTORS}/${id}`}
              className="btn-secondary flex-1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
