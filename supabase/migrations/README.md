# Migration notes

The three `add_production_blog_schema` files from July 2026 are retained as
empty historical placeholders because their versions may already exist in the
remote Supabase migration history. They must not be edited or reused.

The debug-only migration was removed. Future diagnostics belong in scripts or
SQL run manually, never in the migration history.
