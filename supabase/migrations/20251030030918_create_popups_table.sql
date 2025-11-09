/*
  # Create popups table

  1. New Tables
    - `popups`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `button_text` (text)
      - `button_link` (text)
      - `show_delay` (integer) - delay in seconds
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `popups` table
    - Add policy for public read access to active popups
    - Add policy for authenticated admin users to manage popups
*/

CREATE TABLE IF NOT EXISTS popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  button_text text DEFAULT 'Devam Et',
  button_link text DEFAULT '',
  show_delay integer DEFAULT 3,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active popups"
  ON popups
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage popups"
  ON popups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);