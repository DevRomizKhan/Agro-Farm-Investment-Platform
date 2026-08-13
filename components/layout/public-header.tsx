'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, APP_NAME } from '@/constants'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()

  const navLinks = [
    { label: t.header.home, href: ROUTES.HOME },
    { label: t.header.about, href: ROUTES.ABOUT },
    { label: t.header.plans, href: ROUTES.PLANS },
    { label: t.header.faq, href: '/#faq' },
    { label: t.header.blog, href: ROUTES.BLOG },
    { label: t.header.contact, href: ROUTES.CONTACT },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-slate-950/40 py-3'
          : 'bg-gradient-to-b from-slate-950/95 via-slate-950/55 to-transparent py-4'
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center group gap-3">
            <Image
              src="/logo.png"
              alt={APP_NAME}
              width={150}
              height={45}
              className="h-auto w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={cn(
            'hidden lg:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md transition-colors',
            'bg-slate-900/70 border-emerald-900/40'
          )}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
                  'text-slate-300 hover:text-white hover:bg-emerald-500/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons & Language Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={ROUTES.LOGIN}
              className="btn-primary rounded-xl shadow-lg shadow-emerald-500/20 group"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{t.header.login}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu & Lang Switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              className={cn(
                'p-2 rounded-xl border transition-all',
                'text-slate-300 hover:text-white bg-slate-900/90 border-emerald-900/40'
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className={cn(
          'lg:hidden backdrop-blur-2xl border-b shadow-2xl animate-in slide-in-from-top duration-300 transition-colors',
          'bg-slate-950/98 border-emerald-900/40'
        )}>
          <div className="section-container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'px-5 py-3 text-base font-medium rounded-xl transition-all flex items-center justify-between',
                  'text-slate-300 hover:text-white hover:bg-emerald-500/10'
                )}
                onClick={() => setIsOpen(false)}
              >
                <span>{link.label}</span>
                <span className={cn(
                  'text-xs font-mono transition-colors',
                  'text-emerald-400'
                )}>→</span>
              </Link>
            ))}
            <div className={cn(
              'flex flex-col gap-3 mt-4 pt-4 border-t',
              'border-emerald-900/40'
            )}>
              <Link
                href={ROUTES.REGISTER}
                className="btn-primary w-full"
                onClick={() => setIsOpen(false)}
              >
                <TrendingUp className="h-4 w-4" />
                <span>{t.header.register}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
