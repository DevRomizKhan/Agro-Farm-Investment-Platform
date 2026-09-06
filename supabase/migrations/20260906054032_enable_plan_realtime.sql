-- Broadcast plan creates, edits, and removals to open plan-aware screens.
-- The catalog is public already; Realtime only triggers a server refresh and
-- does not grant any additional write access.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'investment_plans'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.investment_plans;
  END IF;
END
$$;
