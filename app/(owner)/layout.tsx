import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { ROUTES } from '@/constants'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <AdminSidebar
        userName={profile?.full_name || user.email || 'Owner'}
        userEmail={profile?.email || user.email || ''}
      />
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16">
        <div className="p-4 md:p-6 lg:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
