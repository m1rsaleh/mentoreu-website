import { GraduationCap, Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (!isLanding) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#2E2E2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <GraduationCap className="w-8 h-8 text-[#4CAF50]" />
              <span className="text-2xl font-bold text-white">MentorEU</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Avrupa'da eğitim hayallerinizi gerçeğe dönüştürüyoruz. Profesyonel danışmanlık ile yanınızdayız.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#388E3C] rounded-lg flex items-center justify-center hover:bg-[#4CAF50] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#388E3C] rounded-lg flex items-center justify-center hover:bg-[#4CAF50] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#388E3C] rounded-lg flex items-center justify-center hover:bg-[#4CAF50] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#388E3C] rounded-lg flex items-center justify-center hover:bg-[#4CAF50] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors"
                >
                  Hizmetler
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors"
                >
                  Nasıl Çalışır
                </button>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors"
                >
                  SSS
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-[#4CAF50] transition-colors"
                >
                  İletişim
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Eğitim Ülkeleri</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Almanya</li>
              <li>İtalya</li>
              <li>Hollanda</li>
              <li>Fransa</li>
              <li>İspanya</li>
              <li>Belçika</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-1" />
                <a href="mailto:info@mentoreu.com" className="text-gray-300 hover:text-[#4CAF50] transition-colors">
                  info@mentoreu.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-1" />
                <a href="tel:+905551234567" className="text-gray-300 hover:text-[#4CAF50] transition-colors">
                  +90 555 123 45 67
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  İstanbul, Türkiye
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 MentorEU. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[#4CAF50] transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="hover:text-[#4CAF50] transition-colors">
                Kullanım Koşulları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
