import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ROUTES, APP_NAME } from '@/constants'

export const metadata: Metadata = {
  title: { default: 'Sign In', template: '%s | Amanah Farm' },
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Auth Header */}
      <header className="border-b border-white/5 py-4">
        <div className="section-container flex items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center group">
            <Image
              src="/logo.png"
              alt={APP_NAME}
              width={140}
              height={41}
              className="h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
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
