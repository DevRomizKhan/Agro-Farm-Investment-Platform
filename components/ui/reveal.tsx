'use client'

import { useEffect, useRef, useState } from 'react'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Older iOS Safari can miss the first IntersectionObserver notification,
    // which would otherwise leave the section permanently transparent.
    const revealFallback = window.setTimeout(() => setIsVisible(true), 1200)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    )

    observer.observe(element)
    return () => {
      window.clearTimeout(revealFallback)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={`motion-reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
