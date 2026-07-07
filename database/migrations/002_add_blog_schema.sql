-- ============================================================
-- NHK Agro Invest — Blog Schema
-- Migration: 002_add_blog_schema.sql
-- ============================================================

-- ============================================================
-- BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  featured_image  TEXT,
  author_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category        TEXT,
  tags            TEXT[],
  meta_title      TEXT,
  meta_description TEXT,
  meta_keywords   TEXT[],
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

-- ============================================================
-- BLOG MEDIA TABLE (for images, PDFs, videos)
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_media (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_post_id  UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  file_url      TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  file_type     TEXT NOT NULL,
  file_size     INTEGER NOT NULL,
  mime_type     TEXT NOT NULL,
  alt_text      TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_media_post_id ON blog_media(blog_post_id);
CREATE INDEX idx_blog_media_file_type ON blog_media(file_type);

-- ============================================================
-- UPDATED_AT TRIGGER FOR BLOG TABLES
-- ============================================================
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY FOR BLOG TABLES
-- ============================================================

-- Blog Posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT USING (status = 'published');

CREATE POLICY "Owners can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owners can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- Blog Media
ALTER TABLE blog_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media for published posts"
  ON blog_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts bp
      WHERE bp.id = blog_media.blog_post_id AND bp.status = 'published'
    )
  );

CREATE POLICY "Owners can view all blog media"
  ON blog_media FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owners can manage blog media"
  ON blog_media FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'owner')
  WITH CHECK (public.get_user_role(auth.uid()) = 'owner');

-- ============================================================
-- HELPER FUNCTION: Generate unique slug
-- ============================================================
CREATE OR REPLACE FUNCTION generate_unique_slug(base_title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  counter INTEGER := 0;
  candidate_slug TEXT;
  slug_exists BOOLEAN;
BEGIN
  -- Generate base slug from title
  base_slug := lower(regexp_replace(base_title, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(trailing '-' from base_slug);
  
  candidate_slug := base_slug;
  
  -- Check if slug exists and append number if needed
  LOOP
    SELECT EXISTS(SELECT 1 FROM blog_posts WHERE slug = candidate_slug) INTO slug_exists;
    
    IF NOT slug_exists THEN
      RETURN candidate_slug;
    END IF;
    
    counter := counter + 1;
    candidate_slug := base_slug || '-' || counter;
  END LOOP;
END;
$$;
