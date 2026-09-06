-- Owner-configurable public content for investment plan cards.
ALTER TABLE public.investment_plans
  ADD COLUMN IF NOT EXISTS display_label TEXT,
  ADD COLUMN IF NOT EXISTS highlights TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.investment_plans
  DROP CONSTRAINT IF EXISTS investment_plans_display_label_length_check,
  DROP CONSTRAINT IF EXISTS investment_plans_highlights_limit_check;

ALTER TABLE public.investment_plans
  ADD CONSTRAINT investment_plans_display_label_length_check
    CHECK (display_label IS NULL OR char_length(display_label) <= 80),
  ADD CONSTRAINT investment_plans_highlights_limit_check
    CHECK (cardinality(highlights) <= 6);

COMMENT ON COLUMN public.investment_plans.display_label IS
  'Optional short label displayed above the plan name on public plan cards.';
COMMENT ON COLUMN public.investment_plans.highlights IS
  'Owner-entered public plan highlights, displayed as bullet points.';
COMMENT ON COLUMN public.investment_plans.is_featured IS
  'Whether this plan is visually featured on public plan cards.';
