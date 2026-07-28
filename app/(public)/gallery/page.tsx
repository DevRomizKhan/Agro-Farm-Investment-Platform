import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { APP_NAME } from '@/constants'
import { ArrowRight, Camera } from 'lucide-react'

export const metadata: Metadata = {
  title: `Farm Gallery - ${APP_NAME}`,
  description: 'View photos and operational updates from Amanah Farm modern livestock facilities in Bangladesh.',
}

const galleryItems = [
  { title: 'High-Yield Bull Fattening Facility', location: 'Rajshahi Hub', image: '/images/carousel/slide1.jpg' },
  { title: 'Organic Feeding & Nutrition Area', location: 'Comilla Hub', image: '/images/carousel/slide2.jpg' },
  { title: 'Integrated Dairy & Eco Ecosystem', location: 'Rangpur Hub', image: '/images/carousel/slide3.jpg' },
  { title: 'Veterinary Inspection & Tagging', location: 'Sylhet Hub', image: '/images/carousel/slide1.jpg' },
  { title: 'Pasture Grazing Grounds', location: 'Bogura Hub', image: '/images/carousel/slide2.jpg' },
  { title: 'Automated Water & Waste System', location: 'Mymensingh Hub', image: '/images/carousel/slide3.jpg' },
]

export default function GalleryPage() {
  return (
    <div className="py-16 bg-slate-950">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 mx-auto">
            <Camera className="h-3.5 w-3.5" />
            <span>Farm Facilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Amanah Farm <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Take a visual tour of our modern cattle facilities, feeding yards, and sustainable agro hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="glass-card rounded-3xl overflow-hidden border border-white/10 group bg-slate-900/60 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
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
          <Link href="/register" className="btn-primary inline-flex items-center gap-2">
            <span>Invest in These Farms</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
