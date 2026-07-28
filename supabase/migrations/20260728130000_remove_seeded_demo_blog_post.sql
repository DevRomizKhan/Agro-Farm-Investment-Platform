-- Remove the seeded demo article. Admin-created posts remain untouched.
DELETE FROM blog_posts
WHERE slug = 'future-sustainable-agriculture-bangladesh'
  AND title = 'The Future of Sustainable Agriculture in Bangladesh';
