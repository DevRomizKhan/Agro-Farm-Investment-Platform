'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES, APP_NAME } from '@/constants'
import { logoutAction } from '@/actions/auth'
import {
  Leaf, LayoutDashboard, Users, FileText, TrendingUp,
  Bell, BarChart3, Settings, LogOut, ChevronRight,
  CreditCard, ShieldCheck, X, Menu, PenTool
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: 'Investors', href: ROUTES.ADMIN_INVESTORS, icon: Users },
  { label: 'KYC Management', href: ROUTES.ADMIN_KYC, icon: ShieldCheck },
  { label: 'Investment Plans', href: ROUTES.ADMIN_PLANS, icon: FileText },
  { label: 'Investments', href: ROUTES.ADMIN_INVESTMENTS, icon: TrendingUp },
  { label: 'Transactions', href: ROUTES.ADMIN_TRANSACTIONS, icon: CreditCard },
  { label: 'Blog', href: ROUTES.ADMIN_BLOG, icon: PenTool },
  { label: 'Reports', href: ROUTES.ADMIN_REPORTS, icon: BarChart3 },
  { label: 'Notifications', href: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
  { label: 'Settings', href: ROUTES.ADMIN_SETTINGS, icon: Settings },
]

interface AdminSidebarProps {
  userName: string
  userEmail: string
}

export function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white border border-white/10"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 lg:z-auto',
          'flex flex-col w-64 h-full bg-slate-900 border-r border-white/5',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
       <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white">{APP_NAME}</span>
              <p className="text-[10px] text-green-400 font-medium uppercase tracking-wider">Owner Portal</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== ROUTES.ADMIN_DASHBOARD && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn('nav-item', isActive && 'nav-item-active')}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5" />}
              </Link>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-400 text-xs font-bold flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-green-500">Owner</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/5">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
