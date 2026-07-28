-- Restore the three carousel blog posts after an accidental deletion.
-- Safe to run repeatedly: existing slugs are left unchanged.
WITH owner_profile AS (
  SELECT id
  FROM profiles
  WHERE role = 'owner'
  ORDER BY created_at ASC
  LIMIT 1
),
seed_posts (title, slug, excerpt, content, featured_image, category, tags, meta_title, meta_description, meta_keywords) AS (
  VALUES
    (
      'Building a Stronger Future Through Responsible Cattle Farming',
      'building-a-stronger-future-through-responsible-cattle-farming',
      'Discover how well-managed cattle farms create real economic value while supporting farmers, families, and food security in Bangladesh.',
      '<p>Responsible cattle farming is more than raising healthy livestock. It is a long-term approach to building resilient rural businesses, strengthening local supply chains, and supporting food security.</p><p>At Amanah Farm, each project is managed with clear operational standards, careful animal welfare practices, and transparent reporting. This helps investors understand how their capital is connected to productive, asset-backed agriculture.</p><h2>Investing in productive assets</h2><p>When cattle are managed responsibly, value is created through disciplined feeding, veterinary care, farm operations, and strong market relationships. The result is a farming model designed for sustainable growth rather than short-term speculation.</p>',
      '/images/carousel/slide1.jpg',
      'Agriculture',
      ARRAY['cattle farming', 'responsible investment', 'Bangladesh agriculture'],
      'Responsible Cattle Farming and Agricultural Investment',
      'Learn how responsible cattle farming supports sustainable agricultural investment and food security in Bangladesh.',
      ARRAY['cattle farming', 'agricultural investment', 'Bangladesh', 'food security']
    ),
    (
      'Inside a Modern Livestock Operation',
      'inside-a-modern-livestock-operation',
      'From daily care to farm infrastructure, see the practices that help create healthy livestock and dependable agricultural operations.',
      '<p>A modern livestock operation combines traditional farming knowledge with consistent processes. Clean facilities, nutritious feed, reliable water, and regular veterinary supervision all contribute to healthier animals and better farm performance.</p><p>Strong infrastructure also makes day-to-day operations easier to monitor. Well-designed shelters and organized handling areas help farm teams work safely while maintaining high standards of animal care.</p><h2>Transparency from farm to investor</h2><p>Clear operating procedures make it possible to measure progress and communicate responsibly. This is why practical farm management and transparent reporting are central to building trust with every investor.</p>',
      '/images/carousel/slide2.jpg',
      'Smart Farming',
      ARRAY['livestock management', 'farm operations', 'animal welfare'],
      'Modern Livestock Operations and Smart Farm Management',
      'Explore the farm management practices that support healthy livestock and dependable agricultural operations.',
      ARRAY['livestock management', 'smart farming', 'animal welfare', 'farm operations']
    ),
    (
      'Why Sustainable Agriculture Matters for Bangladesh',
      'why-sustainable-agriculture-matters-for-bangladesh',
      'Sustainable agriculture can connect responsible capital with stronger rural communities and a more resilient food system.',
      '<p>Bangladesh has a deep agricultural heritage and a growing need for efficient, sustainable food production. Supporting responsible farms helps create opportunity in rural communities while meeting the needs of a growing population.</p><p>Sustainability means balancing financial discipline with care for land, animals, people, and future generations. It includes using resources thoughtfully, improving farm productivity, and investing in systems that can operate reliably over time.</p><h2>A shared opportunity</h2><p>When investors and experienced farm operators work together, capital can support productive assets and meaningful local impact. This shared approach is at the heart of building a stronger agricultural economy in Bangladesh.</p>',
      '/images/carousel/slide3.jpg',
      'Sustainable Farming',
      ARRAY['sustainable agriculture', 'rural development', 'ethical investing'],
      'Sustainable Agriculture and Ethical Investment in Bangladesh',
      'Understand how sustainable agriculture supports rural development, food security, and ethical investment in Bangladesh.',
      ARRAY['sustainable agriculture', 'ethical investing', 'Bangladesh', 'rural development']
    )
)
INSERT INTO blog_posts (
  title, slug, excerpt, content, featured_image, author_id, category, tags,
  meta_title, meta_description, meta_keywords, status, published_at
)
SELECT seed.title, seed.slug, seed.excerpt, seed.content, seed.featured_image,
  owner.id, seed.category, seed.tags, seed.meta_title, seed.meta_description,
  seed.meta_keywords, 'published', NOW()
FROM seed_posts AS seed
CROSS JOIN owner_profile AS owner
ON CONFLICT (slug) DO NOTHING;
