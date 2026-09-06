import { Metadata } from 'next'
import { APP_NAME } from '@/constants'
import { isPlanCurrentlyActive, isPlanUpcoming } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { PlansClientView } from '@/components/public/plans-client-view'

export const metadata: Metadata = {
  title: `Investment Plans — ${APP_NAME}`,
  description: 'Explore currently available Shariah-compliant investment plans in Bangladesh.',
}

export default async function PlansPage() {
  const supabase = await createClient()

  const { data: allActivePlans } = await supabase
    .from('investment_plans')
    .select('id, name, description, display_label, highlights, is_featured, total_shares, shares_per_amount, max_shares_per_investor, roi_percentage, duration_months, owner_share_percentage, is_active, starts_at, ends_at')
    .eq('is_active', true)
    .order('roi_percentage', { ascending: true })

  const configuredPlans = allActivePlans || []
  const dbPlans = configuredPlans.filter(p => isPlanCurrentlyActive(p))
  const upcomingPlans = configuredPlans
    .filter(isPlanUpcoming)
    .map(plan => ({
      id: plan.id,
      name: plan.name,
      totalShares: plan.total_shares || 1000,
      sharePrice: plan.shares_per_amount || 1000,
      maxSharesPerInvestor: plan.max_shares_per_investor || 100,
      roiPercentage: plan.roi_percentage,
      durationMonths: plan.duration_months || 24,
      startsAt: plan.starts_at!,
    }))
  const displayPlans = dbPlans.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        display_label: p.display_label,
        highlights: p.highlights || [],
        is_featured: p.is_featured,
        total_shares: p.total_shares || 1000,
        shares_per_amount: p.shares_per_amount || 1000,
        max_shares_per_investor: p.max_shares_per_investor || 100,
        roi_percentage: p.roi_percentage,
        duration_months: p.duration_months || 24,
        owner_share_percentage: p.owner_share_percentage || 40,
      }))

  return <PlansClientView displayPlans={displayPlans} upcomingPlans={upcomingPlans} />
}
