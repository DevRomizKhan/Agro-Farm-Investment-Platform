import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KYCReviewForm } from '@/components/features/kyc/kyc-review-form'
import { formatDate } from '@/lib/utils'
import { User, MapPin, Building2, Eye, HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import type { KYCDocument } from '@/types'

export default async function AdminKYCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  // Fetch specific submission with documents
  const { data: kyc } = await supabase
    .from('kyc_submissions')
    .select('*, documents:kyc_documents(*)')
    .eq('id', id)
    .maybeSingle()

  if (!kyc) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>কেওয়াইসি আবেদন পাওয়া যায়নি</p>
        <Link href={ROUTES.ADMIN_KYC} className="text-emerald-400 hover:underline mt-4 inline-block">তালিকায় ফিরে যান</Link>
      </div>
    )
  }

  // Group files by type
  const documents = (kyc.documents || []) as KYCDocument[]
  const photo = documents.find((d) => d.document_type === 'photo')?.file_url
  const selfie = documents.find((d) => d.document_type === 'selfie')?.file_url
  const nidFront = documents.find((d) => d.document_type === 'nid_front')?.file_url
  const nidBack = documents.find((d) => d.document_type === 'nid_back')?.file_url

  return (
    <div className="fade-in space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="page-header">
        <div>
          <Link href={ROUTES.ADMIN_KYC} className="text-sm text-slate-500 hover:text-white transition-colors">
            ← কেওয়াইসি তালিকায় ফিরে যান
          </Link>
          <h1 className="page-title mt-2">কেওয়াইসি পর্যালোচনা: {kyc.full_name}</h1>
          <p className="page-subtitle">জমার তারিখ: {formatDate(kyc.submitted_at || kyc.created_at)}</p>
        </div>
        <div>
          <span className={
            kyc.status === 'approved' ? 'badge-primary text-sm px-4 py-2' :
            kyc.status === 'pending' ? 'badge-yellow text-sm px-4 py-2' :
            'badge-red text-sm px-4 py-2'
          }>{kyc.status === 'approved' ? 'অনুমোদিত' : kyc.status === 'pending' ? 'অপেক্ষমাণ' : 'বাতিল'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Blocks */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Personal Information */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2 pb-2 border-b border-white/5">
              <User className="h-4.5 w-4.5 text-emerald-400" /> ব্যক্তিগত তথ্য
            </h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">পিতার নাম</span>
                <span className="text-slate-200">{kyc.father_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">মাতার নাম</span>
                <span className="text-slate-200">{kyc.mother_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">জাতীয় পরিচয়পত্র নম্বর</span>
                <span className="text-white font-medium">{kyc.national_id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">জন্মতারিখ</span>
                <span className="text-slate-200">{formatDate(kyc.date_of_birth)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">লিঙ্গ</span>
                <span className="text-slate-200 uppercase">{kyc.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">পেশা</span>
                <span className="text-slate-200">{kyc.occupation}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">মোবাইল</span>
                <span className="text-slate-200">{kyc.mobile_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">ইমেইল</span>
                <span className="text-slate-200">{kyc.email}</span>
              </div>
            </div>
          </div>

          {/* 2. Address Details */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2 pb-2 border-b border-white/5">
              <MapPin className="h-4.5 w-4.5 text-emerald-400" /> ঠিকানার তথ্য
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">বর্তমান ঠিকানা</span>
                <p className="text-slate-200 leading-relaxed mt-1">{kyc.present_address}</p>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">স্থায়ী ঠিকানা</span>
                <p className="text-slate-200 leading-relaxed mt-1">{kyc.permanent_address}</p>
              </div>
            </div>
          </div>

          {/* 3. Nominee & Emergency Contact */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2 pb-2 border-b border-white/5">
              <HeartHandshake className="h-4.5 w-4.5 text-emerald-400" /> নমিনি ও জরুরি যোগাযোগ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-xs tracking-wider text-slate-400">জরুরি যোগাযোগ</h3>
                <div>
                  <span className="text-slate-500 block text-xs">নাম</span>
                  <span className="text-slate-200">{kyc.emergency_contact_name} ({kyc.emergency_contact_relation})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">মোবাইল</span>
                  <span className="text-slate-200">{kyc.emergency_contact_phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-xs tracking-wider text-slate-400">নমিনির তথ্য</h3>
                <div>
                  <span className="text-slate-500 block text-xs">নাম</span>
                  <span className="text-slate-200">{kyc.nominee_name} ({kyc.nominee_relation})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">মোবাইল</span>
                  <span className="text-slate-200">{kyc.nominee_phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bank Account */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2 pb-2 border-b border-white/5">
              <Building2 className="h-4.5 w-4.5 text-emerald-400" /> অর্থপ্রদানের ব্যাংক তথ্য
            </h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">ব্যাংকের নাম</span>
                <span className="text-slate-200">{kyc.bank_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">অ্যাকাউন্ট নম্বর</span>
                <span className="text-white font-medium">{kyc.bank_account_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">শাখার নাম</span>
                <span className="text-slate-200">{kyc.bank_branch}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">রাউটিং নম্বর</span>
                <span className="text-slate-200">{kyc.bank_routing || 'দেওয়া হয়নি'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Images and Decision form */}
        <div className="space-y-6">
          {/* Photos */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold text-white text-sm">নথির কপি</h2>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-center">
              <div>
                <span className="text-slate-500 block mb-2">প্রোফাইল ছবি</span>
                {photo ? (
                  <a href={photo} target="_blank" className="relative group block rounded-lg overflow-hidden border border-white/5 bg-slate-950 aspect-square">
                    <img src={photo} alt="প্রোফাইল ছবি" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Eye className="h-4 w-4" /></div>
                  </a>
                ) : <div className="border border-white/5 bg-slate-950/40 rounded-lg aspect-square flex items-center justify-center">পাওয়া যায়নি</div>}
              </div>

              <div>
                <span className="text-slate-500 block mb-2">এনআইডিসহ সেলফি</span>
                {selfie ? (
                  <a href={selfie} target="_blank" className="relative group block rounded-lg overflow-hidden border border-white/5 bg-slate-950 aspect-square">
                    <img src={selfie} alt="সেলফি" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Eye className="h-4 w-4" /></div>
                  </a>
                ) : <div className="border border-white/5 bg-slate-950/40 rounded-lg aspect-square flex items-center justify-center">পাওয়া যায়নি</div>}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block mb-2">এনআইডির সামনের দিক</span>
                {nidFront ? (
                  <a href={nidFront} target="_blank" className="relative group block rounded-lg overflow-hidden border border-white/5 bg-slate-950 h-28">
                    <img src={nidFront} alt="এনআইডির সামনের দিক" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Eye className="h-4 w-4" /></div>
                  </a>
                ) : <div className="border border-white/5 bg-slate-950/40 rounded-lg h-28 flex items-center justify-center">পাওয়া যায়নি</div>}
              </div>

              <div>
                <span className="text-slate-500 block mb-2">এনআইডির পেছনের দিক</span>
                {nidBack ? (
                  <a href={nidBack} target="_blank" className="relative group block rounded-lg overflow-hidden border border-white/5 bg-slate-950 h-28">
                    <img src={nidBack} alt="এনআইডির পেছনের দিক" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Eye className="h-4 w-4" /></div>
                  </a>
                ) : <div className="border border-white/5 bg-slate-950/40 rounded-lg h-28 flex items-center justify-center">পাওয়া যায়নি</div>}
              </div>
            </div>
          </div>

          {/* Form */}
          {kyc.status === 'pending' && (
            <KYCReviewForm kycId={kyc.id} />
          )}

          {kyc.status !== 'pending' && (
            <div className="glass-card p-6 space-y-3 text-sm">
              <span className="text-slate-400 block text-xs">পর্যালোচনার তথ্য</span>
              {kyc.notes && (
                <div>
                  <span className="text-slate-500 text-xs block">অভ্যন্তরীণ নোট</span>
                  <p className="text-slate-300 italic mt-1">&ldquo;{kyc.notes}&rdquo;</p>
                </div>
              )}
              {kyc.rejection_reason && (
                <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400">
                  <span className="font-semibold block text-xs">প্রত্যাখ্যানের কারণ</span>
                  <p className="mt-1">{kyc.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
