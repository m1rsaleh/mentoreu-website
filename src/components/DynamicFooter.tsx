import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { supabase, ContactInfo, EducationCountry } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function DynamicFooter() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [countries, setCountries] = useState<EducationCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  async function fetchFooterData() {
    try {
      const [contactResult, countriesResult] = await Promise.all([
        supabase
          .from('contact_info')
          .select('*')
          .maybeSingle(),
        supabase
          .from('education_countries')
          .select('*')
          .eq('is_active', true)
          .order('order_number')
      ]);

      if (contactResult.data) setContactInfo(contactResult.data);
      if (countriesResult.data) setCountries(countriesResult.data);
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <footer className="bg-[#2E2E2E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </footer>
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-[#4CAF50] mb-4">MentorEU</h3>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              {contactInfo.company_description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center hover:bg-[#388E3C] transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Hızlı Bağlantılar</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#features"
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors text-sm"
                >
                  Hizmetlerimiz
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors text-sm"
                >
                  Nasıl Çalışır
                </a>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors text-sm"
                >
                  İletişim
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors text-sm"
                >
                  SSS
                </a>
              </li>
            </ul>
          </div>

          {countries.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Eğitim Ülkeleri</h4>
              <ul className="space-y-2">
                {countries.map((country) => (
                  <li key={country.id}>
                    {country.link_url ? (
                      <a
                        href={country.link_url}
                        className="text-gray-300 hover:text-[#4CAF50] transition-colors flex items-center gap-2 text-sm"
                      >
                        {country.flag_emoji && <span>{country.flag_emoji}</span>}
                        {country.name}
                      </a>
                    ) : (
                      <span className="text-gray-300 flex items-center gap-2 text-sm">
                        {country.flag_emoji && <span>{country.flag_emoji}</span>}
                        {country.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-300">
                <Mail className="w-5 h-5 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#4CAF50] transition-colors text-sm break-all">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Phone className="w-5 h-5 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-[#4CAF50] transition-colors text-sm">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-5 h-5 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                <span className="text-sm">{contactInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-gray-400 text-sm">
            {contactInfo.copyright_text}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
            {contactInfo.privacy_policy_url && (
              <Link
                to={contactInfo.privacy_policy_url}
                className="text-gray-400 hover:text-[#4CAF50] transition-colors"
              >
                Gizlilik Politikası
              </Link>
            )}
            {contactInfo.terms_url && (
              <Link
                to={contactInfo.terms_url}
                className="text-gray-400 hover:text-[#4CAF50] transition-colors"
              >
                Kullanım Koşulları
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
