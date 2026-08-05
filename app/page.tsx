import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { HeroSection } from '@/components/public/hero-section'
import { AboutSection } from '@/components/public/about-section'
import { PlansPreviewSection } from '@/components/public/plans-preview-section'
import { BlogSection } from '@/components/public/blog-section'
import { FAQSection } from '@/components/public/faq-section'

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const recoveryCode = typeof params?.code === 'string' ? params.code : undefined

  // Older or misconfigured Supabase email templates can send recovery codes
  // to the Site URL. Forward those links to the actual reset page.
  if (recoveryCode) {
    redirect(`/reset-password?code=${encodeURIComponent(recoveryCode)}`)
  }

  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <Suspense fallback={<SectionFallback label="Loading investment plans…" />}>
          <PlansPreviewSection />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Loading insights…" />}>
          <BlogSection />
        </Suspense>
        <FAQSection />
      </main>
      <PublicFooter />
    </>
  )
}

function SectionFallback({ label }: { label: string }) {
  return (
    <section className="border-t border-white/5 bg-slate-950 px-4 py-20">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </section>
  )
}
