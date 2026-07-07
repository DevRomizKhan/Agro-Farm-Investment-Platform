import React, { Suspense } from 'react'
import Link from 'next/link'
import ResetPasswordClient from './ResetPasswordClient'
import { ROUTES } from '@/constants'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = typeof params?.code === 'string' ? params.code : undefined

  return (
    <Suspense fallback={<div className="fade-in">Loading...</div>}>
      <ResetPasswordClient code={code} />
    </Suspense>
  )
}
