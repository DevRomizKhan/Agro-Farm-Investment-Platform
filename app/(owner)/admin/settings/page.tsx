import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User, Bell, LogOut } from 'lucide-react'
import { ROUTES } from '@/constants'
import { logoutAction } from '@/actions/auth'
import { saveBankTransferSettingsAction } from '@/actions/investments'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role, full_name, email').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)
  const { data: bankSettings } = await supabase.from('bank_transfer_settings').select('*').eq('id', true).maybeSingle()

  const saveBankSettings = async (formData: FormData) => {
    'use server'
    await saveBankTransferSettingsAction(formData)
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card p-6">
          <h2 className="mb-2 font-semibold text-white">Investor Bank Transfer Details</h2>
          <p className="mb-4 text-xs text-slate-400">These details appear only after you approve an investor request. Investors must pay through bank transfer only.</p>
          <form action={saveBankSettings} className="grid gap-3 sm:grid-cols-2">
            <input name="account_name" defaultValue={bankSettings?.account_name || ''} required placeholder="Account holder name" className="input-base" />
            <input name="bank_name" defaultValue={bankSettings?.bank_name || ''} required placeholder="Bank name" className="input-base" />
            <input name="account_number" defaultValue={bankSettings?.account_number || ''} required placeholder="Account number" className="input-base" />
            <input name="branch_name" defaultValue={bankSettings?.branch_name || ''} placeholder="Branch" className="input-base" />
            <input name="routing_number" defaultValue={bankSettings?.routing_number || ''} placeholder="Routing number" className="input-base" />
            <textarea name="instructions" defaultValue={bankSettings?.instructions || ''} placeholder="Payment instructions" className="input-base sm:col-span-2" rows={3} />
            <button className="btn-primary justify-center sm:col-span-2">Save Bank Details</button>
          </form>
        </div>
        {/* Profile Information */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-green-400" />
            Profile Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Full Name</label>
              <p className="text-white">{profile.full_name || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Email</label>
              <p className="text-white">{profile.email || user.email}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Role</label>
              <p className="text-white capitalize">{profile.role}</p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-400" />
            Notifications
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Email notifications for new investments</span>
              <input type="checkbox" defaultChecked disabled className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-green-500 opacity-50" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-slate-300">Email notifications for KYC submissions</span>
              <input type="checkbox" defaultChecked disabled className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-green-500 opacity-50" />
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-3">Notification preferences will be available in a future update.</p>
        </div>


        {/* Logout */}
        <form action={logoutAction}>
          <button type="submit" className="w-full py-3 px-4 rounded-lg bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
