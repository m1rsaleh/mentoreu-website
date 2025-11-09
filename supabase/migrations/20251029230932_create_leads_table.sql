/*
  # Create leads table for MentorEU consultancy platform

  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `full_name` (text) - Full name of the applicant
      - `email` (text) - Email address
      - `phone` (text) - Phone number
      - `education_status` (text) - Current education status (Lise or Üniversite Son Sınıf)
      - `target_countries` (text array) - Array of target countries for study
      - `message` (text, optional) - Additional message from applicant
      - `created_at` (timestamptz) - Timestamp of submission
      
  2. Security
    - Enable RLS on `leads` table
    - Add policy to allow anyone to insert leads (public form submission)
    - Add policy for authenticated admin users to read all leads
    
  3. Notes
    - This table stores lead information from the contact form
    - Public can insert (form submissions) but cannot read
    - Only authenticated users (admin dashboard) can view leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  education_status text NOT NULL,
  target_countries text[] NOT NULL DEFAULT '{}',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);