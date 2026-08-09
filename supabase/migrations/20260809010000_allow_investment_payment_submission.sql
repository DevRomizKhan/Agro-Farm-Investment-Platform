-- Allow an investor to attach a bank receipt only after owner approval.
CREATE POLICY "Investors can submit approved investment payments"
  ON public.investments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'approved')
  WITH CHECK (auth.uid() = user_id AND status = 'payment_submitted');
