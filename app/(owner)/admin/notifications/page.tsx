import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Bell, Clock, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'

export default async function AdminNotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch all notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*, profile:profiles(full_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications Management</h1>
          <p className="page-subtitle">View all system notifications sent to users</p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
          <Bell className="h-5 w-5 text-green-400" />
          <h2 className="font-semibold text-white">All Notifications ({notifications?.length || 0})</h2>
        </div>

        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Notifications</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              No notifications have been sent yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification: any) => (
              <div
                key={notification.id}
                className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-green-500/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 flex-shrink-0">
                      <Bell className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{notification.profile?.full_name || 'Unknown User'}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatDate(notification.created_at)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 uppercase">{notification.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
