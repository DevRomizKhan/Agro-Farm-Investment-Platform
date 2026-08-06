import { Metadata } from 'next'
import { APP_NAME } from '@/constants'

export const metadata: Metadata = {
  title: `Terms & Investment Policy — ${APP_NAME}`,
  description: `Official terms, conditions, and investment policy for Project Adi — The Amanah Farm 2-Year Ownership Program. BDT 1,000 per share. Sharia-compliant. July 2026 – June 2028.`,
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
