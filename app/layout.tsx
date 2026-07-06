import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { Providers } from '@/components/shared/providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NHK Agro Invest — Invest in Agriculture. Harvest the Future.',
    template: '%s | NHK Agro Invest',
  },
  description:
    'Join thousands of investors growing wealth through sustainable agricultural investments in Bangladesh. Transparent, secure, and profitable.',
  keywords: ['agro investment', 'farm investment', 'Bangladesh investment', 'agricultural returns'],
  authors: [{ name: 'NHK Agro Invest' }],
  creator: 'NHK Agro Invest',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'NHK Agro Invest — Invest in Agriculture. Harvest the Future.',
    description: 'Grow your wealth through sustainable agriculture investments.',
    siteName: 'NHK Agro Invest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHK Agro Invest',
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
      <body className={`${inter.variable} font-sans antialiased`}>
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
