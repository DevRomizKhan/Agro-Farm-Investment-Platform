'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, TrendingUp, Leaf, Play } from 'lucide-react'
import { ROUTES } from '@/constants'
import { useState } from 'react'

export function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* ── Background Video ───────────────────────────── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/carousel/slide1.jpg')" }}
      >
        {!videoError && (
          <video
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/carousel/slide1.jpg"
            aria-hidden="true"
            onCanPlay={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
          >
            <source
              src="https://videos.pexels.com/video-files/4129740/4129740-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
        )}
        {/* Dark overlay so text remains legible */}
        <div className="absolute inset-0 bg-slate-950/70" />
        {/* Gradient fade bottom */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 to-transparent" />
        {/* Gradient fade top */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/80 to-transparent" />
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── Content ───────────────────────────────────── */}
      <div className="relative z-10 section-container text-center px-4 py-32 flex flex-col items-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold backdrop-blur-md mb-8 shadow-lg">
          <Leaf className="h-4 w-4" />
          <span>Halal · Asset-Backed · Shariah Compliant</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 max-w-4xl">
          Invest in Agriculture.{' '}
          <span className="gradient-text">Harvest</span> the Future.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Earn <strong className="text-emerald-400">12–18% annual returns</strong> from insured livestock farming across Bangladesh — transparent, ethical, and managed by certified experts.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href={ROUTES.REGISTER}
            className="btn-primary text-base px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-2xl shadow-emerald-600/25 group"
          >
            <span>Start Investing Today</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={ROUTES.PLANS}
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all"
          >
            <Play className="h-4 w-4 text-emerald-400" />
            <span>View Investment Plans</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t border-white/10 pt-10">
          {[
            { icon: ShieldCheck, text: 'Shariah Certified' },
            { icon: TrendingUp, text: '12–18% Annual ROI' },
            { icon: Leaf, text: '25+ Farm Locations' },
            { icon: ShieldCheck, text: '100% Asset Insured' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
              <Icon className="h-4 w-4 text-emerald-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
