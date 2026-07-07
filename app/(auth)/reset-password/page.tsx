import React, { Suspense } from 'react'
import Link from 'next/link'
import ResetPasswordClient from './ResetPasswordClient'
import { ROUTES } from '@/constants'

export default function ResetPasswordPage({ searchParams }: { searchParams?: { code?: string } }) {
  const code = searchParams?.code

  if (!code) {
    return (
      <div className="fade-in text-center">
        <div className="glass-card p-10">
          <h2 className="text-xl font-bold text-white mb-3">Invalid Reset Link</h2>
          <p className="text-slate-400 text-sm mb-6">The password reset link is invalid or has expired.</p>
          <Link href={ROUTES.FORGOT_PASSWORD} className="btn-secondary w-full justify-center">Request New Link</Link>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="fade-in">Loading...</div>}>
      <ResetPasswordClient code={code} />
    </Suspense>
  )
}
