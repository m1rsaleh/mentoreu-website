import { useEffect, useState } from 'react';
import { supabase, LandingSection } from '../lib/supabase';

export default function DynamicHero() {
  const [hero, setHero] = useState<LandingSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHero();
  }, []);

  async function fetchHero() {
    try {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('section_type', 'hero')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setHero(data);
    } catch (error) {
      console.error('Error fetching hero:', error);
    } finally {
      setLoading(false);
    }
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleButtonClick = () => {
    if (hero?.button_link) {
      if (hero.button_link.startsWith('#')) {
        scrollToSection(hero.button_link.substring(1));
      } else {
        window.location.href = hero.button_link;
      }
    }
  };

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (!hero) {
    return null;
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: hero.image_url ? `url(${hero.image_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
          {hero.title}
        </h1>

        <p className="text-xl sm:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          {hero.subtitle}
        </p>

        {hero.button_text && (
          <button
            onClick={handleButtonClick}
            className="bg-[#FF9800] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#F57C00] transition-all transform hover:scale-105 shadow-2xl animate-fade-in-up animation-delay-400"
          >
            {hero.button_text}
          </button>
        )}

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl font-bold text-[#FF9800] mb-2">500+</div>
            <div className="text-white">Başarılı Öğrenci</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl font-bold text-[#FF9800] mb-2">8+</div>
            <div className="text-white">Avrupa Ülkesi</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl font-bold text-[#FF9800] mb-2">%95</div>
            <div className="text-white">Başarı Oranı</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
