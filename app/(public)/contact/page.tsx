'use client'

import { useState } from 'react'
import { COMPANY_INFO } from '@/constants'
import { Mail, Phone, MapPin, Clock, Globe, Send, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 800)
  }

  const contacts = [
    { icon: MapPin, label: 'Farm Locations', value: COMPANY_INFO.farmLocations },
    { icon: Phone, label: 'Phone / WhatsApp', value: COMPANY_INFO.phone },
    { icon: Mail, label: 'Email', value: COMPANY_INFO.email },
    { icon: Globe, label: 'Website', value: COMPANY_INFO.website },
    { icon: Clock, label: 'Office Hours', value: 'Sat–Thu  9:00 AM – 7:00 PM' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Page Hero ─────────────────────────────────── */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
        <div className="max-w-2xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Mail className="h-3.5 w-3.5" />
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Contact <span className="gradient-text">Amanah Farm</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Have questions about plans, payouts, or farm visits? Our team responds within 2 business hours.
          </p>
        </div>
      </section>

      {/* ── Main Grid ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT — Contact Info */}
          <div className="lg:col-span-5 space-y-4">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-6 rounded-2xl bg-slate-900/60 border border-white/8 hover:border-emerald-500/20 transition-colors"
              >
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed">{value}</p>
                </div>
              </div>
            ))}

            {/* Professional map embed */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-emerald-500/20 bg-slate-900">
              <iframe
                title="Amanah Farm location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=89.1650%2C25.1000%2C89.2650%2C25.1700&layer=mapnik&marker=25.1364%2C89.21548"
                className="w-full h-full border-0 grayscale-[0.15] contrast-[1.05]"
                loading="lazy"
              />
              <a
                href="https://www.openstreetmap.org/?mlat=25.1364&mlon=89.21548#map=15/25.1364/89.21548"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-950/90 px-3 py-2 text-[11px] font-semibold text-white backdrop-blur-md border border-white/10"
              >
                Open full map <ExternalLink className="h-3 w-3 text-emerald-400" />
              </a>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-emerald-500/20 shadow-2xl">
              {done ? (
                <div className="py-14 text-center space-y-5">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Received!</h3>
                  <p className="text-slate-300 text-sm max-w-sm mx-auto">
                    Thank you, <strong className="text-emerald-400">{form.name}</strong>. Our team will reach you at{' '}
                    <strong className="text-white">{form.phone || form.email}</strong> within 2 business hours.
                  </p>
                  <button
                    onClick={() => setDone(false)}
                    className="btn-secondary text-xs px-6 py-2.5 rounded-xl"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handle} className="space-y-5">
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-white">Send a Message</h2>
                    <p className="text-xs text-slate-400 mt-1">We will respond within 2 business hours.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="Tanvir Ahmed"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone / WhatsApp *</label>
                      <input
                        required
                        type="tel"
                        placeholder="01954 745991"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="tanvir@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your investment goals or any questions..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Your information is 100% confidential.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
