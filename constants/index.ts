export const APP_NAME = 'NHK Agro Invest'
export const APP_TAGLINE = 'Invest in Agriculture. Harvest the Future.'
export const APP_DESCRIPTION =
  'Join thousands of investors growing wealth through sustainable agricultural investments in Bangladesh.'

export const SUPABASE_STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  KYC_DOCUMENTS: 'kyc-documents',
  RECEIPTS: 'receipts',
  INVESTMENT_FILES: 'investment-files',
  BLOG_MEDIA: 'blog-media',
} as const

export const KYC_STATUS_LABELS: Record<string, string> = {
  pending: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  not_submitted: 'Not Submitted',
}

export const KYC_STATUS_COLORS: Record<string, string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  not_submitted: 'gray',
}

export const INVESTMENT_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending',
}

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export const OCCUPATION_OPTIONS = [
  'Business',
  'Service / Job',
  'Agriculture',
  'Student',
  'Homemaker',
  'Doctor',
  'Engineer',
  'Lawyer',
  'Teacher',
  'Retired',
  'Other',
]

export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  PLANS: '/plans',
  GALLERY: '/gallery',
  BLOG: '/blog',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Investor
  INVESTOR_DASHBOARD: '/dashboard',
  INVESTOR_KYC: '/dashboard/kyc',
  INVESTOR_INVESTMENTS: '/dashboard/investments',
  INVESTOR_DOCUMENTS: '/dashboard/documents',
  INVESTOR_NOTIFICATIONS: '/dashboard/notifications',
  INVESTOR_PROFILE: '/dashboard/profile',
  INVESTOR_SETTINGS: '/dashboard/settings',

  // Owner/Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_INVESTORS: '/admin/investors',
  ADMIN_KYC: '/admin/kyc',
  ADMIN_PLANS: '/admin/plans',
  ADMIN_INVESTMENTS: '/admin/investments',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_BLOG_NEW: '/admin/blog/new',
  ADMIN_BLOG_EDIT: '/admin/blog/edit',
} as const

export const PAGINATION_LIMIT = 10

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
export const ALLOWED_BLOG_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_VIDEO_TYPES]
