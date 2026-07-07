-- Check and fix the blog post author_id
-- First, let's see what profiles exist
-- Then update the blog post to use a valid author_id

-- Update the blog post to use the first available profile
UPDATE blog_posts
SET author_id = (
  SELECT id FROM profiles 
  WHERE role = 'owner' 
  LIMIT 1
)
WHERE author_id IS NULL 
   OR author_id NOT IN (SELECT id FROM profiles);

-- If no owner exists, use any profile
UPDATE blog_posts
SET author_id = (
  SELECT id FROM profiles 
  LIMIT 1
)
WHERE author_id IS NULL;
