/*
  # Add WhatsApp and Email Notification Settings

  1. New Tables
    - `whatsapp_settings` - WhatsApp button configuration
      - phone_number (text) - e.g., "905551234567"
      - default_message (text)
      - is_enabled (boolean)
      - button_text (text)
    
    - `email_settings` - EmailJS configuration
      - service_id (text) - EmailJS service ID
      - public_key (text) - EmailJS public key
      - admin_notification_enabled (boolean)
      - admin_template_id (text)
      - admin_emails (text[]) - Array of admin emails
      - student_autoresponse_enabled (boolean)
      - student_template_id (text)
      - student_subject (text)
      - reply_to_email (text)

  2. Security
    - Enable RLS on all tables
    - Public can read WhatsApp settings
    - Authenticated users can manage both tables
*/

-- WhatsApp Settings Table
CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text DEFAULT '905551234567',
  default_message text DEFAULT 'Merhaba, MentorEU hakkında bilgi almak istiyorum.',
  is_enabled boolean DEFAULT true,
  button_text text DEFAULT 'WhatsApp ile İletişim',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email Settings Table
CREATE TABLE IF NOT EXISTS email_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text DEFAULT '',
  public_key text DEFAULT '',
  admin_notification_enabled boolean DEFAULT true,
  admin_template_id text DEFAULT 'form_submission_admin',
  admin_emails text[] DEFAULT ARRAY['admin@mentoreu.com'],
  student_autoresponse_enabled boolean DEFAULT true,
  student_template_id text DEFAULT 'form_submission_student',
  student_subject text DEFAULT 'Başvurunuz Alındı - MentorEU',
  reply_to_email text DEFAULT 'info@mentoreu.com',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default WhatsApp settings
INSERT INTO whatsapp_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Insert default Email settings
INSERT INTO email_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- WhatsApp Settings Policies
CREATE POLICY "Public can read whatsapp settings"
  ON whatsapp_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage whatsapp settings"
  ON whatsapp_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Email Settings Policies
CREATE POLICY "Authenticated users can read email settings"
  ON email_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage email settings"
  ON email_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
