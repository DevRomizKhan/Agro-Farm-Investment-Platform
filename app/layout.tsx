import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Providers } from '@/components/shared/providers'
import { NavigationProgressBar } from '@/components/ui/navigation-progress'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Amanah Farm — Invest in Agriculture. Harvest the Future.',
    template: '%s | Amanah Farm',
  },
  description:
    'Join thousands of investors growing wealth through sustainable agricultural investments in Bangladesh. Transparent, secure, and profitable.',
  keywords: ['agro investment', 'farm investment', 'Bangladesh investment', 'agricultural returns'],
  authors: [{ name: 'Amanah Farm' }],
  creator: 'Amanah Farm',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NavigationProgressBar />
        <Providers>
          {children}
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
