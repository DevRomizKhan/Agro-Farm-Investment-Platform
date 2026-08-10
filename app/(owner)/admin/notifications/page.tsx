'use client'

import { Bell, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ROUTES } from '@/constants'

export default function AdminNotificationsPage() {
  const { lang } = useLanguage()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = ROUTES.LOGIN; return }
      const { data } = await supabase
        .from('notifications')
        .select('*, profile:profiles(full_name, email)')
        .order('created_at', { ascending: false })
      setNotifications(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'বিজ্ঞপ্তি ব্যবস্থাপনা' : 'Notifications Management'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'ব্যবহারকারীদের পাঠানো সকল সিস্টেম বিজ্ঞপ্তি দেখুন' : 'View all system notifications sent to users'}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
          <Bell className="h-5 w-5 text-emerald-400" />
          <h2 className="font-semibold text-white">{lang === 'bn' ? `সকল বিজ্ঞপ্তি (${notifications.length})` : `All Notifications (${notifications.length})`}</h2>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{lang === 'bn' ? 'কোনো বিজ্ঞপ্তি নেই' : 'No Notifications'}</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">{lang === 'bn' ? 'এখনও কোনো বিজ্ঞপ্তি পাঠানো হয়নি।' : 'No notifications have been sent yet.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-emerald-500/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                      <Bell className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{notification.profile?.full_name || (lang === 'bn' ? 'অজানা ব্যবহারকারী' : 'Unknown User')}</span>
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
