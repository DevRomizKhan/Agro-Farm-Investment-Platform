-- Create blog-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Public Read Access for blog-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-media');

-- Create policy for authenticated users to upload
CREATE POLICY "Authenticated Upload for blog-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-media');

-- Create policy for owners to manage files
CREATE POLICY "Owner Manage for blog-media"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'blog-media' AND auth.uid() IN (
  SELECT user_id FROM profiles WHERE role = 'owner'
))
WITH CHECK (bucket_id = 'blog-media' AND auth.uid() IN (
  SELECT user_id FROM profiles WHERE role = 'owner'
));
