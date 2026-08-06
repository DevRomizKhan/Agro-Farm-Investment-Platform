'use client'

import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number
  className?: string
  label?: string
}

export function CountUp({ value, suffix = '', prefix = '', decimals = 0, duration = 1400, className = '', label }: CountUpProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value)
      return
    }

    let frame = 0
    let startTime: number | null = null
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const animate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(value * easedProgress)
        if (progress < 1) frame = requestAnimationFrame(animate)
      }

      frame = requestAnimationFrame(animate)
      observer.disconnect()
    }, { threshold: 0.5 })

    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [duration, value])

  return (
    <span ref={elementRef} className={className} aria-label={label}>
      {prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}
