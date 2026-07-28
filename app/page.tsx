import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { HeroSection } from '@/components/public/hero-section'
import { AboutSection } from '@/components/public/about-section'
import { BlogSection } from '@/components/public/blog-section'
import { FAQSection } from '@/components/public/faq-section'

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <BlogSection />
        <FAQSection />
      </main>
      <PublicFooter />
    </>
  )
}
