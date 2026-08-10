'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { ROUTES } from '@/constants'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateProfileAction } from '@/actions/auth'
import { useLanguage } from '@/lib/i18n/context'
import { z } from 'zod'

const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

export default function EditProfilePage() {
  const { lang } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true)
    try {
      const result = await updateProfileAction(data)
      if (result.success) {
        toast.success(lang === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে' : result.message || 'Profile updated successfully')
        router.push(ROUTES.INVESTOR_PROFILE)
      } else {
        toast.error(lang === 'bn' ? 'প্রোফাইল আপডেট করা যায়নি' : result.error || 'Failed to update profile')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <Link href={ROUTES.INVESTOR_PROFILE} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            {lang === 'bn' ? 'প্রোফাইলে ফিরুন' : 'Back to Profile'}
          </Link>
          <h1 className="page-title">{lang === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'আপনার ব্যক্তিগত তথ্য আপডেট করুন' : 'Update your personal information'}</p>
        </div>
      </div>

      <div className="glass-card p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}</label>
            <input
              {...register('full_name')}
              type="text"
              className="input-base py-2.5 text-sm"
              placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
            />
            {errors.full_name && <p className="mt-1.5 text-xs text-red-400">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
            <input
              {...register('phone')}
              type="tel"
              className="input-base py-2.5 text-sm"
              placeholder={lang === 'bn' ? 'মোবাইল নম্বর লিখুন' : 'Enter your phone number'}
            />
            {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> {lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</> : (lang === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')}
            </button>
            <Link href={ROUTES.INVESTOR_PROFILE} className="btn-secondary flex-1">
              {lang === 'bn' ? 'বাতিল করুন' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
