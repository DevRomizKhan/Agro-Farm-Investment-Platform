'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES, APP_NAME } from '@/constants'

const navLinks = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'About Us', href: ROUTES.ABOUT },
  { label: 'Investment Plan', href: ROUTES.PLANS },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Blogs', href: ROUTES.BLOG },
  { label: 'Contact Us', href: ROUTES.CONTACT },
]

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-emerald-500/10 shadow-xl shadow-emerald-950/20 py-3'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent py-4'
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
              className="h-10 sm:h-11 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-full hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="btn-primary text-sm px-6 py-2.5 rounded-full shadow-lg shadow-emerald-600/20 flex items-center gap-2 group"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Start Investing</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900/80 rounded-xl border border-white/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-emerald-500/20 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="section-container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-5 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-all flex items-center justify-between"
                onClick={() => setIsOpen(false)}
              >
                <span>{link.label}</span>
                <span className="text-xs text-emerald-500 font-mono">→</span>
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
              <Link
                href={ROUTES.LOGIN}
                className="w-full text-center py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 rounded-xl border border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="btn-primary w-full text-center py-3 text-sm font-medium rounded-xl flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Start Investing Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
