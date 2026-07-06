import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User, Mail, Phone, Calendar, Edit } from 'lucide-react'
import { ROUTES } from '@/constants'
import Link from 'next/link'

export default async function InvestorProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>
        <Link href={`${ROUTES.INVESTOR_PROFILE}/edit`} className="btn-secondary flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Information */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-green-400" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400 flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Full Name</label>
                <p className="text-white">{profile?.full_name || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400 flex-shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Email Address</label>
                <p className="text-white">{profile?.email || user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400 flex-shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Phone Number</label>
                <p className="text-white">{profile?.phone || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 text-green-400 flex-shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Member Since</label>
                <p className="text-white">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">Account Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <span className="text-sm text-slate-300">Account Type</span>
              <span className="text-white font-medium capitalize">{profile?.role || 'investor'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <span className="text-sm text-slate-300">Email Verified</span>
              <span className="text-green-400 font-medium">Yes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
