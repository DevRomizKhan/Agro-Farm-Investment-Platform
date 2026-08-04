'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'

const submissionSchema = z.object({
  type: z.enum(['contact', 'newsletter']),
  name: z.string().trim().min(2).max(120).optional().or(z.literal('')),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
  source: z.string().trim().min(1).max(80).default('website'),
})

const updateSubmissionSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'in_progress', 'contacted', 'resolved', 'unsubscribed', 'archived']),
  notes: z.string().trim().max(5000).optional().or(z.literal('')),
})

export type SubmissionInput = z.infer<typeof submissionSchema>
export type SubmissionStatus = z.infer<typeof updateSubmissionSchema>['status']

export type SubmissionActionResult = {
  success: boolean
  error?: string
  message?: string
}

async function getOwnerContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  return { supabase, user, profile }
}

export async function submitContactSubmission(input: SubmissionInput): Promise<SubmissionActionResult> {
  const parsed = submissionSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || 'Invalid submission' }

  const { supabase, user } = await getOwnerContext()
  const { error } = await supabase.from('contact_submissions').insert({
    ...parsed.data,
    name: parsed.data.name || null,
    phone: parsed.data.phone || null,
    message: parsed.data.message || null,
    user_id: user?.id || null,
  })

  if (error) {
    console.error('Contact submission failed:', error)
    return { success: false, error: 'We could not save your submission. Please try again.' }
  }

  return { success: true, message: 'Your submission has been received.' }
}

export async function updateContactSubmission(input: {
  id: string
  status: SubmissionStatus
  notes?: string
}): Promise<SubmissionActionResult> {
  const parsed = updateSubmissionSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || 'Invalid update' }

  const { supabase, profile } = await getOwnerContext()
  if (!profile || profile.role !== 'owner') return { success: false, error: 'Forbidden: Owners only' }

  const { error } = await supabase
    .from('contact_submissions')
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      handled_by: profile.id,
      handled_at: parsed.data.status === 'new' ? null : new Date().toISOString(),
    })
    .eq('id', parsed.data.id)

  if (error) {
    console.error('Contact submission update failed:', error)
    return { success: false, error: 'Could not update this submission.' }
  }

  revalidatePath(ROUTES.ADMIN_SUBMISSIONS)
  revalidatePath(ROUTES.ADMIN_DASHBOARD)
  return { success: true, message: 'Submission updated.' }
}

export async function deleteContactSubmission(id: string): Promise<SubmissionActionResult> {
  const parsed = z.string().uuid().safeParse(id)
  if (!parsed.success) return { success: false, error: 'Invalid submission' }

  const { supabase, profile } = await getOwnerContext()
  if (!profile || profile.role !== 'owner') return { success: false, error: 'Forbidden: Owners only' }

  const { error } = await supabase.from('contact_submissions').delete().eq('id', parsed.data)
  if (error) {
    console.error('Contact submission deletion failed:', error)
    return { success: false, error: 'Could not delete this submission.' }
  }

  revalidatePath(ROUTES.ADMIN_SUBMISSIONS)
  return { success: true, message: 'Submission deleted.' }
}
