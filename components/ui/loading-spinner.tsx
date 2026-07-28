'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'ring' | 'dots' | 'pulse'
  className?: string
  label?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

const dotSizeMap = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5',
  xl: 'w-4 h-4',
}

export function LoadingSpinner({
  size = 'md',
  variant = 'ring',
  className,
  label,
}: LoadingSpinnerProps) {
  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                'rounded-full bg-green-400 animate-bounce',
                dotSizeMap[size],
              )}
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
            />
          ))}
        </div>
        {label && <p className="text-sm text-slate-400 animate-pulse">{label}</p>}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)}>
        <span
          className={cn(
            'rounded-full bg-green-500/30 animate-ping',
            sizeMap[size],
          )}
        />
        {label && <p className="text-sm text-slate-400 animate-pulse">{label}</p>}
      </div>
    )
  }

  // Default ring variant
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <span
        className={cn(
          'block rounded-full border-2 border-slate-700 border-t-green-400 animate-spin',
          sizeMap[size],
        )}
      />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  )
}

/** Centered full-area loading state for page sections */
export function SectionLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <span className="block w-12 h-12 rounded-full border-2 border-slate-700 border-t-green-400 animate-spin" />
        <span className="absolute inset-0 block w-12 h-12 rounded-full border-2 border-transparent border-b-emerald-500/40 animate-spin [animation-duration:1.5s]" />
      </div>
      <p className="text-sm text-slate-400 animate-pulse">{label}</p>
    </div>
  )
}
