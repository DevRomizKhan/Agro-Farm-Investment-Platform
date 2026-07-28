import { PageLoader } from '@/components/ui/page-loader'

/**
 * Root-level loading state shown by Next.js App Router while
 * the root layout or page is streaming / fetching.
 */
export default function RootLoading() {
  return <PageLoader message="Getting things ready…" static />
}
