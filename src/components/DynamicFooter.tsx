import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  company_description: string;
  instagram_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  copyright_text: string | null;
  privacy_policy_url: string | null;
  terms_url: string | null;
}

interface EducationCountry {
  id: string;
  name: string;
  flag_emoji: string | null;
  link_url: string | null;
}

export default function DynamicFooter() {
  const { i18n, t } = useTranslation();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [countries, setCountries] = useState<EducationCountry[]>([]);

  useEffect(() => {
    fetchFooterData();
  }, []);

  async function fetchFooterData() {
    try {
      const [contactResult, countriesResult] = await Promise.all([
        supabase.from('contact_info').select('*').maybeSingle(),
        supabase.from('education_countries').select('*').eq('is_active', true).order('order_number')
      ]);

      if (contactResult.data) setContactInfo(contactResult.data);
      if (countriesResult.data) setCountries(countriesResult.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (!contactInfo) return null;

  const socialLinks = [
    { url: contactInfo.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: contactInfo.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { url: contactInfo.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: contactInfo.facebook_url, icon: Facebook, label: 'Facebook' }
  ].filter(link => link.url);

  return (
    <footer className="bg-[#2E2E2E] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div>
            <h3 className="text-2xl font-bold text-[#4CAF50] mb-4">MentorEU</h3>
            <p className="text-gray-300 mb-6 text-sm">{contactInfo.company_description}</p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a key={label} href={url!} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center hover:bg-[#388E3C]">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              {i18n.language === 'en' ? 'Quick Links' : i18n.language === 'de' ? 'Schnelllinks' : 'Hızlı Bağlantılar'}
            </h4>
            <ul className="space-y-2">
              <li><a href="/#features" className="text-gray-300 hover:text-[#4CAF50] text-sm">{t('nav.services')}</a></li>
              <li><a href="/#how-it-works" className="text-gray-300 hover:text-[#4CAF50] text-sm">{t('nav.how')}</a></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-[#4CAF50] text-sm">{t('nav.blog')}</Link></li>
              <li><a href="/#contact" className="text-gray-300 hover:text-[#4CAF50] text-sm">{t('nav.contact')}</a></li>
              <li><a href="/#faq" className="text-gray-300 hover:text-[#4CAF50] text-sm">{t('nav.faq')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              {i18n.language === 'en' ? 'Countries' : i18n.language === 'de' ? 'Länder' : 'Ülkeler'}
            </h4>
            <ul className="space-y-2">
              {countries.map((country) => (
                <li key={country.id} className="text-gray-300 text-sm flex items-center gap-2">
                  {country.flag_emoji && <span>{country.flag_emoji}</span>}
                  {country.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              {i18n.language === 'en' ? 'Contact' : i18n.language === 'de' ? 'Kontakt' : 'İletişim'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-300">
                <Mail className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#4CAF50] text-sm">{contactInfo.email}</a>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Phone className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-[#4CAF50] text-sm">{contactInfo.phone}</a>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-5 h-5 text-[#4CAF50] mt-0.5" />
                <span className="text-sm">{contactInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {contactInfo.copyright_text || `© ${new Date().getFullYear()} MentorEU. ${t('footer.rights')}`}
          </p>
        </div>
      </div>
    </footer>
  );
}