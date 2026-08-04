'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  Leaf,
  CheckCircle2,
} from 'lucide-react'
import { ROUTES } from '@/constants'

const slides = [
  {
    id: 1,
    image: '/images/carousel/slide1.jpg',
    badge: 'Halal & Shariah Compliant',
    badgeIcon: ShieldCheck,
    title: 'Invest in Agriculture. Harvest the Future.',
    subtitle: 'Earn 12% – 18% annual returns with 100% asset-backed cattle & livestock farming in Bangladesh.',
    primaryCta: { text: 'Start Investing Today', href: ROUTES.REGISTER },
    secondaryCta: { text: 'View Plans', href: '/#plans' },
  },
  {
    id: 2,
    image: '/images/carousel/slide2.jpg',
    badge: '100% Asset-Backed Security',
    badgeIcon: Award,
    title: 'Transparent Smart Farming & High ROI',
    subtitle: 'Secured by insured livestock, professional veterinary care, and real-time investor updates.',
    primaryCta: { text: 'Calculate Returns', href: '/#lead-gen' },
    secondaryCta: { text: 'About Amanah Farm', href: '/#about' },
  },
  {
    id: 3,
    image: '/images/carousel/slide3.jpg',
    badge: 'Trusted by 1,250+ Investors',
    badgeIcon: TrendingUp,
    title: 'Build Sustainable Passive Income',
    subtitle: 'Empower local Bangladesh agriculture while securing consistent, reliable dividend payouts for your family.',
    primaryCta: { text: 'Join Amanah Farm', href: ROUTES.REGISTER },
    secondaryCta: { text: 'Read Blog', href: ROUTES.BLOG },
  },
]

export function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [nextSlide, isPaused])

  const slide = slides[currentSlide]
  const BadgeIcon = slide.badgeIcon

  return (
    <section
      id="home"
      className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={idx === 0}
            className="object-cover object-center scale-105 transition-transform duration-10000"
          />
          {/* Subtle minimal dark gradient overlay */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        </div>
      ))}

      {/* Center Aligned Minimal Hero Content */}
      <div className="relative z-20 section-container text-center max-w-4xl mx-auto px-4 py-12">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold backdrop-blur-md mb-6 shadow-lg">
          <BadgeIcon className="h-4 w-4 text-emerald-400" />
          <span>{slide.badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-6">
          {slide.title.split(' ').map((word, i) =>
            ['Agriculture.', 'Future.', 'Farming', 'ROI', 'Income', 'Sustainable'].includes(word) ? (
              <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 inline-block mx-1">
                {word}
              </span>
            ) : (
              <span key={i} className="mx-1 inline-block text-white">
                {word}
              </span>
            )
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          {slide.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href={slide.primaryCta.href}
            className="btn-primary group w-full sm:w-auto"
          >
            <span>{slide.primaryCta.text}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={slide.secondaryCta.href}
            className="btn-secondary w-full sm:w-auto bg-slate-900/80 backdrop-blur-md"
          >
            <span>{slide.secondaryCta.text}</span>
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 border-t border-white/10 pt-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Shariah Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>100% Asset Insured</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>12–18% Annual Return</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span>25+ Farm Locations</span>
          </div>
        </div>

      </div>

      {/* Minimal Carousel Navigation & Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 section-container flex items-center justify-between pointer-events-none px-4">
        {/* Indicators */}
        <div className="flex items-center gap-2.5 pointer-events-auto mx-auto sm:mx-0">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="h-10 w-10 rounded-xl bg-slate-900/80 text-white border border-white/10 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="h-10 w-10 rounded-xl bg-slate-900/80 text-white border border-white/10 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
