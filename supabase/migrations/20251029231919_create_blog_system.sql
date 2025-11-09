/*
  # Create blog system tables for MentorEU

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Post title
      - `slug` (text, unique) - URL-friendly slug
      - `featured_image` (text) - URL to featured image
      - `author` (text) - Author name
      - `category` (text) - Post category
      - `tags` (text array) - Array of tags
      - `excerpt` (text) - Short excerpt (150 chars)
      - `content` (text) - Full post content (markdown)
      - `status` (text) - published or draft
      - `read_time` (text) - Estimated reading time
      - `meta_title` (text, optional) - SEO meta title
      - `meta_description` (text, optional) - SEO meta description
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `published_at` (timestamptz) - Publication timestamp
      - `user_id` (uuid) - Reference to auth.users
      
  2. Security
    - Enable RLS on `blog_posts` table
    - Public can read published posts
    - Only authenticated users can create/update/delete posts
    
  3. Indexes
    - Index on slug for fast lookups
    - Index on status and published_at for filtering
    - Index on category for filtering
    
  4. Notes
    - Posts can be drafts or published
    - Only published posts are visible to public
    - Authenticated users (admins) can manage all posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  featured_image text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  excerpt text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  read_time text DEFAULT '5 min',
  meta_title text,
  meta_description text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at DESC);

CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'published' AND OLD.status = 'draft' THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at_trigger
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();