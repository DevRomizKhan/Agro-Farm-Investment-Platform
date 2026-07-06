'use server'

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { reviewKYCAction } from '@/actions/kyc'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { kycId, status, rejection_reason, notes } = body

    if (!kycId || !status) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const result = await reviewKYCAction(kycId, status, rejection_reason, notes)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to update KYC status' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
