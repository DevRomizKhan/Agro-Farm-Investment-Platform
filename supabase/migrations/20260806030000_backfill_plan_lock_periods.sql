-- Backfill existing investments from their current plan lock period.
-- This fixes investments created before plan-level lock periods were introduced.
UPDATE public.investments AS i
SET lock_period_days = p.lock_period_days,
    lock_expires_at = CASE
      WHEN i.status = 'active' THEN
        COALESCE(i.start_date::timestamptz, i.created_at)
          + make_interval(days => p.lock_period_days)
      ELSE i.lock_expires_at
    END,
    updated_at = NOW()
FROM public.investment_plans AS p
WHERE p.id = i.plan_id
  AND i.status IN ('active', 'pending');
