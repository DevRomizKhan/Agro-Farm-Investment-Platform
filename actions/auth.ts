'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/schemas'
import type { LoginFormData, RegisterFormData, ForgotPasswordFormData, ResetPasswordFormData } from '@/schemas'
import { ROUTES } from '@/constants'
import { z } from 'zod'

export type ActionResult = {
  success: boolean
  error?: string
  message?: string
  needsVerification?: boolean
  email?: string
}

export async function loginAction(data: LoginFormData): Promise<ActionResult> {
  const validated = loginSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Check if email is confirmed
  if (!authData.user.email_confirmed_at) {
    return {
      success: false,
      error: 'Please verify your email before logging in. Check your inbox for the verification link.',
      needsVerification: true,
      email: validated.data.email,
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function registerAction(data: RegisterFormData): Promise<ActionResult> {
  const validated = registerSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Check if email confirmation is disabled (for development)
  const emailConfirmationEnabled = process.env.EMAIL_CONFIRMATION_ENABLED !== 'false'

  const { data: authData, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.full_name,
        phone: validated.data.phone,
        role: 'investor',
      },
      emailRedirectTo: emailConfirmationEnabled ? `${process.env.NEXT_PUBLIC_APP_URL}/verify-email` : undefined,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // If email confirmation is disabled or user is auto-confirmed, create profile immediately
  if (!emailConfirmationEnabled || authData.user?.email_confirmed_at) {
    try {
      const { error: profileError } = await adminClient
        .from('profiles')
        .insert({
          user_id: authData.user!.id,
          email: validated.data.email,
          full_name: validated.data.full_name,
          phone: validated.data.phone,
          role: 'investor',
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return { success: false, error: 'Account created but profile setup failed. Please contact support.' }
      }

      return {
        success: true,
        message: 'Account created successfully! You can now log in.',
      }
    } catch (err) {
      console.error('Profile creation error:', err)
      return { success: false, error: 'Account created but profile setup failed. Please contact support.' }
    }
  }

  // Email confirmation is enabled - user needs to verify
  return {
    success: true,
    message: 'Account created! Please check your email to verify your account.',
  }
}

export async function forgotPasswordAction(data: ForgotPasswordFormData): Promise<ActionResult> {
  const validated = forgotPasswordSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, message: 'Password reset email sent. Please check your inbox.' }
}

export async function resetPasswordAction(data: ResetPasswordFormData & { code?: string }): Promise<ActionResult> {
  const validated = resetPasswordSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  if (!data.code) {
    return { success: false, error: 'Invalid reset code' }
  }

  const supabase = await createClient()
  
  // Exchange the code for a session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(data.code)
  
  if (exchangeError) {
    return { success: false, error: 'Invalid or expired reset link' }
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Sign out after successful password reset
  await supabase.auth.signOut()

  return { success: true, message: 'Password updated successfully!' }
}

export async function resendVerificationEmailAction(email: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, message: 'Verification email sent! Please check your inbox.' }
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect(ROUTES.LOGIN)
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return data
}

const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

export async function updateProfileAction(data: z.infer<typeof updateProfileSchema>): Promise<ActionResult> {
  const validated = updateProfileSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: validated.data.full_name,
      phone: validated.data.phone || null,
    })
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(ROUTES.INVESTOR_PROFILE)
  return { success: true, message: 'Profile updated successfully' }
}

const adminUpdateProfileSchema = z.object({
  id: z.string(),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

export async function adminUpdateProfileAction(data: z.infer<typeof adminUpdateProfileSchema>): Promise<ActionResult> {
  const validated = adminUpdateProfileSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Verify admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') {
    return { success: false, error: 'Unauthorized' }
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('profiles')
    .update({
      full_name: validated.data.full_name,
      email: validated.data.email,
      phone: validated.data.phone || null,
    })
    .eq('id', validated.data.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(ROUTES.ADMIN_INVESTORS)
  return { success: true, message: 'Investor updated successfully' }
}

export async function deleteInvestorAction(profileId: string, userId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Verify admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') {
    return { success: false, error: 'Unauthorized' }
  }

  const adminClient = createAdminClient()
  
  // First delete related data (investments, KYC submissions)
  const { error: investmentsError } = await adminClient
    .from('investments')
    .delete()
    .eq('user_id', userId)

  if (investmentsError) {
    return { success: false, error: investmentsError.message }
  }

  const { error: kycError } = await adminClient
    .from('kyc_submissions')
    .delete()
    .eq('user_id', userId)

  if (kycError) {
    return { success: false, error: kycError.message }
  }

  // Delete KYC documents from storage
  const { data: storageFiles } = await adminClient
    .storage
    .from('kyc-documents')
    .list(`${userId}/`, { limit: 100 })

  if (storageFiles && storageFiles.length > 0) {
    const filePaths = storageFiles.map(file => `${userId}/${file.name}`)
    const { error: storageError } = await adminClient
      .storage
      .from('kyc-documents')
      .remove(filePaths)

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with deletion even if storage fails
    }
  }

  // Then delete the profile
  const { error: profileError } = await adminClient
    .from('profiles')
    .delete()
    .eq('id', profileId)

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  // Finally delete the user from Supabase Auth
  const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

  if (authError) {
    console.error('Auth user deletion error:', authError)
    // Continue even if auth deletion fails - profile is already deleted
  }

  revalidatePath(ROUTES.ADMIN_INVESTORS)
  return { success: true, message: 'Investor deleted successfully' }
}
