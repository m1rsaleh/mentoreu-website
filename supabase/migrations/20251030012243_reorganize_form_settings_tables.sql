/*
  # Reorganize Form Settings - Separate Form and Footer Concerns

  1. New Tables for Form-Specific Data
    - `form_field_config` - Individual form field settings
      - field_name (text) - e.g., 'name', 'email', 'phone'
      - label_text (text) - Visible label
      - placeholder_text (text) - Placeholder
      - is_required (boolean)
      - is_visible (boolean)
      - field_type (text) - text, email, tel, select, textarea
      - order_number (integer)
    
    - `form_education_options` - Education status dropdown options
      - option_text (text) - e.g., 'Lise', 'Üniversite Son Sınıf'
      - order_number (integer)
      - is_active (boolean)
    
    - `form_country_options` - Form-specific country options (separate from footer)
      - name (text)
      - flag_emoji (text)
      - order_number (integer)
      - is_active (boolean)
    
    - `form_text_settings` - Form titles, messages, etc.
      - setting_key (text) - 'form_title', 'form_subtitle', 'success_message', etc.
      - setting_value (text)

  2. Updates to Existing Tables
    - Keep `education_countries` for footer display
    - Keep `contact_info` for footer contact details
    - Update `form_settings` to be simpler

  3. Security
    - Enable RLS on all new tables
    - Public read access
    - Authenticated users can manage
*/

-- Form Field Configuration Table
CREATE TABLE IF NOT EXISTS form_field_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_name text UNIQUE NOT NULL,
  label_text text NOT NULL,
  placeholder_text text DEFAULT '',
  is_required boolean DEFAULT true,
  is_visible boolean DEFAULT true,
  field_type text DEFAULT 'text',
  order_number integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Form Education Options Table
CREATE TABLE IF NOT EXISTS form_education_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  option_text text NOT NULL,
  order_number integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Form Country Options Table (separate from footer countries)
CREATE TABLE IF NOT EXISTS form_country_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  flag_emoji text DEFAULT '',
  order_number integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Form Text Settings Table
CREATE TABLE IF NOT EXISTS form_text_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default form field configuration
INSERT INTO form_field_config (field_name, label_text, placeholder_text, is_required, field_type, order_number) VALUES
  ('name', 'Ad Soyad', 'Adınız ve soyadınız', true, 'text', 1),
  ('email', 'E-posta', 'ornek@email.com', true, 'email', 2),
  ('phone', 'Telefon', '+90 555 123 4567', true, 'tel', 3),
  ('education_status', 'Eğitim Durumu', 'Seçiniz', true, 'select', 4),
  ('target_country', 'Hedef Ülke', '', true, 'multiselect', 5),
  ('message', 'Mesajınız', 'Bizimle paylaşmak istediğiniz ek bilgiler...', false, 'textarea', 6)
ON CONFLICT (field_name) DO NOTHING;

-- Insert default education options
INSERT INTO form_education_options (option_text, order_number) VALUES
  ('Lise', 1),
  ('Üniversite Son Sınıf', 2),
  ('Üniversite Mezunu', 3),
  ('Yüksek Lisans', 4)
ON CONFLICT DO NOTHING;

-- Insert default form country options (same as footer countries initially)
INSERT INTO form_country_options (name, flag_emoji, order_number) VALUES
  ('Almanya', '🇩🇪', 1),
  ('İtalya', '🇮🇹', 2),
  ('Hollanda', '🇳🇱', 3),
  ('Fransa', '🇫🇷', 4),
  ('İspanya', '🇪🇸', 5)
ON CONFLICT DO NOTHING;

-- Insert default form text settings
INSERT INTO form_text_settings (setting_key, setting_value) VALUES
  ('form_title', 'Ücretsiz Ön Değerlendirme İçin Başvurun'),
  ('form_subtitle', 'Size özel danışmanlık hizmeti için formu doldurun'),
  ('submit_button_text', 'Başvurumu Gönder'),
  ('success_message', 'Başvurunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.'),
  ('privacy_notice', 'Kişisel verileriniz gizlilik politikamız çerçevesinde korunmaktadır.')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE form_field_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_education_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_country_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_text_settings ENABLE ROW LEVEL SECURITY;

-- Form Field Config Policies
CREATE POLICY "Public can read form field config"
  ON form_field_config FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage form field config"
  ON form_field_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Form Education Options Policies
CREATE POLICY "Public can read active education options"
  ON form_education_options FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage education options"
  ON form_education_options FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Form Country Options Policies
CREATE POLICY "Public can read active form countries"
  ON form_country_options FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage form countries"
  ON form_country_options FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Form Text Settings Policies
CREATE POLICY "Public can read form text settings"
  ON form_text_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage form text settings"
  ON form_text_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
