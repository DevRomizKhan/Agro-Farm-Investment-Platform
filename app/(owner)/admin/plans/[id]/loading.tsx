import { Skeleton, FormSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="glass-card p-6 max-w-2xl mx-auto">
        <FormSkeleton fields={7} />
      </div>
    </div>
  )
}
