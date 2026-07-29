-- ============================================================
-- Migration: 003_add_share_based_investment.sql
-- Adds share-based investment structure and withdrawal system
-- ============================================================

-- Update investment_plans table for share-based structure
ALTER TABLE investment_plans
  ADD COLUMN IF NOT EXISTS total_shares INTEGER NOT NULL DEFAULT 150,
  ADD COLUMN IF NOT EXISTS shares_per_amount INTEGER NOT NULL DEFAULT 10000,
  ADD COLUMN IF NOT EXISTS owner_share_percentage NUMERIC(5,2) NOT NULL DEFAULT 40.0,
  ADD COLUMN IF NOT EXISTS max_shares_per_investor INTEGER NOT NULL DEFAULT 30,
  DROP COLUMN IF EXISTS min_amount,
  DROP COLUMN IF EXISTS max_amount;

-- Add share-related columns to investments table
ALTER TABLE investments
  ADD COLUMN IF NOT EXISTS shares_purchased INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lock_period_days INTEGER NOT NULL DEFAULT 366,
  ADD COLUMN IF NOT EXISTS lock_expires_at TIMESTAMPTZ;

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  withdrawal_type TEXT NOT NULL CHECK (withdrawal_type IN ('profit_only', 'full_amount')),
  status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
  request_reason TEXT,
  owner_response TEXT,
  owner_response_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_withdrawal_requests_investment_id ON withdrawal_requests(investment_id);
CREATE INDEX idx_withdrawal_requests_user_id ON withdrawal_requests(user_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

-- Add trigger for updated_at on withdrawal_requests
CREATE TRIGGER update_withdrawal_requests_updated_at
  BEFORE UPDATE ON withdrawal_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update RLS for withdrawal_requests
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own withdrawal requests"
  ON withdrawal_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
  ON withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their pending withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

CREATE POLICY "Owners can view all withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owners can manage withdrawal requests"
  ON withdrawal_requests FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- Update existing investment_plans with new share structure
UPDATE investment_plans
SET 
  total_shares = 150,
  shares_per_amount = 10000,
  owner_share_percentage = 40.0,
  max_shares_per_investor = 30
WHERE total_shares IS NULL;
