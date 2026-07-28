import { ListSkeleton } from '@/components/ui/skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        {[80, 96, 72, 88].map((w) => (
          <Skeleton key={w} className={`h-9 w-${w} rounded-xl`} />
        ))}
      </div>
      <ListSkeleton rows={6} />
    </div>
  )
}
