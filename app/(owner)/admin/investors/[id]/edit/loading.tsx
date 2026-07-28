import { Skeleton, FormSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="glass-card p-6 max-w-2xl mx-auto">
        <FormSkeleton fields={6} />
      </div>
    </div>
  )
}
