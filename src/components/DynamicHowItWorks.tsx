import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as LucideIcons from 'lucide-react';
import { supabase, LandingSection } from '../lib/supabase';

export default function DynamicHowItWorks() {
  const { i18n } = useTranslation();
  const [steps, setSteps] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSteps();
  }, []);

  async function fetchSteps() {
    try {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('section_type', 'how_it_works')
        .eq('is_active', true)
        .order('order_number');

      if (error) throw error;
      setSteps(data || []);
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(iconName: string) {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-8 h-8" /> : null;
  }

  if (loading) {
    return (
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            {i18n.language === 'en' 
              ? 'How It Works?'
              : i18n.language === 'de'
              ? 'Wie funktioniert es?'
              : 'Nasıl Çalışır?'
            }
          </h2>
          <p className="text-xl text-[#2E2E2E]">
            {i18n.language === 'en' 
              ? 'Your European education journey in 4 simple steps'
              : i18n.language === 'de'
              ? 'Ihre europäische Bildungsreise in 4 einfachen Schritten'
              : 'Avrupa\'da eğitim yolculuğunuz 4 basit adımda'
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          {steps.map((step, index) => {
            const lang = i18n.language as 'tr' | 'en' | 'de';
            const title = step[`title_${lang}` as keyof LandingSection] || step.title_tr || '';
            const content = step[`content_${lang}` as keyof LandingSection] || step.content_tr || '';

            return (
              <div key={step.id} className="flex flex-col lg:flex-row items-center w-full lg:w-auto">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#4CAF50] relative w-full lg:w-64">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-[#FF9800] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                    {index + 1}
                  </div>

                  <div className="mt-6 mb-4 text-[#388E3C]">
                    {step.icon && getIcon(step.icon)}
                  </div>

                  <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
                    {title}
                  </h3>

                  <p className="text-[#2E2E2E] leading-relaxed">
                    {content}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <>
                    <div className="hidden lg:flex items-center justify-center mx-2">
                      <svg className="w-8 h-8 text-[#388E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="flex lg:hidden items-center justify-center my-4">
                      <svg className="w-8 h-8 text-[#388E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}