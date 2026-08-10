'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Camera } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { ROUTES } from '@/constants'

export default function GalleryPage() {
  const { t } = useLanguage()

  const galleryImages = [
    '/images/carousel/slide1.jpg',
    '/images/carousel/slide2.jpg',
    '/images/carousel/slide3.jpg',
    '/images/carousel/slide1.jpg',
    '/images/carousel/slide2.jpg',
    '/images/carousel/slide3.jpg',
  ]

  return (
    <div className="py-16 bg-slate-950">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 mx-auto">
            <Camera className="h-3.5 w-3.5" />
            <span>{t.galleryPage.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t.galleryPage.titlePrefix}<span className="gradient-text">{t.galleryPage.titleHighlight}</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            {t.galleryPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.galleryPage.items.map((item, idx) => (
            <div key={idx} className="glass-card rounded-3xl overflow-hidden border border-white/10 group bg-slate-900/60 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={galleryImages[idx % galleryImages.length]}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 font-mono">
                    {item.location}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href={ROUTES.REGISTER} className="btn-primary inline-flex items-center gap-2">
            <span>{t.galleryPage.cta}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
