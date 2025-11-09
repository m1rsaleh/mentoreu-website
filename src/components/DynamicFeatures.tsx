import { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { supabase, LandingSection } from '../lib/supabase';

export default function DynamicFeatures() {
  const [features, setFeatures] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  async function fetchFeatures() {
    try {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('section_type', 'feature')
        .eq('is_active', true)
        .order('order_number');

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(iconName: string) {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-12 h-12 text-[#4CAF50]" /> : null;
  }

  if (loading) {
    return (
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            Neden MentorEU?
          </h2>
          <p className="text-xl text-[#2E2E2E] max-w-3xl mx-auto">
            Avrupa eğitim yolculuğunuzda her adımda yanınızdayız
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="mb-6">
                {feature.icon && getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
                {feature.title}
              </h3>
              <p className="text-[#2E2E2E] leading-relaxed">
                {feature.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
