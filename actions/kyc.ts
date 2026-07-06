'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { kycSchema } from '@/schemas'
import { SUPABASE_STORAGE_BUCKETS } from '@/constants'
import { generateFileName } from '@/lib/utils'

export type KYCActionResult = {
  success: boolean
  error?: string
}

/**
 * Submit KYC details and upload files to Supabase Storage
 */
export async function submitKYCAction(
  formData: FormData
): Promise<KYCActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Extract form fields
  const fields: Record<string, FormDataEntryValue | null> = {}
  kycSchema.keyof().options.forEach((key) => {
    fields[key] = formData.get(key)
  })

  // Validate fields with Zod
  const validated = kycSchema.safeParse(fields)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Invalid form data' }
  }

  // Extract file fields
  const photoFile = formData.get('photo') as File | null
  const nidFrontFile = formData.get('nid_front') as File | null
  const nidBackFile = formData.get('nid_back') as File | null
  const selfieFile = formData.get('selfie') as File | null

  if (!photoFile || photoFile.size === 0) return { success: false, error: 'Profile Photo is required' }
  if (!nidFrontFile || nidFrontFile.size === 0) return { success: false, error: 'NID Front image is required' }
  if (!nidBackFile || nidBackFile.size === 0) return { success: false, error: 'NID Back image is required' }
  if (!selfieFile || selfieFile.size === 0) return { success: false, error: 'Selfie is required' }

  try {
    // 1. Insert or update the KYC submission record
    const { data: kycRecord, error: kycError } = await supabase
      .from('kyc_submissions')
      .upsert({
        user_id: user.id,
        status: 'pending',
        full_name: validated.data.full_name,
        father_name: validated.data.father_name,
        mother_name: validated.data.mother_name,
        date_of_birth: validated.data.date_of_birth,
        gender: validated.data.gender,
        national_id: validated.data.national_id,
        mobile_number: validated.data.mobile_number,
        email: validated.data.email,
        occupation: validated.data.occupation,
        present_address: validated.data.present_address,
        permanent_address: validated.data.permanent_address,
        emergency_contact_name: validated.data.emergency_contact_name,
        emergency_contact_relation: validated.data.emergency_contact_relation,
        emergency_contact_phone: validated.data.emergency_contact_phone,
        nominee_name: validated.data.nominee_name,
        nominee_relation: validated.data.nominee_relation,
        nominee_phone: validated.data.nominee_phone,
        bank_name: validated.data.bank_name,
        bank_account_number: validated.data.bank_account_number,
        bank_branch: validated.data.bank_branch,
        bank_routing: validated.data.bank_routing || null,
        submitted_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
      .select('id')
      .single()

    if (kycError) {
      return { success: false, error: kycError.message }
    }

    const kycId = kycRecord.id

    // Delete existing documents for this KYC submission (for resubmissions)
    const { data: existingDocs } = await supabase
      .from('kyc_documents')
      .select('file_url, document_type')
      .eq('kyc_id', kycId)

    if (existingDocs && existingDocs.length > 0) {
      // Delete old files from storage
      const bucketName = SUPABASE_STORAGE_BUCKETS.KYC_DOCUMENTS
      const filesToDelete: string[] = []
      
      for (const doc of existingDocs) {
        // Extract storage path from public URL
        // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file
        const urlParts = doc.file_url.split('/')
        const bucketIndex = urlParts.indexOf(bucketName)
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/')
          filesToDelete.push(filePath)
        }
      }

      if (filesToDelete.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove(filesToDelete)
        
        if (deleteError) {
          console.error('Failed to delete old files:', deleteError)
          // Continue with database deletion even if file deletion fails
        }
      }

      // Delete old records from database
      await supabase.from('kyc_documents').delete().eq('kyc_id', kycId)
    }

    // Helper function to upload document and insert into kyc_documents
    const uploadDoc = async (file: File, type: 'photo' | 'nid_front' | 'nid_back' | 'selfie') => {
      const uniqueName = `${user.id}/${type}-${generateFileName(file.name)}`
      
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKETS.KYC_DOCUMENTS)
        .upload(uniqueName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        throw new Error(`Failed to upload ${type}: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKETS.KYC_DOCUMENTS)
        .getPublicUrl(uniqueName)

      // Save to database
      const { error: docError } = await supabase.from('kyc_documents').insert({
        kyc_id: kycId,
        document_type: type,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
      })

      if (docError) {
        throw new Error(`Failed to save ${type} document: ${docError.message}`)
      }
    }

    // Upload all 4 files
    await uploadDoc(photoFile, 'photo')
    await uploadDoc(nidFrontFile, 'nid_front')
    await uploadDoc(nidBackFile, 'nid_back')
    await uploadDoc(selfieFile, 'selfie')

    // Create system notification for owner/admin
    // (Bypass RLS using admin client to post a notification or system log)
    const adminSupabase = createAdminClient()
    await adminSupabase.from('notifications').insert({
      user_id: user.id, // Notification for the user confirming submission
      title: 'KYC Submitted Successfully',
      message: 'Your KYC application has been received and is currently under review.',
      type: 'kyc',
    })

    // Also get all admin/owners to notify them
    const { data: owners } = await adminSupabase
      .from('profiles')
      .select('user_id')
      .eq('role', 'owner')

    if (owners) {
      const ownerNotifications = owners.map((owner) => ({
        user_id: owner.user_id,
        title: 'New KYC Submission',
        message: `A new KYC application has been submitted by ${validated.data.full_name}.`,
        type: 'kyc',
        action_url: `/admin/kyc/${kycId}`,
      }))
      await adminSupabase.from('notifications').insert(ownerNotifications)
    }

    revalidatePath('/dashboard', 'layout')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'An error occurred during submission' }
  }
}

/**
 * Approve or Reject KYC (Owner action)
 */
export async function reviewKYCAction(
  kycId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string,
  notes?: string
): Promise<KYCActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Verify role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profileError || !profile) {
    return { success: false, error: profileError?.message || 'Profile not found' }
  }

  if (profile.role !== 'owner') {
    return { success: false, error: 'Forbidden: Owners only' }
  }

  // Update submission
  const { data: kyc, error: updateError } = await supabase
    .from('kyc_submissions')
    .update({
      status,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
      rejection_reason: status === 'rejected' ? rejectionReason : null,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', kycId)
    .select('user_id, full_name')
    .maybeSingle()

  if (updateError || !kyc) {
    return { success: false, error: updateError?.message || 'KYC submission not found' }
  }

  // Notify investor
  const adminSupabase = createAdminClient()
  await adminSupabase.from('notifications').insert({
    user_id: kyc.user_id,
    title: status === 'approved' ? 'KYC Approved 🎉' : 'KYC Rejected ⚠️',
    message: status === 'approved'
      ? 'Congratulations! Your identity verification is complete. You can now start investing.'
      : `Your KYC verification was rejected. Reason: ${rejectionReason || 'Please contact support.'}`,
    type: 'kyc',
    action_url: '/dashboard/kyc',
  })

  revalidatePath('/admin', 'layout')
  revalidatePath('/dashboard', 'layout')
  return { success: true }
}
