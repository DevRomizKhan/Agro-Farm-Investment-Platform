-- Enforce the per-plan investor maximum during approval as well as submission.
-- This protects the limit when an investor has multiple pending requests.
CREATE OR REPLACE FUNCTION public.approve_investment_request(
  p_investment_id UUID,
  p_approved_by UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
  investment_id UUID,
  allocated_shares INTEGER,
  amount NUMERIC,
  fully_allocated BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_investment investments%ROWTYPE;
  v_plan investment_plans%ROWTYPE;
  v_investor_shares INTEGER;
  v_active_shares INTEGER;
  v_older_pending_shares INTEGER;
  v_user_active_shares INTEGER;
  v_older_pending_user_shares INTEGER;
  v_global_remaining INTEGER;
  v_user_remaining INTEGER;
  v_allocated_shares INTEGER;
  v_amount NUMERIC(15,2);
  v_start_date DATE := CURRENT_DATE;
BEGIN
  IF public.get_user_role(auth.uid()) <> 'owner' THEN
    RAISE EXCEPTION 'Only owners can approve investments';
  END IF;

  SELECT * INTO v_investment
  FROM public.investments
  WHERE id = p_investment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Investment not found';
  END IF;
  IF v_investment.status <> 'pending' THEN
    RAISE EXCEPTION 'Only pending investments can be approved';
  END IF;

  -- Serializes approvals for this plan so two owners cannot oversell it.
  SELECT * INTO v_plan
  FROM public.investment_plans
  WHERE id = v_investment.plan_id
  FOR UPDATE;

  v_investor_shares := GREATEST(
    0,
    v_plan.total_shares - FLOOR(v_plan.total_shares * v_plan.owner_share_percentage / 100)::INTEGER
  );

  SELECT COALESCE(SUM(GREATEST(shares_purchased, 0)), 0)::INTEGER INTO v_active_shares
  FROM public.investments
  WHERE plan_id = v_investment.plan_id AND status = 'active';

  SELECT COALESCE(SUM(GREATEST(shares_purchased, 0)), 0)::INTEGER INTO v_older_pending_shares
  FROM public.investments
  WHERE plan_id = v_investment.plan_id
    AND status = 'pending'
    AND (created_at < v_investment.created_at OR (created_at = v_investment.created_at AND id < v_investment.id));

  SELECT COALESCE(SUM(GREATEST(shares_purchased, 0)), 0)::INTEGER INTO v_user_active_shares
  FROM public.investments
  WHERE plan_id = v_investment.plan_id
    AND user_id = v_investment.user_id
    AND status = 'active';

  SELECT COALESCE(SUM(GREATEST(shares_purchased, 0)), 0)::INTEGER INTO v_older_pending_user_shares
  FROM public.investments
  WHERE plan_id = v_investment.plan_id
    AND user_id = v_investment.user_id
    AND status = 'pending'
    AND (created_at < v_investment.created_at OR (created_at = v_investment.created_at AND id < v_investment.id));

  v_global_remaining := GREATEST(0, v_investor_shares - v_active_shares - v_older_pending_shares);
  v_user_remaining := GREATEST(0, v_plan.max_shares_per_investor - v_user_active_shares - v_older_pending_user_shares);
  v_allocated_shares := LEAST(GREATEST(v_investment.shares_purchased, 0), v_global_remaining, v_user_remaining);

  IF v_allocated_shares <= 0 THEN
    RAISE EXCEPTION 'No shares remain for this request within the plan or investor limit';
  END IF;

  v_amount := v_allocated_shares * v_plan.shares_per_amount;

  UPDATE public.investments
  SET shares_purchased = v_allocated_shares,
      amount = v_amount,
      expected_roi = v_amount * (v_plan.roi_percentage / 100) / 12 * v_plan.duration_months,
      status = 'active',
      start_date = v_start_date,
      end_date = (v_start_date + (v_plan.duration_months || ' months')::INTERVAL)::DATE,
      lock_expires_at = NOW() + (GREATEST(v_investment.lock_period_days, 0) || ' days')::INTERVAL,
      approved_by = p_approved_by,
      notes = p_notes,
      updated_at = NOW()
  WHERE id = p_investment_id;

  UPDATE public.transactions
  SET amount = v_amount,
      description = 'Approved deposit for ' || v_allocated_shares || ' shares in ' || v_plan.name || ' plan'
  WHERE investment_id = p_investment_id AND type = 'deposit';

  RETURN QUERY SELECT p_investment_id, v_allocated_shares, v_amount,
    v_allocated_shares = GREATEST(v_investment.shares_purchased, 0);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_investment_request(UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_investment_request(UUID, UUID, TEXT) TO authenticated;
