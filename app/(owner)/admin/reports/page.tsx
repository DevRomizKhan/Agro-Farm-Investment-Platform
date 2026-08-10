import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Mail, MessageSquare, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/constants'
import type { ContactSubmission } from '@/types'
import { ExportReportButton } from './export-report-button'
import { ReportCharts } from './report-charts'
import { AdminReportsClient } from '@/components/features/dashboard/admin-reports-client'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'owner') redirect(ROUTES.INVESTOR_DASHBOARD)

  const [
    { data: investments },
    { count: totalInvestors },
    { data: kycData },
    { data: plans },
    { data: contactSubmissions },
  ] = await Promise.all([
    supabase.from('investments').select('user_id, amount, status, created_at, expected_roi, actual_roi, shares_purchased, plan_id').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'investor'),
    supabase.from('kyc_submissions').select('user_id, status'),
    supabase.from('investment_plans').select('id, name, total_shares, shares_per_amount, owner_share_percentage'),
    supabase.from('contact_submissions').select('type, status'),
  ])

  const submissions = (contactSubmissions || []) as Pick<ContactSubmission, 'type' | 'status'>[]
  const subscribers = submissions.filter(s => s.type === 'newsletter')
  const contactRequests = submissions.filter(s => s.type === 'contact')
  const activeSubscribers = subscribers.filter(s => s.status !== 'unsubscribed' && s.status !== 'archived').length
  const newSubscribers = subscribers.filter(s => s.status === 'new').length
  const openContacts = contactRequests.filter(s => s.status === 'new' || s.status === 'in_progress').length

  const totalInvested = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + Number(i.amount), 0) || 0
  const totalExpectedROI = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + Number(i.expected_roi), 0) || 0
  const totalActualROI = investments?.reduce((sum, i) => sum + Number(i.actual_roi || 0), 0) || 0
  const activeInvestments = investments?.filter(i => i.status === 'active').length || 0
  const completedInvestments = investments?.filter(i => i.status === 'completed').length || 0
  const pendingInvestments = investments?.filter(i => i.status === 'pending').length || 0

  const totalSharesSold = investments?.filter(i => i.status === 'active').reduce((sum, i) => sum + (Number(i.shares_purchased) || 0), 0) || 0
  const totalAvailableShares = plans?.reduce((sum, p) => sum + Number(p.total_shares), 0) || 0
  const totalOwnerShares = plans?.reduce((sum, p) => sum + Math.floor(Number(p.total_shares) * (Number(p.owner_share_percentage) / 100)), 0) || 0
  const totalInvestorShares = Math.max(0, totalAvailableShares - totalOwnerShares)
  const availableSharesForSale = Math.max(0, totalAvailableShares - totalOwnerShares - totalSharesSold)
  const shareUtilization = totalInvestorShares > 0 ? ((totalSharesSold / totalInvestorShares) * 100).toFixed(1) : '0'

  const approvedKYC = kycData?.filter(k => k.status === 'approved').length || 0
  const pendingKYC = kycData?.filter(k => k.status === 'pending').length || 0

  const monthlyData = investments?.filter(i => i.status !== 'pending').reduce((acc, inv) => {
    const month = new Date(inv.created_at).toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!acc[month]) acc[month] = { invested: 0, count: 0 }
    acc[month].invested += Number(inv.amount)
    acc[month].count += 1
    return acc
  }, {} as Record<string, { invested: number; count: number }>) || {}

  const recentMonths = Object.entries(monthlyData).slice(-6).reverse()

  return (
    <AdminReportsClient
      totalInvested={totalInvested}
      totalExpectedROI={totalExpectedROI}
      totalActualROI={totalActualROI}
      activeInvestments={activeInvestments}
      completedInvestments={completedInvestments}
      pendingInvestments={pendingInvestments}
      totalInvestors={totalInvestors || 0}
      approvedKYC={approvedKYC}
      pendingKYC={pendingKYC}
      totalSharesSold={totalSharesSold}
      availableSharesForSale={availableSharesForSale}
      totalOwnerShares={totalOwnerShares}
      totalInvestorShares={totalInvestorShares}
      shareUtilization={shareUtilization}
      activeSubscribers={activeSubscribers}
      newSubscribers={newSubscribers}
      contactRequestsCount={contactRequests.length}
      openContacts={openContacts}
      submissionsCount={submissions.length}
      recentMonths={recentMonths}
    />
  )
}
