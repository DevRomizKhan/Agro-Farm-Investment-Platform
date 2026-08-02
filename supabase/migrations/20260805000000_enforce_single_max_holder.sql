-- Only one investor may hold the configured maximum number of shares in a plan.
-- Earlier pending maximum requests keep priority over later ones.
CREATE OR REPLACE FUNCTION public.enforce_single_max_holder()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_max_shares INTEGER;
  v_existing_max_holder BOOLEAN;
  v_earlier_max_request BOOLEAN;
BEGIN
  IF NEW.status <> 'active' THEN
    RETURN NEW;
  END IF;

  SELECT max_shares_per_investor INTO v_max_shares
  FROM public.investment_plans
  WHERE id = NEW.plan_id;

  IF NEW.shares_purchased < v_max_shares THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.investments AS i
    WHERE i.plan_id = NEW.plan_id
      AND i.status = 'active'
      AND i.user_id <> NEW.user_id
    GROUP BY i.user_id
    HAVING SUM(GREATEST(i.shares_purchased, 0)) >= v_max_shares
  ) INTO v_existing_max_holder;

  IF v_existing_max_holder THEN
    RAISE EXCEPTION 'Only one investor can receive the maximum shares for this plan';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.investments AS p
    WHERE p.plan_id = NEW.plan_id
      AND p.status = 'pending'
      AND p.user_id <> NEW.user_id
      AND p.shares_purchased >= v_max_shares
      AND (
        p.created_at < OLD.created_at
        OR (p.created_at = OLD.created_at AND p.id < OLD.id)
      )
  ) INTO v_earlier_max_request;

  IF v_earlier_max_request THEN
    RAISE EXCEPTION 'An earlier maximum-share request has priority for this plan';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_single_max_holder_on_investment ON public.investments;
CREATE TRIGGER enforce_single_max_holder_on_investment
  BEFORE INSERT OR UPDATE OF status, shares_purchased ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_single_max_holder();
