/*
  # Create Landing Page CMS System

  1. New Tables
    - `landing_sections`
      - `id` (uuid, primary key) - Unique identifier
      - `section_key` (text, unique) - Unique key for each section (e.g., 'hero', 'feature_1')
      - `section_type` (text) - Type of section ('hero', 'feature', 'how_it_works', 'faq', 'footer')
      - `title` (text) - Section title
      - `subtitle` (text) - Section subtitle
      - `content` (text) - Main content/description
      - `image_url` (text) - Image URL for the section
      - `button_text` (text) - CTA button text
      - `button_link` (text) - CTA button link
      - `icon` (text) - Icon name for features
      - `order_number` (integer) - Display order
      - `is_active` (boolean) - Show/hide section
      - `metadata` (jsonb) - Additional flexible data
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      
  2. Security
    - Enable RLS on `landing_sections` table
    - Public can read active sections
    - Only authenticated users (admins) can create/update/delete
    
  3. Indexes
    - Index on section_key for fast lookups
    - Index on section_type and order_number for ordering
    
  4. Notes
    - All landing page content is editable from admin panel
    - Changes reflect immediately on the landing page
    - Metadata field allows for future extensibility
*/

CREATE TABLE IF NOT EXISTS landing_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  section_type text NOT NULL,
  title text,
  subtitle text,
  content text,
  image_url text,
  button_text text,
  button_link text,
  icon text,
  order_number integer DEFAULT 0,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE landing_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active landing sections"
  ON landing_sections
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all landing sections"
  ON landing_sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert landing sections"
  ON landing_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update landing sections"
  ON landing_sections
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete landing sections"
  ON landing_sections
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS landing_sections_key_idx ON landing_sections(section_key);
CREATE INDEX IF NOT EXISTS landing_sections_type_order_idx ON landing_sections(section_type, order_number);
CREATE INDEX IF NOT EXISTS landing_sections_active_idx ON landing_sections(is_active);

CREATE OR REPLACE FUNCTION update_landing_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER landing_sections_updated_at_trigger
  BEFORE UPDATE ON landing_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_sections_updated_at();