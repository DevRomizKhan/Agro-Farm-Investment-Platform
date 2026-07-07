-- Insert a sample blog post
-- First, get the owner's profile ID (you may need to adjust this)
-- This assumes there's at least one owner profile in the system

WITH owner_profile AS (
  SELECT id FROM profiles WHERE role = 'owner' LIMIT 1
)
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author_id,
  category,
  tags,
  meta_title,
  meta_description,
  meta_keywords,
  status,
  published_at
)
SELECT 
  'The Future of Sustainable Agriculture in Bangladesh',
  'future-sustainable-agriculture-bangladesh',
  'Discover how sustainable farming practices are transforming Bangladesh''s agricultural landscape and creating investment opportunities.',
  '<h2>Introduction</h2>
<p>Bangladesh''s agricultural sector is undergoing a remarkable transformation. With the adoption of sustainable farming practices, the country is not only increasing food production but also creating new investment opportunities for forward-thinking investors.</p>

<h2>Why Sustainable Agriculture Matters</h2>
<p>Sustainable agriculture focuses on farming practices that protect the environment, public health, and animal welfare while producing food economically. In Bangladesh, this approach is particularly crucial due to:</p>
<ul>
<li>Climate change challenges affecting traditional farming</li>
<li>Growing population requiring increased food production</li>
<li>Need for economic growth in rural areas</li>
<li>Preservation of natural resources for future generations</li>
</ul>

<h2>Investment Opportunities</h2>
<p>The shift toward sustainable agriculture opens numerous investment avenues:</p>

<h3>1. Organic Farming</h3>
<p>Organic produce demand is growing globally. Investing in organic farms in Bangladesh can yield significant returns as international markets increasingly seek certified organic products.</p>

<h3>2. Agri-Tech Solutions</h3>
<p>Technology-driven farming solutions, including precision agriculture, IoT sensors, and automated irrigation systems, are revolutionizing how we farm. These technologies reduce waste and increase yields.</p>

<h3>3. Renewable Energy Integration</h3>
<p>Solar-powered irrigation systems and biomass energy production are making farms more self-sufficient and reducing operational costs.</p>

<h2>Success Stories</h2>
<p>Several agricultural projects in Bangladesh have already demonstrated the viability of sustainable practices:</p>
<ul>
<li>Rice farmers using System of Rice Intensification (SRI) have reported 30-50% higher yields with less water</li>
<li>Vertical farming initiatives in urban areas are producing fresh vegetables year-round</li>
<li>Coffee and tea plantations adopting shade-grown practices are receiving premium prices</li>
</ul>

<h2>Getting Started</h2>
<p>For investors looking to enter this sector, consider:</p>
<ol>
<li>Researching specific agricultural sub-sectors that align with your investment goals</li>
<li>Understanding local regulations and support programs</li>
<li>Partnering with experienced agricultural experts</li>
<li>Starting with pilot projects before scaling up</li>
</ol>

<h2>Conclusion</h2>
<p>The future of agriculture in Bangladesh is sustainable, and the time to invest is now. By supporting environmentally responsible farming practices, investors can achieve financial returns while contributing to food security and environmental conservation.</p>',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=630&fit=crop',
  (SELECT id FROM owner_profile),
  'Agriculture',
  ARRAY['sustainable farming', 'investment', 'Bangladesh', 'agriculture', 'green energy'],
  'The Future of Sustainable Agriculture in Bangladesh | NHK Agro Invest',
  'Learn about sustainable farming opportunities in Bangladesh and how agricultural investments are transforming the sector.',
  ARRAY['sustainable agriculture', 'farming investment', 'Bangladesh agriculture', 'green farming', 'agri-tech'],
  'published',
  NOW()
FROM owner_profile
WHERE EXISTS (SELECT 1 FROM owner_profile);
