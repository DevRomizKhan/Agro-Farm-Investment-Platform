'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES, APP_NAME } from '@/constants'
import { logoutAction } from '@/actions/auth'
import {
  Leaf, LayoutDashboard, FileText, TrendingUp, Bell,
  FolderOpen, Settings, User, LogOut, ChevronRight, X, Menu
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: ROUTES.INVESTOR_DASHBOARD, icon: LayoutDashboard },
  { label: 'My Investments', href: ROUTES.INVESTOR_INVESTMENTS, icon: TrendingUp },
  { label: 'KYC Verification', href: ROUTES.INVESTOR_KYC, icon: FileText },
  { label: 'Documents', href: ROUTES.INVESTOR_DOCUMENTS, icon: FolderOpen },
  { label: 'Notifications', href: ROUTES.INVESTOR_NOTIFICATIONS, icon: Bell },
  { label: 'Profile', href: ROUTES.INVESTOR_PROFILE, icon: User },
  { label: 'Settings', href: ROUTES.INVESTOR_SETTINGS, icon: Settings },
]

interface InvestorSidebarProps {
  userName: string
  userEmail: string
}

export function InvestorSidebar({ userName, userEmail }: InvestorSidebarProps) {
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
            <span className="text-base font-bold text-white">{APP_NAME}</span>
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
            const isActive = pathname === href
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

        {/* User Info & Logout */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-400 text-xs font-bold flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
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
