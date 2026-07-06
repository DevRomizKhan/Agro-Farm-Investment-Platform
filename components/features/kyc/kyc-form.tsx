'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Upload, User, MapPin, Building2, ShieldCheck, HeartHandshake } from 'lucide-react'
import { kycSchema, type KYCFormData } from '@/schemas'
import { submitKYCAction } from '@/actions/kyc'
import { OCCUPATION_OPTIONS, GENDER_OPTIONS, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/constants'

interface FileInputState {
  photo: File | null
  nid_front: File | null
  nid_back: File | null
  selfie: File | null
}

export function KYCForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<FileInputState>({
    photo: null,
    nid_front: null,
    nid_back: null,
    selfie: null,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof FileInputState) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Please upload an image (JPEG, PNG, or WebP)')
        e.target.value = ''
        return
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 5MB limit. Please upload a smaller file.')
        e.target.value = ''
        return
      }
      
      setFiles((prev) => ({ ...prev, [key]: file }))
    }
  }

  const onSubmit = async (data: KYCFormData) => {
    // Validate that files are selected
    if (!files.photo) return toast.error('Profile photo is required')
    if (!files.nid_front) return toast.error('NID front image is required')
    if (!files.nid_back) return toast.error('NID back image is required')
    if (!files.selfie) return toast.error('Selfie photo is required')

    setIsLoading(true)
    try {
      const formData = new FormData()
      
      // Append fields
      Object.entries(data).forEach(([key, val]) => {
        formData.append(key, val as string)
      })

      // Append files
      formData.append('photo', files.photo)
      formData.append('nid_front', files.nid_front)
      formData.append('nid_back', files.nid_back)
      formData.append('selfie', files.selfie)

      const result = await submitKYCAction(formData)
      if (result.success) {
        toast.success('KYC application submitted successfully!')
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to submit KYC')
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. Personal Information */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <User className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Personal Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name (As per NID)</label>
            <input {...register('full_name')} type="text" className="input-base" placeholder="John Doe" />
            {errors.full_name && <p className="mt-1.5 text-xs text-red-400">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">National ID (NID) Number</label>
            <input {...register('national_id')} type="text" className="input-base" placeholder="1990XXXXXXXXXXXXX" />
            {errors.national_id && <p className="mt-1.5 text-xs text-red-400">{errors.national_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Father&apos;s Name</label>
            <input {...register('father_name')} type="text" className="input-base" placeholder="Father's Name" />
            {errors.father_name && <p className="mt-1.5 text-xs text-red-400">{errors.father_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mother&apos;s Name</label>
            <input {...register('mother_name')} type="text" className="input-base" placeholder="Mother's Name" />
            {errors.mother_name && <p className="mt-1.5 text-xs text-red-400">{errors.mother_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
            <input {...register('date_of_birth')} type="date" className="input-base" />
            {errors.date_of_birth && <p className="mt-1.5 text-xs text-red-400">{errors.date_of_birth.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
            <select {...register('gender')} className="input-base">
              <option value="">Select Gender</option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.gender && <p className="mt-1.5 text-xs text-red-400">{errors.gender.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mobile Number</label>
            <input {...register('mobile_number')} type="tel" className="input-base" placeholder="017XXXXXXXX" />
            {errors.mobile_number && <p className="mt-1.5 text-xs text-red-400">{errors.mobile_number.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input {...register('email')} type="email" className="input-base" placeholder="you@example.com" />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Occupation</label>
            <select {...register('occupation')} className="input-base">
              <option value="">Select Occupation</option>
              {OCCUPATION_OPTIONS.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
            {errors.occupation && <p className="mt-1.5 text-xs text-red-400">{errors.occupation.message}</p>}
          </div>
        </div>
      </div>

      {/* 2. Address Details */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <MapPin className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Address Details</h2>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Present Address</label>
            <textarea {...register('present_address')} rows={3} className="input-base resize-none" placeholder="House, Road, Area, Post Office, District" />
            {errors.present_address && <p className="mt-1.5 text-xs text-red-400">{errors.present_address.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Permanent Address</label>
            <textarea {...register('permanent_address')} rows={3} className="input-base resize-none" placeholder="Village, Post Office, Upazila, District" />
            {errors.permanent_address && <p className="mt-1.5 text-xs text-red-400">{errors.permanent_address.message}</p>}
          </div>
        </div>
      </div>

      {/* 3. Nominee & Emergency Contact */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <HeartHandshake className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Nominee &amp; Emergency Contact</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Emergency Contact</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input {...register('emergency_contact_name')} type="text" className="input-base py-2.5 text-sm" />
              {errors.emergency_contact_name && <p className="mt-1 text-xs text-red-400">{errors.emergency_contact_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Relation</label>
              <input {...register('emergency_contact_relation')} type="text" className="input-base py-2.5 text-sm" placeholder="Spouse, Brother, Friend" />
              {errors.emergency_contact_relation && <p className="mt-1 text-xs text-red-400">{errors.emergency_contact_relation.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input {...register('emergency_contact_phone')} type="tel" className="input-base py-2.5 text-sm" />
              {errors.emergency_contact_phone && <p className="mt-1 text-xs text-red-400">{errors.emergency_contact_phone.message}</p>}
            </div>
          </div>

          {/* Nominee Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Nominee Details</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input {...register('nominee_name')} type="text" className="input-base py-2.5 text-sm" />
              {errors.nominee_name && <p className="mt-1 text-xs text-red-400">{errors.nominee_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Relation</label>
              <input {...register('nominee_relation')} type="text" className="input-base py-2.5 text-sm" placeholder="Mother, Child, Spouse" />
              {errors.nominee_relation && <p className="mt-1 text-xs text-red-400">{errors.nominee_relation.message}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input {...register('nominee_phone')} type="tel" className="input-base py-2.5 text-sm" />
              {errors.nominee_phone && <p className="mt-1 text-xs text-red-400">{errors.nominee_phone.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bank Details */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <Building2 className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Bank Details (For Payouts)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bank Name</label>
            <input {...register('bank_name')} type="text" className="input-base" placeholder="e.g. Dutch-Bangla Bank" />
            {errors.bank_name && <p className="mt-1.5 text-xs text-red-400">{errors.bank_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
            <input {...register('bank_account_number')} type="text" className="input-base" placeholder="123.456.7890" />
            {errors.bank_account_number && <p className="mt-1.5 text-xs text-red-400">{errors.bank_account_number.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Branch Name</label>
            <input {...register('bank_branch')} type="text" className="input-base" placeholder="Gulshan Branch" />
            {errors.bank_branch && <p className="mt-1.5 text-xs text-red-400">{errors.bank_branch.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Routing Number (Optional)</label>
            <input {...register('bank_routing')} type="text" className="input-base" placeholder="090XXXXXXXX" />
            {errors.bank_routing && <p className="mt-1.5 text-xs text-red-400">{errors.bank_routing.message}</p>}
          </div>
        </div>
      </div>

      {/* 5. Document Uploads */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <Upload className="h-5 w-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">Required Documents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Passport Size Photo</label>
            <div className="relative border border-dashed border-slate-700 hover:border-green-500/50 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-800/20 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="h-6 w-6 text-slate-400 mb-2" />
              <p className="text-xs text-slate-400">{files.photo ? files.photo.name : 'Select or drop image file (Max 5MB)'}</p>
            </div>
          </div>

          {/* Selfie */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Selfie with NID Card</label>
            <div className="relative border border-dashed border-slate-700 hover:border-green-500/50 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-800/20 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'selfie')} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="h-6 w-6 text-slate-400 mb-2" />
              <p className="text-xs text-slate-400">{files.selfie ? files.selfie.name : 'Select or drop image file (Max 5MB)'}</p>
            </div>
          </div>

          {/* NID Front */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">NID Card Front Side</label>
            <div className="relative border border-dashed border-slate-700 hover:border-green-500/50 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-800/20 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'nid_front')} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="h-6 w-6 text-slate-400 mb-2" />
              <p className="text-xs text-slate-400">{files.nid_front ? files.nid_front.name : 'Select or drop image file (Max 5MB)'}</p>
            </div>
          </div>

          {/* NID Back */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">NID Card Back Side</label>
            <div className="relative border border-dashed border-slate-700 hover:border-green-500/50 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-800/20 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'nid_back')} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="h-6 w-6 text-slate-400 mb-2" />
              <p className="text-xs text-slate-400">{files.nid_back ? files.nid_back.name : 'Select or drop image file (Max 5MB)'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="btn-primary w-full md:w-auto px-8 py-3.5">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting KYC Application...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4.5 w-4.5" />
              Submit KYC Application
            </>
          )}
        </button>
      </div>
    </form>
  )
}
