import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'
import type { ContactSubmission } from '@/types'
import { SubmissionsManagement } from '@/components/features/admin/submissions-management'

export default async function AdminSubmissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('Could not load contact submissions:', error)

  return <SubmissionsManagement submissions={(data || []) as ContactSubmission[]} />
}
