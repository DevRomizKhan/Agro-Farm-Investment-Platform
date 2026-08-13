import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Toaster } from 'sonner'
import { Providers } from '@/components/shared/providers'
import { NavigationProgressBar } from '@/components/ui/navigation-progress'
import { WhatsAppButton } from '@/components/ui/whatsapp-button'
import type { Language } from '@/lib/i18n/translations'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanahfarm.com'),
  title: {
    default: 'Amanah Farm — Invest in Agriculture. Harvest the Future.',
    template: '%s | Amanah Farm',
  },
  description:
    'Join thousands of investors growing wealth through sustainable agricultural investments in Bangladesh. Transparent, secure, and profitable.',
  keywords: ['agro investment', 'farm investment', 'Bangladesh investment', 'agricultural returns'],
  authors: [{ name: 'Amanah Farm' }],
  creator: 'Amanah Farm',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Amanah Farm — Invest in Agriculture. Harvest the Future.',
    description: 'Grow your wealth through sustainable agriculture investments.',
    siteName: 'Amanah Farm',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amanah Farm',
    description: 'Grow your wealth through sustainable agriculture investments.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const savedLang = cookieStore.get('amanah_lang')?.value as Language | undefined
  const initialLang: Language = savedLang === 'en' || savedLang === 'bn' ? savedLang : 'bn'

  return (
    <html lang={initialLang} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <NavigationProgressBar />
        <Providers initialLang={initialLang}>
          {children}
          <WhatsAppButton />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

