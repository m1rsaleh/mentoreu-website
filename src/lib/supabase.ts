import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featured_image: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
  read_time: string;
  meta_title?: string;
  meta_description?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  education_status: string;
  target_country: string[];
  message: string;
  contacted?: boolean;
  created_at: string;
}

export interface LandingSection {
  id: string;
  section_key: string;
  section_type: 'hero' | 'feature' | 'how_it_works' | 'faq' | 'footer';
  title?: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  icon?: string;
  order_number: number;
  is_active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  company_description: string;
  email: string;
  phone: string;
  address: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
  copyright_text: string;
  privacy_policy_url: string;
  terms_url: string;
  created_at: string;
  updated_at: string;
}

export interface EducationCountry {
  id: string;
  name: string;
  flag_emoji: string;
  link_url: string;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSettings {
  id: string;
  section_title: string;
  section_description: string;
  field_config: {
    name: { label: string; placeholder: string; required: boolean };
    email: { label: string; placeholder: string; required: boolean };
    phone: { label: string; placeholder: string; required: boolean };
    education_status: { label: string; placeholder: string; required: boolean };
    target_country: { label: string; placeholder: string; required: boolean };
    message: { label: string; placeholder: string; required: boolean };
  };
  submit_button_text: string;
  success_message: string;
  privacy_notice: string;
  created_at: string;
  updated_at: string;
}

export interface FormFieldConfig {
  id: string;
  field_name: string;
  label_text: string;
  placeholder_text: string;
  is_required: boolean;
  is_visible: boolean;
  field_type: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface FormEducationOption {
  id: string;
  option_text: string;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormCountryOption {
  id: string;
  name: string;
  flag_emoji: string;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Popup {
  id: string;
  title: string;
  content: string;
  button_text: string;
  button_link: string;
  show_delay: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormTextSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppSettings {
  id: string;
  phone_number: string;
  default_message: string;
  is_enabled: boolean;
  button_text: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSettings {
  id: string;
  service_id: string;
  public_key: string;
  admin_notification_enabled: boolean;
  admin_template_id: string;
  admin_emails: string[];
  student_autoresponse_enabled: boolean;
  student_template_id: string;
  student_subject: string;
  reply_to_email: string;
  created_at: string;
  updated_at: string;
}

export interface FormEducationOption {
  id: string;
  option_text: string;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormCountryOption {
  id: string;
  name: string;
  flag_emoji: string;
  order_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Popup {
  id: string;
  title: string;
  content: string;
  button_text: string;
  button_link: string;
  show_delay: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
