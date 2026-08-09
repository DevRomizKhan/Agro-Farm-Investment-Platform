-- Investment lifecycle: pending request -> approved for payment -> payment submitted -> active.

ALTER TABLE public.investments
  DROP CONSTRAINT IF EXISTS investments_status_check;

ALTER TABLE public.investments
  ADD CONSTRAINT investments_status_check
  CHECK (status IN ('pending', 'approved', 'payment_submitted', 'active', 'rejected', 'completed', 'cancelled'));

ALTER TABLE public.investments
  ADD COLUMN IF NOT EXISTS request_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.bank_transfer_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  account_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  branch_name TEXT,
  routing_number TEXT,
  instructions TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bank_transfer_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage bank transfer settings"
  ON public.bank_transfer_settings
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

DROP FUNCTION IF EXISTS public.approve_investment_request(UUID, UUID, TEXT);

CREATE FUNCTION public.approve_investment_request(
  p_investment_id UUID,
  p_approved_by UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (investment_id UUID, allocated_shares INTEGER, amount NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_investment investments%ROWTYPE;
  v_plan investment_plans%ROWTYPE;
  v_reserved_shares INTEGER;
  v_user_reserved_shares INTEGER;
  v_available_shares INTEGER;
  v_amount NUMERIC(15,2);
BEGIN
  IF public.get_user_role(auth.uid()) <> 'owner' THEN
    RAISE EXCEPTION 'Only owners can approve investments';
  END IF;

  SELECT * INTO v_investment FROM public.investments WHERE id = p_investment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Investment not found'; END IF;
  IF v_investment.status <> 'pending' THEN RAISE EXCEPTION 'Only pending requests can be approved'; END IF;

  SELECT * INTO v_plan FROM public.investment_plans WHERE id = v_investment.plan_id FOR UPDATE;

  SELECT COALESCE(SUM(shares_purchased), 0)::INTEGER INTO v_reserved_shares
  FROM public.investments
  WHERE plan_id = v_investment.plan_id
    AND status IN ('active', 'approved', 'payment_submitted');

  SELECT COALESCE(SUM(shares_purchased), 0)::INTEGER INTO v_user_reserved_shares
  FROM public.investments
  WHERE plan_id = v_investment.plan_id
    AND user_id = v_investment.user_id
    AND status IN ('active', 'approved', 'payment_submitted');

  v_available_shares := GREATEST(0, v_plan.total_shares - FLOOR(v_plan.total_shares * v_plan.owner_share_percentage / 100)::INTEGER - v_reserved_shares);
  IF v_investment.shares_purchased > v_available_shares
    OR v_investment.shares_purchased + v_user_reserved_shares > v_plan.max_shares_per_investor THEN
    RAISE EXCEPTION 'Requested shares are no longer available';
  END IF;

  v_amount := v_investment.shares_purchased * v_plan.shares_per_amount;
  UPDATE public.investments
  SET status = 'approved', amount = v_amount,
      expected_roi = v_amount * (v_plan.roi_percentage / 100) / 12 * v_plan.duration_months,
      approved_by = p_approved_by, notes = p_notes, request_reviewed_at = NOW(), updated_at = NOW()
  WHERE id = p_investment_id;

  RETURN QUERY SELECT p_investment_id, v_investment.shares_purchased, v_amount;
END;
$$;

CREATE OR REPLACE FUNCTION public.activate_paid_investment(
  p_investment_id UUID,
  p_verified_by UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_investment investments%ROWTYPE;
  v_plan investment_plans%ROWTYPE;
  v_start_date DATE := CURRENT_DATE;
BEGIN
  IF public.get_user_role(auth.uid()) <> 'owner' THEN
    RAISE EXCEPTION 'Only owners can confirm payments';
  END IF;

  SELECT * INTO v_investment FROM public.investments WHERE id = p_investment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Investment not found'; END IF;
  IF v_investment.status <> 'payment_submitted' THEN RAISE EXCEPTION 'A submitted bank payment is required'; END IF;

  SELECT * INTO v_plan FROM public.investment_plans WHERE id = v_investment.plan_id FOR UPDATE;
  UPDATE public.investments
  SET status = 'active', start_date = v_start_date,
      end_date = (v_start_date + (v_plan.duration_months || ' months')::INTERVAL)::DATE,
      lock_expires_at = NOW() + (GREATEST(v_investment.lock_period_days, 0) || ' days')::INTERVAL,
      notes = COALESCE(p_notes, notes), payment_verified_at = NOW(), updated_at = NOW()
  WHERE id = p_investment_id;

  INSERT INTO public.transactions (investment_id, user_id, type, amount, description)
  VALUES (v_investment.id, v_investment.user_id, 'deposit', v_investment.amount,
    'Verified bank deposit for ' || v_investment.shares_purchased || ' shares in ' || v_plan.name || ' plan');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_investment_request(UUID, UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.activate_paid_investment(UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_investment_request(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.activate_paid_investment(UUID, UUID, TEXT) TO authenticated;
