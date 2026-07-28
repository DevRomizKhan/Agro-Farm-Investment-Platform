import { FormSkeleton } from '@/components/ui/skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="glass-card p-6">
        <FormSkeleton fields={5} />
      </div>
    </div>
  )
}
