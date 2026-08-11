'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Send, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import { APP_NAME, COMPANY_INFO, ROUTES } from '@/constants'
import { submitContactSubmission } from '@/actions/contact-submissions'
import { useLanguage } from '@/lib/i18n/context'

export function PublicFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const { t } = useLanguage()

  const links = {
    company: [
      { label: t.header.home, href: ROUTES.HOME },
      { label: t.header.about, href: ROUTES.ABOUT },
      { label: t.header.plans, href: ROUTES.PLANS },
      { label: t.header.blog, href: ROUTES.BLOG },
      { label: t.header.contact, href: ROUTES.CONTACT },
    ],
    investors: [
      { label: t.header.register, href: ROUTES.REGISTER },
      { label: t.header.login, href: ROUTES.LOGIN },
      { label: 'Privacy Policy', href: ROUTES.PRIVACY },
      { label: 'Terms & Conditions', href: ROUTES.TERMS },
    ],
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setNewsletterLoading(true)
    setNewsletterError('')
    const result = await submitContactSubmission({ type: 'newsletter', email, source: 'footer_newsletter' })
    setNewsletterLoading(false)
    if (result.success) { setSubscribed(true); setEmail('') }
    else setNewsletterError(result.error || 'Could not subscribe. Please try again.')
  }

  return (
    <footer className="bg-slate-950 border-t border-emerald-900/30">

      {/* ── CTA Banner ──────────────────────────────── */}
      <div className="border-b border-emerald-900/30 py-14">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-900/40 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)]" />
            <div className="relative z-10 max-w-xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="h-3.5 w-3.5" />
                {t.footer.bannerBadge}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {t.footer.bannerTitle}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t.footer.bannerSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href={ROUTES.REGISTER} className="btn-primary group w-full sm:w-auto">
                  {t.footer.createFreeAccount}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={ROUTES.CONTACT} className="btn-secondary w-full sm:w-auto">
                  {t.footer.contactUs}
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
              <Image src="/logo.png" alt={APP_NAME} width={150} height={44} className="h-auto w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t.footer.brandDescription}
            </p>
            <div className="space-y-2.5">
              {[
                { Icon: MapPin, text: COMPANY_INFO.farmLocations },
                { Icon: Phone, text: COMPANY_INFO.phone },
                { Icon: Mail, text: COMPANY_INFO.email },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-slate-400">
                  <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Company links (2 cols) */}
          <div className="md:col-span-2">
            <p className="text-xs font-black text-white uppercase tracking-widest mb-4">{t.footer.companyTitle}</p>
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
            <p className="text-xs font-black text-white uppercase tracking-widest mb-4">{t.footer.investorTitle}</p>
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
            <p className="text-xs font-black text-white uppercase tracking-widest mb-4">{t.footer.newsletterTitle}</p>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {t.footer.newsletterSubtitle}
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 transition-colors">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {t.footer.subscribedMessage}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  placeholder={t.footer.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  disabled={newsletterLoading}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
            {newsletterError && <p className="mt-2 text-xs text-red-400">{newsletterError}</p>}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} {APP_NAME}. {t.footer.copyright}</p>
            <p>Developed by Muslim Tech Lab</p>
          </div>
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
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-slate-700/60 hover:border-emerald-500/40 transition-all"
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
