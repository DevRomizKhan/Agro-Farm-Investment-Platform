import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { HeroSection } from '@/components/public/hero-section'
import { StatsSection } from '@/components/public/stats-section'
import { WhyInvestSection } from '@/components/public/why-invest-section'
import { PlansPreviewSection } from '@/components/public/plans-preview-section'
import { HowItWorksSection } from '@/components/public/how-it-works-section'
import { TestimonialsSection } from '@/components/public/testimonials-section'
import { FAQSection } from '@/components/public/faq-section'
import { AboutSection } from '@/components/public/about-section'

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <WhyInvestSection />
        <PlansPreviewSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <PublicFooter />
    </>
  )
}
