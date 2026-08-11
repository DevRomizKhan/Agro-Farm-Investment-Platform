'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES, APP_NAME } from '@/constants'
import { logoutAction } from '@/actions/auth'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import {
  LayoutDashboard, FileText, TrendingUp, Bell,
  FolderOpen, Settings, User, LogOut, ChevronRight, X, Menu
} from 'lucide-react'

interface InvestorSidebarProps {
  userName: string
  userEmail: string
}

export function InvestorSidebar({ userName, userEmail }: InvestorSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { label: t.investorNav.dashboard, href: ROUTES.INVESTOR_DASHBOARD, icon: LayoutDashboard },
    { label: t.investorNav.myInvestments, href: ROUTES.INVESTOR_INVESTMENTS, icon: TrendingUp },
    { label: t.investorNav.kycVerification, href: ROUTES.INVESTOR_KYC, icon: FileText },
    { label: t.investorNav.documents, href: ROUTES.INVESTOR_DOCUMENTS, icon: FolderOpen },
    { label: t.investorNav.notifications, href: ROUTES.INVESTOR_NOTIFICATIONS, icon: Bell },
    { label: t.investorNav.profile, href: ROUTES.INVESTOR_PROFILE, icon: User },
    { label: t.investorNav.settings, href: ROUTES.INVESTOR_SETTINGS, icon: Settings },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg border transition-colors bg-slate-900 text-white border-emerald-900/40"
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
          'flex flex-col w-64 h-full border-r transition-colors',
          'bg-slate-950 border-emerald-900/30',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo & Language Switcher */}
        <div className="flex items-center justify-between p-4 border-b gap-2 border-emerald-900/30">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt={APP_NAME}
              width={110}
              height={32}
              className="h-auto w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher className="scale-90" />
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-lg transition-colors hover:bg-emerald-500/10 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
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
                <span className="flex-1 text-sm font-medium">{label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5" />}
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t space-y-2 border-emerald-900/30">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 bg-emerald-500/20 text-emerald-400">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{userName}</p>
              <p className="text-xs truncate text-slate-400">{userEmail}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              <span>{t.investorNav.signOut}</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
