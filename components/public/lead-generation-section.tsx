'use client'

import { useState } from 'react'
import {
  Send,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Calculator,
  Download,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export function LeadGenerationSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '50000',
    duration: '12',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Calculate estimated returns for preview
  const amountNum = parseFloat(formData.amount) || 50000
  const returnRate = 0.16 // 16% avg ROI
  const estimatedReturn = Math.round(amountNum * returnRate)
  const totalPayout = amountNum + estimatedReturn

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <section id="lead-gen" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Calculator className="h-3.5 w-3.5" />
              <span>Free Investor Consultation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Start Your Journey to <br />
              <span className="gradient-text">High-Yield Returns</span> Today
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Curious how agricultural investments can grow your wealth? Fill out the quick form to receive a customized investment breakdown and a complimentary PDF Investor Guide.
            </p>

            {/* Benefit Checkpoints */}
            <div className="space-y-4 pt-2">
              {[
                'Tailored cattle unit allocation based on your budget',
                'Detailed breakdown of Shariah profit sharing ratios',
                'Complimentary consultation with senior agro financial managers',
                'Instant access to farm audit & legal documentation',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            {/* Live Estimator Preview Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Return Estimator
                </span>
                <span className="text-xs text-emerald-400 font-mono">16% Projected ROI</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-slate-400">Selected Amount</p>
                  <p className="text-xl font-bold text-white font-mono">৳{amountNum.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Est. Total Return</p>
                  <p className="text-xl font-bold text-emerald-400 font-mono">৳{totalPayout.toLocaleString()}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-6">
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-emerald-500/30 shadow-2xl bg-slate-900/90 relative">
              
              {submitted ? (
                <div className="py-12 text-center space-y-6">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-emerald-400">{formData.name}</strong>! Our senior investment manager will contact you at <strong className="text-white">{formData.phone}</strong> within 2 business hours with your customized investment proposal.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-secondary text-xs px-6 py-2.5 rounded-xl"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">Get Custom Proposal</h3>
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                      <Sparkles className="h-3.5 w-3.5" /> Instant Response
                    </span>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1700-000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tanvir@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Investment Amount Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Investment Amount
                    </label>
                    <select
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                    >
                      <option value="25000">৳25,000 (Starter)</option>
                      <option value="50000">৳50,000 (Standard)</option>
                      <option value="100000">৳1,00,000 (Growth)</option>
                      <option value="500000">৳5,00,000 (Premium)</option>
                      <option value="1000000">৳10,00,000+ (Institutional)</option>
                    </select>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 text-base"
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Request Free Callback &amp; Proposal</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% Secure
                    </span>
                    <span className="flex items-center gap-1">
                      <PhoneCall className="h-3.5 w-3.5 text-emerald-400" /> Free Consultation
                    </span>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
