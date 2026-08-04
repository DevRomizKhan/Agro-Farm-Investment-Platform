-- Store public contact and newsletter submissions for owner follow-up.
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'newsletter')),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'contacted', 'resolved', 'unsubscribed', 'archived')),
  notes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  handled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  handled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT contact_submissions_email_length CHECK (char_length(email) BETWEEN 3 AND 320),
  CONSTRAINT contact_submissions_name_length CHECK (name IS NULL OR char_length(name) BETWEEN 2 AND 120),
  CONSTRAINT contact_submissions_phone_length CHECK (phone IS NULL OR char_length(phone) BETWEEN 5 AND 30),
  CONSTRAINT contact_submissions_message_length CHECK (message IS NULL OR char_length(message) <= 5000),
  CONSTRAINT contact_submissions_notes_length CHECK (notes IS NULL OR char_length(notes) <= 5000)
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_type ON public.contact_submissions(type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact requests"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Owners can view contact requests" ON public.contact_submissions;
CREATE POLICY "Owners can view contact requests"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (public.get_user_role((SELECT auth.uid())) = 'owner');

DROP POLICY IF EXISTS "Owners can update contact requests" ON public.contact_submissions;
CREATE POLICY "Owners can update contact requests"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (public.get_user_role((SELECT auth.uid())) = 'owner')
  WITH CHECK (public.get_user_role((SELECT auth.uid())) = 'owner');

DROP POLICY IF EXISTS "Owners can delete contact requests" ON public.contact_submissions;
CREATE POLICY "Owners can delete contact requests"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (public.get_user_role((SELECT auth.uid())) = 'owner');

GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
