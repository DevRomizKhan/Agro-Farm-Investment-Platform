'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A slim NProgress-style top progress bar that fires on every
 * client-side route change (pathname change).
 */
export function NavigationProgressBar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPath = useRef<string>(pathname)

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const start = () => {
    clear()
    setProgress(10)
    setVisible(true)
    // Simulate incremental progress
    let p = 10
    intervalRef.current = setInterval(() => {
      p += Math.random() * 15
      if (p >= 85) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        p = 85
      }
      setProgress(p)
    }, 200)
  }

  const finish = () => {
    clear()
    setProgress(100)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 400)
  }

  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      // Route has already changed — just finish the bar
      finish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Start on link clicks / navigation triggers before pathname changes
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (target.target === '_blank') return
      start()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="progressbar"
      aria-label="Page loading progress"
      aria-valuenow={progress}
      className={`fixed top-0 left-0 right-0 z-[9998] h-[2.5px] transition-opacity duration-300
        ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400
          shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '200ms' : '300ms',
        }}
      />
      {/* Glowing tip */}
      {visible && (
        <div
          className="absolute top-0 h-[2.5px] w-24
            bg-gradient-to-r from-transparent to-white/40
            shadow-[0_0_8px_4px_rgba(52,211,153,0.6)]"
          style={{ right: `${100 - progress}%` }}
        />
      )}
    </div>
  )
}
