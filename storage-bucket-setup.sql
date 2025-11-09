-- Supabase Storage Bucket Setup for Images
-- Run this in your Supabase SQL Editor to create the storage buckets

-- Note: Storage buckets are typically created via the Supabase Dashboard UI:

-- BUCKET 1: Landing Images
-- 1. Go to Storage section in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: landing-images
-- 4. Public bucket: YES
-- 5. File size limit: 5MB
-- 6. Allowed MIME types: image/jpeg, image/png, image/webp

-- BUCKET 2: Blog Images
-- 1. Go to Storage section in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: blog-images
-- 4. Public bucket: YES
-- 5. File size limit: 5MB
-- 6. Allowed MIME types: image/jpeg, image/png, image/webp

-- Alternatively, you can create it programmatically:
-- But this requires admin privileges and is best done through the dashboard

-- After creating the bucket, set up storage policies:

-- Policy to allow authenticated users to upload
-- (This will be done automatically by the ImageUpload component)

-- Policy to allow public read access
-- (This is set when creating a public bucket)

-- Manual Policy Creation (if needed):
/*
-- Insert storage policies for landing-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-images', 'landing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Insert storage policies for blog-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Landing Images Policies
CREATE POLICY "Authenticated users can upload landing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'landing-images');

CREATE POLICY "Authenticated users can update landing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'landing-images');

CREATE POLICY "Authenticated users can delete landing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'landing-images');

CREATE POLICY "Public can view landing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'landing-images');

-- Blog Images Policies
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
*/
