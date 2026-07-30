'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Send, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import { APP_NAME, COMPANY_INFO, ROUTES } from '@/constants'

const links = {
  company: [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'Investment Plans', href: ROUTES.PLANS },
    { label: 'Blog', href: ROUTES.BLOG },
    { label: 'Gallery', href: ROUTES.GALLERY },
    { label: 'Contact Us', href: ROUTES.CONTACT },
  ],
  investors: [
    { label: 'Register', href: ROUTES.REGISTER },
    { label: 'Investor Login', href: ROUTES.LOGIN },
    { label: 'Dashboard', href: ROUTES.INVESTOR_DASHBOARD },
    { label: 'KYC Verification', href: ROUTES.INVESTOR_KYC },
    { label: 'Privacy Policy', href: ROUTES.PRIVACY },
    { label: 'Terms & Conditions', href: ROUTES.TERMS },
  ],
}

export function PublicFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="bg-slate-950 border-t border-emerald-500/10">

      {/* ── CTA Banner ──────────────────────────────── */}
      <div className="border-b border-white/5 py-14">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)]" />
            <div className="relative z-10 max-w-xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="h-3.5 w-3.5" />
                Start Growing Wealth
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Join 500+ Smart Investors
              </h2>
              <p className="text-slate-300 text-sm">
                Earn 10–18% annual returns with 100% asset-backed cattle farming.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href={ROUTES.REGISTER} className="btn-primary px-7 py-3 rounded-xl text-sm font-bold flex items-center gap-2 group w-full sm:w-auto justify-center">
                  Create Free Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={ROUTES.CONTACT} className="px-7 py-3 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all w-full sm:w-auto text-center">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Body ─────────────────────────────── */}
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand (4 cols) */}
          <div className="md:col-span-4 space-y-5">
            <Link href={ROUTES.HOME}>
              <Image src="/logo.png" alt={APP_NAME} width={150} height={44} className="h-11 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Bangladesh&apos;s premier Shariah-compliant agricultural investment platform — secure, transparent, and profitable.
            </p>
            <div className="space-y-2.5">
              {[
                { Icon: MapPin, text: COMPANY_INFO.farmLocations },
                { Icon: Phone, text: COMPANY_INFO.phone },
                { Icon: Mail, text: COMPANY_INFO.email },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-slate-300">
                  <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Company links (2 cols) */}
          <div className="md:col-span-2">
            <p className="text-xs font-black text-white uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {links.company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Investor links (2 cols) */}
          <div className="md:col-span-2">
            <p className="text-xs font-black text-white uppercase tracking-widest mb-4">Investors</p>
            <ul className="space-y-2.5">
              {links.investors.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (4 cols) */}
          <div className="md:col-span-4">
            <p className="text-xs font-black text-white uppercase tracking-widest mb-4">Newsletter</p>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Get monthly farm updates and investor return reports.
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-2 top-2 bottom-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors flex items-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            {[
              { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
