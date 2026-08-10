import { isPlanCurrentlyActive, isPlanUpcoming } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { PlansPreviewClient, type ActivePlanItem } from '@/components/public/plans-preview-client'

const STATIC_PLANS: ActivePlanItem[] = [
  {
    name: 'Basic Share Package',
    tag: 'Entry Level',
    total_shares: 1000,
    shares_per_amount: 1000,
    max_shares_per_investor: 100,
    roi_percentage: 12,
    duration_months: 24,
    owner_share_percentage: 40,
    popular: false,
    features: [
      'BDT 1,000 per share',
      '2-Year Program (July 2026 – June 2028)',
      'Cow & Fish production asset backing',
      'Sharia compliant net annual dividends',
    ],
  },
  {
    name: 'Standard Share Package',
    tag: 'Most Popular',
    total_shares: 1000,
    shares_per_amount: 1000,
    max_shares_per_investor: 500,
    roi_percentage: 15,
    duration_months: 24,
    owner_share_percentage: 40,
    popular: true,
    features: [
      'BDT 1,000 per share',
      '2-Year Program (July 2026 – June 2028)',
      'Up to 500 shares per investor',
      '6-Month dividend updates & annual audits',
    ],
  },
  {
    name: 'Premium Share Package',
    tag: 'Maximum Allocation',
    total_shares: 1000,
    shares_per_amount: 1000,
    max_shares_per_investor: 1000,
    roi_percentage: 18,
    duration_months: 24,
    owner_share_percentage: 40,
    popular: false,
    features: [
      'BDT 1,000 per share',
      '2-Year Program (July 2026 – June 2028)',
      'Full asset liquidation distribution in 2029',
      'Priority investor support & reports',
    ],
  },
]

export async function PlansPreviewSection() {
  const supabase = await createClient()

  const { data: allActivePlans } = await supabase
    .from('investment_plans')
    .select('id, name, description, total_shares, shares_per_amount, max_shares_per_investor, roi_percentage, duration_months, owner_share_percentage, is_active, starts_at, ends_at')
    .eq('is_active', true)
    .order('roi_percentage', { ascending: true })

  const configuredPlans = allActivePlans || []
  const activePlans = configuredPlans.filter(plan => isPlanCurrentlyActive(plan))
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

  const plans: ActivePlanItem[] = configuredPlans.length > 0
    ? activePlans.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      tag: p.roi_percentage >= 16 ? 'High Returns' : p.roi_percentage >= 12 ? 'Most Popular' : 'Entry Level',
      total_shares: p.total_shares,
      shares_per_amount: p.shares_per_amount || 1000,
      max_shares_per_investor: p.max_shares_per_investor,
      roi_percentage: p.roi_percentage,
      duration_months: p.duration_months || 24,
      owner_share_percentage: p.owner_share_percentage || 40,
      popular: p.roi_percentage >= 12 && p.roi_percentage < 16,
      features: [
        `BDT ${(p.shares_per_amount || 1000).toLocaleString()} per share`,
        '2-Year Program (July 2026 – June 2028)',
        `Max ${p.max_shares_per_investor} shares per investor`,
        'Cow & Fish production asset backing',
      ],
    }))
    : STATIC_PLANS.map(p => ({ ...p, id: undefined }))

  return <PlansPreviewClient activePlans={plans} upcomingPlans={upcomingPlans} />
}