-- Investor exit workflow: profit/full withdrawal and owner-facilitated share transfer.
ALTER TABLE public.withdrawal_requests
  ADD COLUMN IF NOT EXISTS transfer_recipient_user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS transfer_recipient_email TEXT,
  ADD COLUMN IF NOT EXISTS transfer_shares INTEGER;

ALTER TABLE public.withdrawal_requests DROP CONSTRAINT IF EXISTS withdrawal_requests_withdrawal_type_check;
ALTER TABLE public.withdrawal_requests
  ADD CONSTRAINT withdrawal_requests_withdrawal_type_check
  CHECK (withdrawal_type IN ('profit_only', 'full_amount', 'share_transfer'));

ALTER TABLE public.withdrawal_requests
  ADD CONSTRAINT withdrawal_requests_transfer_fields_check CHECK (
    (withdrawal_type = 'share_transfer' AND transfer_shares IS NOT NULL AND transfer_shares > 0 AND transfer_recipient_user_id IS NOT NULL)
    OR (withdrawal_type <> 'share_transfer')
  );

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_recipient
  ON public.withdrawal_requests(transfer_recipient_user_id);

-- The earlier trigger function was defined for INSERT and UPDATE but used OLD
-- unconditionally. Transfers can create a new recipient holding, so make both
-- trigger paths safe.
CREATE OR REPLACE FUNCTION public.enforce_single_max_holder()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_max_shares INTEGER;
  v_existing_max_holder BOOLEAN;
  v_earlier_max_request BOOLEAN;
  v_new_created_at TIMESTAMPTZ := COALESCE(NEW.created_at, NOW());
BEGIN
  IF NEW.status <> 'active' THEN RETURN NEW; END IF;

  SELECT max_shares_per_investor INTO v_max_shares
  FROM public.investment_plans WHERE id = NEW.plan_id;
  IF NEW.shares_purchased < v_max_shares THEN RETURN NEW; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.investments i
    WHERE i.plan_id = NEW.plan_id AND i.status = 'active' AND i.user_id <> NEW.user_id
    GROUP BY i.user_id HAVING SUM(GREATEST(i.shares_purchased, 0)) >= v_max_shares
  ) INTO v_existing_max_holder;
  IF v_existing_max_holder THEN
    RAISE EXCEPTION 'Only one investor can receive the maximum shares for this plan';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.investments p
    WHERE p.plan_id = NEW.plan_id AND p.status = 'pending' AND p.user_id <> NEW.user_id
      AND p.shares_purchased >= v_max_shares
      AND (p.created_at < v_new_created_at OR (p.created_at = v_new_created_at AND p.id < NEW.id))
  ) INTO v_earlier_max_request;
  IF v_earlier_max_request THEN
    RAISE EXCEPTION 'An earlier maximum-share request has priority for this plan';
  END IF;
  RETURN NEW;
END;
$$;

-- Keep request completion atomic. The owner action only calls this function after
-- the request has been reviewed; this prevents half-completed share transfers.
CREATE OR REPLACE FUNCTION public.complete_withdrawal_request(
  p_request_id UUID,
  p_owner_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request public.withdrawal_requests%ROWTYPE;
  v_source public.investments%ROWTYPE;
  v_recipient public.investments%ROWTYPE;
  v_owner_profile UUID;
  v_unit_amount NUMERIC(15,2);
  v_transfer_amount NUMERIC(15,2);
BEGIN
  IF public.get_user_role(p_owner_user_id) <> 'owner' OR auth.uid() <> p_owner_user_id THEN
    RAISE EXCEPTION 'Only the authenticated owner can complete withdrawals';
  END IF;

  SELECT * INTO v_request FROM public.withdrawal_requests WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND OR v_request.status <> 'approved' THEN
    RAISE EXCEPTION 'Only approved withdrawal requests can be completed';
  END IF;

  SELECT * INTO v_source FROM public.investments WHERE id = v_request.investment_id FOR UPDATE;
  IF NOT FOUND OR v_source.status <> 'active' THEN
    RAISE EXCEPTION 'The source investment is no longer active';
  END IF;

  SELECT id INTO v_owner_profile FROM public.profiles WHERE user_id = p_owner_user_id LIMIT 1;

  IF v_request.withdrawal_type = 'share_transfer' THEN
    IF v_request.transfer_shares > v_source.shares_purchased THEN
      RAISE EXCEPTION 'Transfer shares exceed the investor balance';
    END IF;

    v_unit_amount := v_source.amount / NULLIF(v_source.shares_purchased, 0);
    v_transfer_amount := ROUND(v_unit_amount * v_request.transfer_shares, 2);

    IF (
      SELECT COALESCE(SUM(i.shares_purchased), 0) + v_request.transfer_shares
      FROM public.investments i
      WHERE i.user_id = v_request.transfer_recipient_user_id
        AND i.plan_id = v_source.plan_id
        AND i.status = 'active'
    ) > (SELECT max_shares_per_investor FROM public.investment_plans WHERE id = v_source.plan_id) THEN
      RAISE EXCEPTION 'The recipient would exceed the maximum shares allowed for this plan';
    END IF;

    SELECT * INTO v_recipient
    FROM public.investments
    WHERE user_id = v_request.transfer_recipient_user_id
      AND plan_id = v_source.plan_id
      AND status = 'active'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE;

    UPDATE public.investments
    SET shares_purchased = shares_purchased - v_request.transfer_shares,
        amount = GREATEST(0, amount - v_transfer_amount),
        expected_roi = GREATEST(0, expected_roi - (expected_roi / NULLIF(shares_purchased, 0) * v_request.transfer_shares)),
        status = CASE WHEN shares_purchased - v_request.transfer_shares <= 0 THEN 'completed' ELSE status END,
        updated_at = NOW()
    WHERE id = v_source.id;

    IF FOUND AND v_recipient.id IS NOT NULL THEN
      UPDATE public.investments
      SET shares_purchased = shares_purchased + v_request.transfer_shares,
          amount = amount + v_transfer_amount,
          expected_roi = expected_roi + (v_source.expected_roi / NULLIF(v_source.shares_purchased, 0) * v_request.transfer_shares),
          updated_at = NOW()
      WHERE id = v_recipient.id;
    ELSE
      INSERT INTO public.investments (
        user_id, plan_id, amount, shares_purchased, lock_period_days,
        lock_expires_at, status, start_date, end_date, expected_roi,
        actual_roi, approved_by, notes
      ) VALUES (
        v_request.transfer_recipient_user_id, v_source.plan_id, v_transfer_amount,
        v_request.transfer_shares, 0, NOW(), 'active', CURRENT_DATE,
        v_source.end_date, (v_source.expected_roi / NULLIF(v_source.shares_purchased, 0) * v_request.transfer_shares),
        0, v_owner_profile, 'Shares received through approved transfer'
      );
    END IF;

    INSERT INTO public.transactions (investment_id, user_id, type, amount, description)
    VALUES (v_source.id, v_source.user_id, 'withdrawal', v_transfer_amount, 'Shares transferred to approved recipient');
  ELSE
    INSERT INTO public.transactions (investment_id, user_id, type, amount, description)
    VALUES (v_source.id, v_source.user_id, 'withdrawal', v_request.amount, 'Withdrawal completed - ' || v_request.withdrawal_type);

    IF v_request.withdrawal_type = 'full_amount' THEN
      UPDATE public.investments SET status = 'completed', updated_at = NOW() WHERE id = v_source.id;
    END IF;
  END IF;

  UPDATE public.withdrawal_requests
  SET status = 'completed', completed_at = NOW(), updated_at = NOW()
  WHERE id = p_request_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.complete_withdrawal_request(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_withdrawal_request(UUID, UUID) TO authenticated;
