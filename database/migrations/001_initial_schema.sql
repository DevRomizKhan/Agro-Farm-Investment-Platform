-- ============================================================
-- NHK Agro Invest — Full Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  avatar_url      TEXT,
  role            TEXT NOT NULL DEFAULT 'investor' CHECK (role IN ('owner', 'investor')),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================
-- INVESTMENT PLANS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS investment_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT,
  min_amount      NUMERIC(15,2) NOT NULL CHECK (min_amount > 0),
  max_amount      NUMERIC(15,2) NOT NULL CHECK (max_amount >= min_amount),
  roi_percentage  NUMERIC(5,2) NOT NULL CHECK (roi_percentage > 0 AND roi_percentage <= 100),
  duration_months INTEGER NOT NULL CHECK (duration_months > 0),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plans_is_active ON investment_plans(is_active);
CREATE INDEX idx_plans_created_by ON investment_plans(created_by);

-- ============================================================
-- KYC SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS kyc_submissions (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status                    TEXT NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'approved', 'rejected')),
  -- Personal Information
  full_name                 TEXT NOT NULL,
  father_name               TEXT NOT NULL,
  mother_name               TEXT NOT NULL,
  date_of_birth             DATE NOT NULL,
  gender                    TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  national_id               TEXT NOT NULL,
  mobile_number             TEXT NOT NULL,
  email                     TEXT NOT NULL,
  occupation                TEXT NOT NULL,
  -- Addresses
  present_address           TEXT NOT NULL,
  permanent_address         TEXT NOT NULL,
  -- Emergency Contact
  emergency_contact_name    TEXT NOT NULL,
  emergency_contact_relation TEXT NOT NULL,
  emergency_contact_phone   TEXT NOT NULL,
  -- Nominee
  nominee_name              TEXT NOT NULL,
  nominee_relation          TEXT NOT NULL,
  nominee_phone             TEXT NOT NULL,
  -- Bank Details
  bank_name                 TEXT NOT NULL,
  bank_account_number       TEXT NOT NULL,
  bank_branch               TEXT NOT NULL,
  bank_routing              TEXT,
  -- Review Info
  reviewed_by               UUID REFERENCES profiles(id),
  reviewed_at               TIMESTAMPTZ,
  rejection_reason          TEXT,
  notes                     TEXT,
  submitted_at              TIMESTAMPTZ DEFAULT NOW(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kyc_user_id ON kyc_submissions(user_id);
CREATE INDEX idx_kyc_status ON kyc_submissions(status);
CREATE INDEX idx_kyc_submitted_at ON kyc_submissions(submitted_at DESC);

-- ============================================================
-- KYC DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS kyc_documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kyc_id        UUID NOT NULL REFERENCES kyc_submissions(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('photo', 'nid_front', 'nid_back', 'selfie')),
  file_url      TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_size     INTEGER NOT NULL,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kyc_docs_kyc_id ON kyc_documents(kyc_id);

-- ============================================================
-- INVESTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS investments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id       UUID NOT NULL REFERENCES investment_plans(id),
  amount        NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('active', 'completed', 'cancelled', 'pending')),
  start_date    DATE,
  end_date      DATE,
  expected_roi  NUMERIC(15,2) NOT NULL DEFAULT 0,
  actual_roi    NUMERIC(15,2) NOT NULL DEFAULT 0,
  receipt_url   TEXT,
  notes         TEXT,
  approved_by   UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_plan_id ON investments(plan_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_created_at ON investments(created_at DESC);

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id   UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'roi', 'refund')),
  amount          NUMERIC(15,2) NOT NULL,
  description     TEXT,
  reference       TEXT UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_investment_id ON transactions(investment_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'system'
                CHECK (type IN ('kyc', 'investment', 'transaction', 'system', 'announcement')),
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  action_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id),
  action          TEXT NOT NULL,
  resource_type   TEXT NOT NULL,
  resource_id     TEXT,
  old_data        JSONB,
  new_data        JSONB,
  ip_address      INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_plans_updated_at
  BEFORE UPDATE ON investment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_submissions_updated_at
  BEFORE UPDATE ON kyc_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROLE HELPER FUNCTION (avoids RLS infinite recursion)
-- SECURITY DEFINER bypasses RLS so policies that check the
-- user's role don't recursively trigger themselves.
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_role(uid UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = uid LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_user_role(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;

-- ============================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'investor')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

-- Investment Plans (public read, owner write)
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
  ON investment_plans FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Owners can view all plans"
  ON investment_plans FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owners can manage plans"
  ON investment_plans FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- KYC Submissions
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own KYC"
  ON kyc_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC"
  ON kyc_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending KYC"
  ON kyc_submissions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Owners can view all KYC"
  ON kyc_submissions FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owners can update any KYC"
  ON kyc_submissions FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- KYC Documents
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own KYC documents"
  ON kyc_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM kyc_submissions k
      WHERE k.id = kyc_documents.kyc_id AND k.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own KYC documents"
  ON kyc_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kyc_submissions k
      WHERE k.id = kyc_documents.kyc_id AND k.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can view all KYC documents"
  ON kyc_documents FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

-- Investments
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own investments"
  ON investments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create investments"
  ON investments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can view all investments"
  ON investments FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owners can manage investments"
  ON investments FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owners can manage transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owners can manage all notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- Audit Logs (read-only for owners)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

-- ============================================================
-- SEED: Default Investment Plans
-- ============================================================
-- Note: Run after the owner profile is created manually
-- INSERT INTO investment_plans (name, description, min_amount, max_amount, roi_percentage, duration_months, created_by)
-- VALUES
--   ('Starter Plan', 'Perfect for new investors.', 10000, 100000, 12, 12, '<owner_profile_id>'),
--   ('Growth Plan', 'Balanced risk and return.', 100000, 500000, 15, 18, '<owner_profile_id>'),
--   ('Premium Plan', 'Maximum returns for serious investors.', 500000, 5000000, 18, 24, '<owner_profile_id>');
