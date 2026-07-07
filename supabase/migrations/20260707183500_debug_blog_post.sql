-- Debug: Check if the blog post exists and its author_id
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  bp.author_id,
  bp.status,
  p.id as profile_id,
  p.role,
  p.full_name
FROM blog_posts bp
LEFT JOIN profiles p ON bp.author_id = p.id
WHERE bp.slug = 'future-sustainable-agriculture-bangladesh';
