export type UserRole = 'owner' | 'investor'

export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted'

export type InvestmentStatus = 'active' | 'completed' | 'cancelled' | 'pending'

export type NotificationType = 'kyc' | 'investment' | 'transaction' | 'system' | 'announcement'

export type TransactionType = 'deposit' | 'withdrawal' | 'roi' | 'refund'

export interface Profile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface KYCSubmission {
  id: string
  user_id: string
  status: KYCStatus
  // Personal Info
  full_name: string
  father_name: string
  mother_name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  national_id: string
  mobile_number: string
  email: string
  occupation: string
  // Addresses
  present_address: string
  permanent_address: string
  // Emergency Contact
  emergency_contact_name: string
  emergency_contact_relation: string
  emergency_contact_phone: string
  // Nominee
  nominee_name: string
  nominee_relation: string
  nominee_phone: string
  // Bank
  bank_name: string
  bank_account_number: string
  bank_branch: string
  bank_routing: string | null
  // Review
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  notes: string | null
  // Timestamps
  submitted_at: string | null
  created_at: string
  updated_at: string
  // Relations
  profile?: Profile
  documents?: KYCDocument[]
}

export interface KYCDocument {
  id: string
  kyc_id: string
  document_type: 'photo' | 'nid_front' | 'nid_back' | 'selfie'
  file_url: string
  file_name: string
  file_size: number
  uploaded_at: string
}

export interface InvestmentPlan {
  id: string
  name: string
  description: string | null
  min_amount: number
  max_amount: number
  roi_percentage: number
  duration_months: number
  /** Manual override — can force-disable a plan regardless of dates */
  is_active: boolean
  /** ISO datetime — plan becomes visible to investors from this moment */
  starts_at: string | null
  /** ISO datetime — plan becomes invisible to investors after this moment */
  ends_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Investment {
  id: string
  user_id: string
  plan_id: string
  amount: number
  status: InvestmentStatus
  start_date: string | null
  end_date: string | null
  expected_roi: number
  actual_roi: number
  receipt_url: string | null
  notes: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
  // Relations
  profile?: Profile
  plan?: InvestmentPlan
  transactions?: Transaction[]
}

export interface Transaction {
  id: string
  investment_id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string | null
  reference: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  action_url: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface BlogPostAuthor {
  id?: string
  full_name: string | null
  avatar_url: string | null
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  author_id: string | null
  category: string | null
  tags: string[] | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface BlogMedia {
  id: string
  blog_post_id: string
  file_url: string
  file_name: string
  file_type: string
  file_size: number
  mime_type: string
  alt_text: string | null
  display_order: number
  created_at: string
}

export interface BlogPostWithAuthor extends BlogPost {
  author: BlogPostAuthor | null
  media?: BlogMedia[]
}
