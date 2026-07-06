import Link from 'next/link'
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'
import { APP_NAME, ROUTES } from '@/constants'

const footerLinks = {
  company: [
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'Investment Plans', href: ROUTES.PLANS },
    { label: 'Farm Gallery', href: ROUTES.GALLERY },
    { label: 'Blog', href: ROUTES.BLOG },
    { label: 'Contact', href: ROUTES.CONTACT },
  ],
  legal: [
    { label: 'Privacy Policy', href: ROUTES.PRIVACY },
    { label: 'Terms & Conditions', href: ROUTES.TERMS },
  ],
  investors: [
    { label: 'Register', href: ROUTES.REGISTER },
    { label: 'Sign In', href: ROUTES.LOGIN },
    { label: 'My Dashboard', href: ROUTES.INVESTOR_DASHBOARD },
  ],
}

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/5">
      {/* CTA Banner */}
      <div className="border-b border-white/5">
        <div className="section-container py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900/40 to-emerald-900/30 border border-green-500/20 p-10 text-center">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.1),transparent_70%)]" />
            <div className="relative">
              <p className="badge-green mb-6 mx-auto w-fit">Join 500+ Investors</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Grow Your Wealth?
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">
                Start your agricultural investment journey today and earn consistent returns from Bangladesh&apos;s thriving farm economy.
              </p>
              <Link href={ROUTES.REGISTER} className="btn-primary text-base px-8 py-4">
                Get Started — It&apos;s Free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Bangladesh&apos;s most trusted agricultural investment platform. Secure, transparent, and profitable farming investments for everyone.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>info@nhkagroinvest.com</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-green-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Investors */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Investors</h3>
            <ul className="space-y-2.5">
              {footerLinks.investors.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-green-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-green-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: Facebook, label: 'Facebook' },
              { Icon: Twitter, label: 'Twitter' },
              { Icon: Linkedin, label: 'LinkedIn' },
              { Icon: Youtube, label: 'YouTube' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-500/10 transition-all"
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
