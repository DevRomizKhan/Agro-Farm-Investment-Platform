'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { LanguageProvider } from '@/lib/i18n/context'
import type { Language } from '@/lib/i18n/translations'

interface ProvidersProps {
  children: ReactNode
  initialLang?: Language
}

/**
 * Global providers wrapper: TanStack Query and LanguageProvider (i18n).
 * Toaster is handled in root layout directly via Sonner.
 */
export function Providers({ children, initialLang = 'bn' }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider initialLang={initialLang}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </LanguageProvider>
    </QueryClientProvider>
  )
}

