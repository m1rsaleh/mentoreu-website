import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase, LandingSection } from '../lib/supabase';

export default function DynamicFAQ() {
  const [faqs, setFaqs] = useState<LandingSection[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    try {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .eq('section_type', 'faq')
        .eq('is_active', true)
        .order('order_number');

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching faqs:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xl text-[#2E2E2E]">
            Merak ettiklerinizin cevapları burada
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-[#2E2E2E] pr-8">
                  {faq.title}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-[#4CAF50] transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-8 pb-6 text-[#2E2E2E] leading-relaxed animate-fade-in-up">
                  {faq.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
