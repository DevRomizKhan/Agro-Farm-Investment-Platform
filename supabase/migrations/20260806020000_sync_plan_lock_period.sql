-- Keep every investment in sync when an owner changes its plan lock period.
-- Active investments are recalculated from their original start date; pending
-- investments receive the new value and get their expiry when approved.
CREATE OR REPLACE FUNCTION public.sync_plan_lock_period_to_investments()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.lock_period_days IS DISTINCT FROM OLD.lock_period_days THEN
    UPDATE public.investments
    SET lock_period_days = NEW.lock_period_days,
        lock_expires_at = CASE
          WHEN status = 'active' THEN
            COALESCE(start_date::timestamptz, created_at)
              + make_interval(days => NEW.lock_period_days)
          ELSE lock_expires_at
        END,
        updated_at = NOW()
    WHERE plan_id = NEW.id
      AND status IN ('active', 'pending');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_plan_lock_period_to_investments_trigger
  ON public.investment_plans;

CREATE TRIGGER sync_plan_lock_period_to_investments_trigger
  AFTER UPDATE OF lock_period_days ON public.investment_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_plan_lock_period_to_investments();
