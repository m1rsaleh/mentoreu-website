import { Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    if (!isLanding) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-[#4CAF50]" />
            <span className="text-2xl font-bold text-[#4CAF50]">MentorEU</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors"
            >
              {t('nav.services')}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors"
            >
              {t('nav.how')}
            </button>
            <Link
              to="/blog"
              className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors"
            >
              {t('nav.blog')}
            </Link>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors"
            >
              {t('nav.faq')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-[#FF9800] text-white px-6 py-2.5 rounded-lg hover:bg-[#F57C00] transition-all transform hover:scale-105 font-medium"
            >
              {t('nav.contact')}
            </button>
            <LanguageSwitcher />
          </div>

          <button
            className="md:hidden text-[#2E2E2E]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors text-left"
              >
                {t('nav.services')}
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors text-left"
              >
                {t('nav.how')}
              </button>
              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors text-left"
              >
                {t('nav.blog')}
              </Link>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-[#2E2E2E] hover:text-[#4CAF50] transition-colors text-left"
              >
                {t('nav.faq')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-[#FF9800] text-white px-6 py-2.5 rounded-lg hover:bg-[#F57C00] transition-colors text-left"
              >
                {t('nav.contact')}
              </button>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}