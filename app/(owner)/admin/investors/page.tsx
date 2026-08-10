'use client'

import { useEffect, useState } from 'react'
import { Users, Edit, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'
import { DeleteInvestorButton } from '@/components/features/admin/delete-investor-button'

export default function AdminInvestorsPage() {
  const { lang } = useLanguage()
  const [investors, setInvestors] = useState<any[]>([])
  const [kycStatusMap, setKycStatusMap] = useState<Map<string, string>>(new Map())
  const [investmentCountMap, setInvestmentCountMap] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const [
        { data: inv },
        { data: kyc },
        { data: investments },
      ] = await Promise.all([
        supabase.from('profiles').select('id, user_id, full_name, email, phone, created_at').eq('role', 'investor').order('created_at', { ascending: false }),
        supabase.from('kyc_submissions').select('user_id, status'),
        supabase.from('investments').select('user_id'),
      ])
      setInvestors(inv || [])
      const kMap = new Map((kyc || []).map((k: any) => [k.user_id, k.status]))
      setKycStatusMap(kMap)
      const cMap = new Map<string, number>()
      investments?.forEach((i: any) => cMap.set(i.user_id, (cMap.get(i.user_id) || 0) + 1))
      setInvestmentCountMap(cMap)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  const kycBadge = (status: string) => {
    if (lang !== 'bn') return status === 'not_submitted' ? 'Not Submitted' : status.charAt(0).toUpperCase() + status.slice(1)
    return status === 'approved' ? 'অনুমোদিত' : status === 'pending' ? 'অপেক্ষমাণ' : status === 'rejected' ? 'বাতিল' : 'জমা হয়নি'
  }

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'বিনিয়োগকারী ব্যবস্থাপনা' : 'Investor Management'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'সকল নিবন্ধিত বিনিয়োগকারীদের তথ্য দেখুন ও পরিচালনা করুন' : 'View and manage all registered investors'}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
          <Users className="h-5 w-5 text-emerald-400" />
          <h2 className="font-semibold text-white">{lang === 'bn' ? `সকল বিনিয়োগকারী (${investors.length})` : `All Investors (${investors.length})`}</h2>
        </div>

        {investors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{lang === 'bn' ? 'কোনো বিনিয়োগকারী পাওয়া যায়নি' : 'No Investors Found'}</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">{lang === 'bn' ? 'এখনও কোনো বিনিয়োগকারী নিবন্ধিত হননি।' : 'No investors have registered yet.'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>{lang === 'bn' ? 'বিনিয়োগকারী' : 'Investor'}</th>
                  <th>{lang === 'bn' ? 'ইমেইল' : 'Email'}</th>
                  <th>{lang === 'bn' ? 'মোবাইল' : 'Phone'}</th>
                  <th>{lang === 'bn' ? 'কেওয়াইসি অবস্থা' : 'KYC Status'}</th>
                  <th>{lang === 'bn' ? 'বিনিয়োগ' : 'Investments'}</th>
                  <th>{lang === 'bn' ? 'যোগদান' : 'Joined'}</th>
                  <th>{lang === 'bn' ? 'কার্যক্রম' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {investors.map((investor) => {
                  const kycStatus = kycStatusMap.get(investor.user_id) || 'not_submitted'
                  return (
                    <tr key={investor.id}>
                      <td>
                        <div className="font-medium text-white">{investor.full_name || '—'}</div>
                      </td>
                      <td className="text-slate-400 text-sm">{investor.email}</td>
                      <td className="text-slate-400 text-sm">{investor.phone || '—'}</td>
                      <td>
                        <span className={kycStatus === 'approved' ? 'badge-primary' : kycStatus === 'pending' ? 'badge-yellow' : kycStatus === 'rejected' ? 'badge-red' : 'badge-gray'}>
                          {kycBadge(kycStatus)}
                        </span>
                      </td>
                      <td className="text-white font-medium">{investmentCountMap.get(investor.user_id) || 0}</td>
                      <td className="text-slate-400 text-xs">{formatDate(investor.created_at)}</td>
                      <td>
                        <div className="flex gap-1.5">
                          <Link href={`${ROUTES.ADMIN_INVESTORS}/${investor.id}`} className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors" title={lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}>
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link href={`${ROUTES.ADMIN_INVESTORS}/${investor.id}/edit`} className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors" title={lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Investor'}>
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                          <DeleteInvestorButton profileId={investor.id} userId={investor.user_id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
