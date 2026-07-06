import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Leaf } from 'lucide-react'
import { ROUTES, APP_NAME } from '@/constants'

export const metadata: Metadata = {
  title: { default: 'Sign In', template: '%s | NHK Agro Invest' },
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Auth Header */}
      <header className="border-b border-white/5 py-4">
        <div className="section-container flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">{APP_NAME}</span>
          </Link>
          <Link href={ROUTES.HOME} className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer note */}
      <div className="py-4 text-center text-xs text-slate-600 border-t border-white/5">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </div>
  )
}
