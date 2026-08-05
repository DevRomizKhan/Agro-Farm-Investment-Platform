import React, { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = typeof params?.code === 'string' ? params.code : undefined
  const error = typeof params?.error === 'string' ? params.error : undefined

  return (
    <Suspense fallback={<div className="fade-in">Loading...</div>}>
      <ResetPasswordClient code={code} error={error} />
    </Suspense>
  )
}
