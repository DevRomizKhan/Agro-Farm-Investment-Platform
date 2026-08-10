'use client'

import { useEffect, useState } from 'react'
import { Bell, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'
import { redirect } from 'next/navigation'

export default function NotificationsPage() {
  const { lang } = useLanguage()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = ROUTES.LOGIN; return }
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setNotifications(data || [])
      setLoading(false)
    }
    fetchNotifications()
  }, [])

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'বিজ্ঞপ্তিসমূহ' : 'Notifications'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'আপনার বিনিয়োগ কার্যক্রমের সর্বশেষ আপডেট' : 'Stay updated with your investment activities'}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{lang === 'bn' ? 'কোনো বিজ্ঞপ্তি নেই' : 'No Notifications'}</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              {lang === 'bn' ? 'আপনি সর্বশেষ আপডেট পড়েছেন! নতুন বিজ্ঞপ্তি এলে এখানে দেখাবে।' : "You're all caught up! New notifications will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-emerald-500/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                    <Bell className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                    <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {formatDate(notification.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
