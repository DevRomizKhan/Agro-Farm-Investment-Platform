import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-72" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal details */}
          {['Personal Details', 'Address Details', 'Nominee & Emergency', 'Bank Details'].map((title) => (
            <div key={title} className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Photos + action */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
          <div className="glass-card p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
