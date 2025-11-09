import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Başvuru süreci ne kadar sürer?',
    answer: 'Başvuru süreci genellikle 3-6 ay arasında değişmektedir. Bu süre, hedef ülke, program türü ve başvuru dönemine göre değişiklik gösterebilir. MentorEU olarak, sürecin her aşamasında sizinle birlikte hareket ederek zamanı en verimli şekilde kullanmanızı sağlıyoruz.'
  },
  {
    question: 'Hangi ülkelere başvuru yapabiliyorum?',
    answer: 'Almanya, İtalya, Hollanda, Fransa, İspanya, Belçika, Avusturya ve İsveç başta olmak üzere tüm Avrupa ülkelerine başvuru yapabilirsiniz. Her ülkenin kendine özgü başvuru koşulları ve avantajları bulunmaktadır. Size en uygun ülke ve programları birlikte belirleyerek yol haritanızı oluşturuyoruz.'
  },
  {
    question: 'Danışmanlık ücreti nedir?',
    answer: 'Danışmanlık ücretlerimiz, hizmet paketlerinize göre değişiklik göstermektedir. İlk görüşme ve ön değerlendirme tamamen ücretsizdir. Detaylı fiyat bilgisi için bizimle iletişime geçebilir ve size özel teklif alabilirsiniz. Ödeme planları da mevcuttur.'
  },
  {
    question: 'Burs imkanları var mı?',
    answer: 'Evet, DAAD, Erasmus+, Chevening, ve üniversitelerin kendi burs programları gibi birçok fırsat bulunmaktadır. Ayrıca birçok Avrupa ülkesinde düşük veya hiç öğrenim ücreti olmayan programlar mevcuttur. Profilinize uygun tüm burs olanaklarını araştırıp başvuru sürecinizde size rehberlik ediyoruz.'
  },
  {
    question: 'Dil bilgisi şartı nedir?',
    answer: 'Dil şartları programa ve ülkeye göre değişmektedir. İngilizce programlar için genellikle IELTS veya TOEFL, Almanca programlar için TestDaF veya Goethe Sertifikası gibi belgeler istenmektedir. Bazı üniversiteler hazırlık sınıfları da sunmaktadır. Dil seviyenize uygun programları birlikte belirleyebiliriz.'
  },
  {
    question: 'Vize sürecinde yardımcı olur musunuz?',
    answer: 'Evet, vize süreci danışmanlık hizmetimizin önemli bir parçasıdır. Gerekli belgelerin hazırlanmasından randevu alınmasına, mülakat hazırlığından takip sürecine kadar her adımda yanınızdayız. Vize başvuru sürecinde başarı oranımız oldukça yüksektir.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-xl text-[#2E2E2E]">
            Aklınıza takılan soruların cevapları burada
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#4CAF50] transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-[#2E2E2E] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-[#4CAF50] transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fade-in-up">
                  <p className="text-[#2E2E2E] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-[#2E2E2E] mb-6">
            Başka sorularınız mı var?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#388E3C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2E7D32] transition-all transform hover:scale-105"
          >
            Bizimle İletişime Geçin
          </button>
        </div>
      </div>
    </section>
  );
}
