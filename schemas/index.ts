import { z } from 'zod'

// ─── Auth Schemas ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(3, 'Full name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(11, 'Phone number must be at least 11 digits').max(15),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
    accept_terms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

// ─── KYC Schemas ──────────────────────────────────────────────────────────────

export const kycSchema = z.object({
  // Personal Info
  full_name: z.string().min(3, 'Full name is required'),
  father_name: z.string().min(2, "Father's name is required"),
  mother_name: z.string().min(2, "Mother's name is required"),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  national_id: z.string().min(10, 'Valid NID number is required').max(17),
  mobile_number: z.string().min(11, 'Valid mobile number is required').max(15),
  email: z.string().email('Valid email is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  // Addresses
  present_address: z.string().min(10, 'Present address is required'),
  permanent_address: z.string().min(10, 'Permanent address is required'),
  // Emergency Contact
  emergency_contact_name: z.string().min(2, 'Emergency contact name is required'),
  emergency_contact_relation: z.string().min(2, 'Relation is required'),
  emergency_contact_phone: z.string().min(11, 'Emergency contact phone is required'),
  // Nominee
  nominee_name: z.string().min(2, 'Nominee name is required'),
  nominee_relation: z.string().min(2, 'Nominee relation is required'),
  nominee_phone: z.string().min(11, 'Nominee phone is required'),
  // Bank
  bank_name: z.string().min(2, 'Bank name is required'),
  bank_account_number: z.string().min(5, 'Account number is required'),
  bank_branch: z.string().min(2, 'Branch name is required'),
  bank_routing: z.string().optional(),
})

// ─── Investment Plan Schemas ───────────────────────────────────────────────────

export const investmentPlanSchema = z.object({
  name: z.string().min(3, 'Plan name is required'),
  description: z.string().optional(),
  min_amount: z.coerce.number().min(1000, 'Minimum amount must be at least ৳1,000'),
  max_amount: z.coerce.number().min(1000, 'Maximum amount must be at least ৳1,000'),
  roi_percentage: z.coerce.number().min(0.1).max(100),
  duration_months: z.coerce.number().int().min(1).max(120),
  is_active: z.boolean().default(true),
})

export const investSchema = z.object({
  plan_id: z.string().uuid('Invalid plan'),
  amount: z.coerce.number().min(1000, 'Minimum investment is ৳1,000'),
})

// ─── Profile Schema ────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  full_name: z.string().min(3, 'Full name is required'),
  phone: z.string().min(11).max(15).optional(),
})

// ─── KYC Review Schema ─────────────────────────────────────────────────────────

export const kycReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejection_reason: z.string().optional(),
  notes: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type KYCFormData = z.infer<typeof kycSchema>
export type InvestmentPlanFormData = z.infer<typeof investmentPlanSchema>
export type InvestFormData = z.infer<typeof investSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type KYCReviewFormData = z.infer<typeof kycReviewSchema>
