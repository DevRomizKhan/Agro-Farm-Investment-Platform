import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:-translate-y-0.5 hover:from-green-400 hover:to-emerald-500',
        destructive: 'bg-red-500 text-white hover:-translate-y-0.5 hover:bg-red-600',
        outline: 'border border-slate-700 bg-transparent text-slate-200 hover:border-slate-500 hover:bg-slate-800',
        secondary: 'border border-slate-700 bg-slate-800 text-slate-200 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-700',
        ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
        link: 'text-green-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-10 rounded-lg px-4',
        lg: 'h-12 rounded-xl px-7',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
