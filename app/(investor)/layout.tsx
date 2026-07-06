import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvestorSidebar } from '@/components/layout/investor-sidebar'
import { ROUTES } from '@/constants'
import type { ReactNode } from 'react'

export default async function InvestorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profile?.role === 'owner') redirect(ROUTES.ADMIN_DASHBOARD)

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <InvestorSidebar
        userName={profile?.full_name || user.email || 'Investor'}
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
