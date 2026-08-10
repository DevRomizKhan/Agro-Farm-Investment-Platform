import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'
import { logoutAction } from '@/actions/auth'
import { saveBankTransferSettingsAction } from '@/actions/investments'
import { AdminSettingsClient } from '@/components/features/dashboard/admin-settings-client'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profiles').select('role, full_name, email').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)
  const { data: bankSettings } = await supabase.from('bank_transfer_settings').select('*').eq('id', true).maybeSingle()

  const saveBankSettings = async (formData: FormData) => {
    'use server'
    await saveBankTransferSettingsAction(formData)
  }

  const handleLogout = async () => {
    'use server'
    await logoutAction()
  }

  return (
    <AdminSettingsClient
      profile={profile}
      userEmail={user.email || ''}
      bankSettings={bankSettings}
      saveBankSettings={saveBankSettings}
      handleLogout={handleLogout}
    />
  )
}
