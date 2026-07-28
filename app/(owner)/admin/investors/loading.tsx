import { ListSkeleton } from '@/components/ui/skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
      <ListSkeleton rows={6} />
    </div>
  )
}
