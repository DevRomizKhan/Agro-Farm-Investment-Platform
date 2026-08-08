-- Allow each investment plan to define its own exit lock period.
ALTER TABLE public.investment_plans
  ADD COLUMN IF NOT EXISTS lock_period_days INTEGER NOT NULL DEFAULT 366;

ALTER TABLE public.investment_plans
  DROP CONSTRAINT IF EXISTS investment_plans_lock_period_days_check;

ALTER TABLE public.investment_plans
  ADD CONSTRAINT investment_plans_lock_period_days_check
  CHECK (lock_period_days > 0);

COMMENT ON COLUMN public.investment_plans.lock_period_days IS
  'Number of days an approved investment remains locked before exit requests are allowed.';
