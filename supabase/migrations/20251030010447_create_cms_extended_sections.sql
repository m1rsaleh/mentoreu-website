/*
  # Extend Landing CMS for Footer, Contact Info, Countries, and Form Settings

  1. New Section Types
    - 'contact_info' - Footer and contact information
    - 'country' - Education countries list
    - 'form_settings' - Contact form field customization

  2. New Tables
    - `contact_info` - Stores footer and contact details
      - company_description (text)
      - email (text)
      - phone (text)
      - address (text)
      - instagram_url (text)
      - linkedin_url (text)
      - twitter_url (text)
      - facebook_url (text)
      - copyright_text (text)
      - privacy_policy_url (text)
      - terms_url (text)
    
    - `education_countries` - Stores country information
      - name (text)
      - flag_emoji (text)
      - link_url (text)
      - order_number (integer)
      - is_active (boolean)
    
    - `form_settings` - Stores contact form configuration
      - section_title (text)
      - section_description (text)
      - field_config (jsonb) - stores all field labels, placeholders, required status

  3. Security
    - Enable RLS on all new tables
    - Authenticated users can manage content
    - Public can read active content
*/

-- Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_description text DEFAULT 'Avrupa''da eğitim hayallerinizi gerçeğe dönüştürüyoruz. Kapsamlı danışmanlık hizmetlerimizle yanınızdayız.',
  email text DEFAULT 'info@mentoreu.com',
  phone text DEFAULT '+90 555 123 4567',
  address text DEFAULT 'İstanbul, Türkiye',
  instagram_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  twitter_url text DEFAULT '',
  facebook_url text DEFAULT '',
  copyright_text text DEFAULT '© 2025 MentorEU. Tüm hakları saklıdır.',
  privacy_policy_url text DEFAULT '/privacy',
  terms_url text DEFAULT '/terms',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Education Countries Table
CREATE TABLE IF NOT EXISTS education_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  flag_emoji text DEFAULT '🇪🇺',
  link_url text DEFAULT '',
  order_number integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Form Settings Table
CREATE TABLE IF NOT EXISTS form_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title text DEFAULT 'Ücretsiz Ön Değerlendirme İçin Başvurun',
  section_description text DEFAULT 'Formu doldurun, size en kısa sürede dönüş yapalım.',
  field_config jsonb DEFAULT '{
    "name": {"label": "Ad Soyad", "placeholder": "Adınız ve soyadınız", "required": true},
    "email": {"label": "E-posta", "placeholder": "ornek@email.com", "required": true},
    "phone": {"label": "Telefon", "placeholder": "+90 555 123 4567", "required": true},
    "education_status": {"label": "Eğitim Durumu", "placeholder": "Lise, Üniversite, vb.", "required": true},
    "target_country": {"label": "Hedef Ülke", "placeholder": "Almanya, İtalya, vb.", "required": true},
    "message": {"label": "Mesajınız", "placeholder": "Bize anlatmak istedikleriniz...", "required": false}
  }'::jsonb,
  submit_button_text text DEFAULT 'Başvurumu Gönder',
  success_message text DEFAULT 'Başvurunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.',
  privacy_notice text DEFAULT 'Kişisel verileriniz gizlilik politikamız çerçevesinde korunmaktadır.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default data
INSERT INTO contact_info (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO form_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Insert default countries
INSERT INTO education_countries (name, flag_emoji, order_number) VALUES
  ('Almanya', '🇩🇪', 1),
  ('İtalya', '🇮🇹', 2),
  ('Hollanda', '🇳🇱', 3),
  ('Fransa', '🇫🇷', 4),
  ('İspanya', '🇪🇸', 5)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_settings ENABLE ROW LEVEL SECURITY;

-- Contact Info Policies
CREATE POLICY "Public can read contact info"
  ON contact_info FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update contact info"
  ON contact_info FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Education Countries Policies
CREATE POLICY "Public can read active countries"
  ON education_countries FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all countries"
  ON education_countries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert countries"
  ON education_countries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update countries"
  ON education_countries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete countries"
  ON education_countries FOR DELETE
  TO authenticated
  USING (true);

-- Form Settings Policies
CREATE POLICY "Public can read form settings"
  ON form_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update form settings"
  ON form_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
