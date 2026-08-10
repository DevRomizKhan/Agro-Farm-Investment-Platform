import { Metadata } from 'next'
import { APP_NAME } from '@/constants'
import { isPlanCurrentlyActive, isPlanUpcoming } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { PlansClientView } from '@/components/public/plans-client-view'

export const metadata: Metadata = {
  title: `Investment Plans — ${APP_NAME}`,
  description: 'Explore Shariah-compliant, asset-backed cattle farm investment packages in Bangladesh. 10–18% annual returns.',
}

const STATIC_PLANS = [
  {
    id: undefined as string | undefined,
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
      'BDT 1,000 per share — affordable entry',
      '2-Year Program (July 2026 – June 2028)',
      'Cow & Fish production asset backing',
      'Sharia-compliant net annual dividends',
      'Annual audit reports provided',
    ],
    featuresBn: [
      'প্রতি শেয়ার ৳১,০০০ টাকা',
      '২ বছর মেয়াদী প্রোগ্রাম (জুলাই ২০২৬ – জুন ২০২৮)',
      'গরু ও মাছ উৎপাদনের মূল সম্পদ',
      'শরীয়াহ সম্মত বাৎসরিক নিট লভ্যাংশ',
      'বাৎসরিক অডিট রিপোর্ট ও হিসাব বিবরণী',
    ],
  },
  {
    id: undefined as string | undefined,
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
      '6-Month dividend progress updates',
      'Transfer rights after first year',
    ],
    featuresBn: [
      'প্রতি শেয়ার ৳১,০০০ টাকা',
      '২ বছর মেয়াদী প্রোগ্রাম (জুলাই ২০২৬ – জুন ২০২৮)',
      'একজন বিনিয়োগকারী সর্বোচ্চ ৫০০ শেয়ার',
      '৬ মাস পর পর লভ্যাংশ হালনাগাদ তথ্য',
      '১ বছর পর শেয়ার হস্তান্তরের সুযোগ',
    ],
  },
  {
    id: undefined as string | undefined,
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
      'Unlimited share allocation',
      'Full asset liquidation in 2029',
      'Priority investor communications',
    ],
    featuresBn: [
      'প্রতি শেয়ার ৳১,০০০ টাকা',
      '২ বছর মেয়াদী প্রোগ্রাম (জুলাই ২০২৬ – জুন ২০২৮)',
      'সর্বোচ্চ পরিমাণ শেয়ার বরাদ্দ',
      '২০২৯ সালে মূল সম্পদ অবায়িতকরণ বণ্টন',
      'অগ্রাধিকারভিত্তিক বিনিয়োগকারী সহায়তা',
    ],
  },
]

export default async function PlansPage() {
  const supabase = await createClient()

  const { data: allActivePlans } = await supabase
    .from('investment_plans')
    .select('id, name, total_shares, shares_per_amount, max_shares_per_investor, roi_percentage, duration_months, owner_share_percentage, description, is_active, starts_at, ends_at')
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
  const hasConfiguredPlans = configuredPlans.length > 0

  const displayPlans = hasConfiguredPlans
    ? dbPlans.map(p => ({
        id: p.id,
        name: p.name,
        tag: p.roi_percentage >= 16 ? 'Maximum Allocation' : p.roi_percentage >= 12 ? 'Most Popular' : 'Entry Level',
        total_shares: p.total_shares || 1000,
        shares_per_amount: p.shares_per_amount || 1000,
        max_shares_per_investor: p.max_shares_per_investor || 100,
        roi_percentage: p.roi_percentage,
        duration_months: p.duration_months || 24,
        owner_share_percentage: p.owner_share_percentage || 40,
        popular: p.roi_percentage >= 12 && p.roi_percentage < 16,
        features: [
          `BDT ${(p.shares_per_amount || 1000).toLocaleString()} per share`,
          `${p.duration_months || 24}-month program duration`,
          'Cow & Fish production asset backing',
          'Sharia-compliant net annual dividends',
          'Annual audit reports & financial statements',
        ],
        featuresBn: [
          `প্রতি শেয়ার ৳${(p.shares_per_amount || 1000).toLocaleString()} টাকা`,
          `${p.duration_months || 24} মাস মেয়াদী প্রোগ্রাম`,
          'গরু ও মাছ উৎপাদনের মূল সম্পদ',
          'শরীয়াহ সম্মত বাৎসরিক নিট লভ্যাংশ',
          'বাৎসরিক অডিট রিপোর্ট ও হিসাব বিবরণী',
        ],
      }))
    : STATIC_PLANS

  return <PlansClientView displayPlans={displayPlans} upcomingPlans={upcomingPlans} />
}
