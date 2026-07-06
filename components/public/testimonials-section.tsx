import { Star, Quote } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const testimonials = [
  {
    name: 'Md. Rafiqul Islam',
    location: 'Dhaka',
    occupation: 'Business Owner',
    content: 'I have been investing with NHK Agro for 2 years. Returns are consistent every month. The dashboard makes it easy to track everything. Highly recommended!',
    rating: 5,
    invested: '৳5,00,000',
  },
  {
    name: 'Fatema Begum',
    location: 'Chittagong',
    occupation: 'Doctor',
    content: 'As a busy professional, I needed a passive income source. NHK Agro gives me 15% annual returns with zero hassle. The team is very professional.',
    rating: 5,
    invested: '৳2,00,000',
  },
  {
    name: 'Karim Uddin',
    location: 'Sylhet',
    occupation: 'Engineer',
    content: 'The transparency of this platform is unmatched. I can see exactly where my money is invested and receive monthly reports. Trust is the biggest factor and NHK delivers it.',
    rating: 5,
    invested: '৳3,50,000',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-900/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="badge-green mb-4 mx-auto w-fit">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our <span className="gradient-text">Investors Say</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-7 flex flex-col gap-5 hover:border-green-500/20 transition-all duration-300">
              <Quote className="h-8 w-8 text-green-500/30" />
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">
                  {getInitials(t.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.occupation} · {t.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500">Invested</p>
                  <p className="text-sm font-medium text-green-400">{t.invested}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
