import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    localStorage.setItem('language', langCode);
  };

  return (
    <div className="relative">
     <button
  onClick={() => setIsOpen(!isOpen)}
  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
>
  <Globe className="w-5 h-5 text-[#4CAF50]" />
  <span className="text-2xl">{currentLang.flag}</span>
</button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-gray-100 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  i18n.language === lang.code ? 'bg-green-50' : ''
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-semibold text-[#2E2E2E]">{lang.name}</span>
                {i18n.language === lang.code && (
                  <span className="ml-auto text-[#4CAF50]">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}