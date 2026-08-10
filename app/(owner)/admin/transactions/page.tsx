'use client'

import { useEffect, useState } from 'react'
import { CreditCard, ArrowDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ROUTES } from '@/constants'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

export default function AdminTransactionsPage() {
  const { lang } = useLanguage()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('investments')
        .select('*, plan:investment_plans(name), profile:profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50)
      setTransactions(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="fade-in flex items-center justify-center min-h-48"><div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /></div>

  const statusLabel = (s: string) => {
    if (lang !== 'bn') return s
    return s === 'active' ? 'সক্রিয়' : s === 'completed' ? 'সম্পন্ন' : s === 'pending' ? 'অপেক্ষমাণ' : s
  }

  return (
    <div className="fade-in space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">{lang === 'bn' ? 'লেনদেন বিবরণী' : 'Transactions'}</h1>
          <p className="page-subtitle">{lang === 'bn' ? 'সকল বিনিয়োগ লেনদেনের সারসংক্ষেপ' : 'View all investment transactions'}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
          <CreditCard className="h-5 w-5 text-emerald-400" />
          <h2 className="font-semibold text-white">{lang === 'bn' ? `সকল লেনদেন (${transactions.length})` : `All Transactions (${transactions.length})`}</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{lang === 'bn' ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No Transactions Found'}</h3>
            <p className="text-slate-400 text-sm">{lang === 'bn' ? 'এখনও কোনো লেনদেন রেকর্ড করা হয়নি।' : 'No investment transactions have been recorded yet.'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                  <th>{lang === 'bn' ? 'বিনিয়োগকারী' : 'Investor'}</th>
                  <th>{lang === 'bn' ? 'প্ল্যান' : 'Plan'}</th>
                  <th>{lang === 'bn' ? 'ধরন' : 'Type'}</th>
                  <th>{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                  <th>{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="text-slate-400 text-xs">{formatDate(tx.created_at)}</td>
                    <td>
                      <div className="font-medium text-white">{(tx.profile as any)?.full_name || '—'}</div>
                      <div className="text-xs text-slate-500">{(tx.profile as any)?.email || '—'}</div>
                    </td>
                    <td className="text-slate-300">{(tx.plan as any)?.name || '—'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <ArrowDown className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-slate-300 text-sm">{lang === 'bn' ? 'বিনিয়োগ' : 'Investment'}</span>
                      </div>
                    </td>
                    <td className="text-white font-medium">{formatCurrency(Number(tx.amount))}</td>
                    <td>
                      <span className={tx.status === 'active' ? 'badge-primary' : tx.status === 'completed' ? 'badge-green' : tx.status === 'pending' ? 'badge-yellow' : 'badge-gray'}>
                        {statusLabel(tx.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
