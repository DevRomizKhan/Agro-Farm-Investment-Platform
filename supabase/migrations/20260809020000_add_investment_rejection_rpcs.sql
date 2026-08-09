-- Owner decisions must bypass investor row-update policies while preserving owner authorization.

CREATE OR REPLACE FUNCTION public.reject_investment_request(
  p_investment_id UUID,
  p_rejected_by UUID,
  p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.get_user_role(auth.uid()) <> 'owner' THEN RAISE EXCEPTION 'Only owners can reject requests'; END IF;
  IF NULLIF(BTRIM(p_reason), '') IS NULL THEN RAISE EXCEPTION 'A rejection reason is required'; END IF;
  UPDATE public.investments
  SET status = 'rejected', notes = BTRIM(p_reason), approved_by = p_rejected_by,
      request_reviewed_at = NOW(), updated_at = NOW()
  WHERE id = p_investment_id AND status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Pending investment request not found'; END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_investment_payment(
  p_investment_id UUID,
  p_rejected_by UUID,
  p_reason TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.get_user_role(auth.uid()) <> 'owner' THEN RAISE EXCEPTION 'Only owners can reject payments'; END IF;
  IF NULLIF(BTRIM(p_reason), '') IS NULL THEN RAISE EXCEPTION 'A rejection reason is required'; END IF;
  UPDATE public.investments
  SET status = 'rejected', notes = BTRIM(p_reason), approved_by = p_rejected_by,
      payment_verified_at = NOW(), updated_at = NOW()
  WHERE id = p_investment_id AND status = 'payment_submitted';
  IF NOT FOUND THEN RAISE EXCEPTION 'Submitted payment not found'; END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reject_investment_request(UUID, UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reject_investment_payment(UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reject_investment_request(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_investment_payment(UUID, UUID, TEXT) TO authenticated;
