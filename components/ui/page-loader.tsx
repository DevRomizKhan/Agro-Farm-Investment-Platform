'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface PageLoaderProps {
  /** Custom message shown below the logo */
  message?: string
  /** If true the loader is mounted unconditionally (static use). Otherwise fades out after mount. */
  static?: boolean
}

export function PageLoader({ message = 'Loading your dashboard…', static: isStatic }: PageLoaderProps) {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (isStatic) return
    const timer = setTimeout(() => setFadeOut(true), 300)
    const hide = setTimeout(() => setVisible(false), 800)
    return () => {
      clearTimeout(timer)
      clearTimeout(hide)
    }
  }, [isStatic])

  if (!visible && !isStatic) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-slate-950 transition-opacity duration-500
        ${fadeOut && !isStatic ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Radial glow behind logo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[500px] h-[500px] rounded-full
          bg-green-500/8 blur-[120px] animate-pulse" />
      </div>

      {/* Logo mark */}
      <div className="relative mb-8">
        {/* Outer rotating ring */}
        <span className="absolute inset-0 -m-6 block rounded-full border border-green-500/20 border-t-green-400/70 animate-spin [animation-duration:2s]" />
        {/* Middle pulsing ring */}
        <span className="absolute inset-0 -m-2 block rounded-full border border-green-500/10 animate-ping [animation-duration:2s]" />
        {/* Logo container */}
        <div className="relative flex items-center justify-center px-4 py-2
          rounded-2xl bg-slate-900/80
          border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <Image
            src="/logo.png"
            alt="Amanah Farm"
            width={160}
            height={47}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Brand name */}
      <h1 className="text-xl font-bold tracking-tight text-white mb-1">
        Amanah <span className="text-green-400">Farm</span>
      </h1>
      <p className="text-xs text-slate-500 mb-8 tracking-widest uppercase">
        Agricultural Investment Platform
      </p>

      {/* Progress bar */}
      <div className="w-48 h-0.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500
          loader-progress-bar" />
      </div>

      <p className="mt-4 text-xs text-slate-500 animate-pulse">{message}</p>
    </div>
  )
}
