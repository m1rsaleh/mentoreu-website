import { ArrowRight, Globe2, BookOpen, Users } from 'lucide-react';

export default function Hero() {
  const scrollToForm = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-orange-50/30 -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#4CAF50] leading-tight mb-6">
              MentorEU ile Avrupa'ya Giden Yolculuk
            </h1>
            <p className="text-xl sm:text-2xl text-[#2E2E2E] mb-8 leading-relaxed">
              Lise ve üniversite son sınıf öğrencileri için Avrupa'da eğitim danışmanlığı
            </p>
            <button
              onClick={scrollToForm}
              className="group bg-[#FF9800] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#F57C00] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Ücretsiz Danışmanlık Al
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Globe2 className="w-8 h-8 text-[#388E3C]" />
                </div>
                <div className="text-2xl font-bold text-[#4CAF50]">10+</div>
                <div className="text-sm text-[#2E2E2E]">Ülke</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <BookOpen className="w-8 h-8 text-[#388E3C]" />
                </div>
                <div className="text-2xl font-bold text-[#4CAF50]">500+</div>
                <div className="text-sm text-[#2E2E2E]">Program</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-8 h-8 text-[#388E3C]" />
                </div>
                <div className="text-2xl font-bold text-[#4CAF50]">1000+</div>
                <div className="text-sm text-[#2E2E2E]">Öğrenci</div>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-[#FF9800]/20 rounded-3xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden transform -rotate-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-[#4CAF50]/30 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#FF9800]/30 rounded-full blur-2xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Globe2 className="w-48 h-48 text-[#4CAF50]/20" strokeWidth={1} />
                  </div>
                  <div className="absolute top-20 right-20 bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#4CAF50] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-[#2E2E2E]">Almanya</span>
                    </div>
                  </div>
                  <div className="absolute bottom-32 left-16 bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FF9800] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-[#2E2E2E]">Hollanda</span>
                    </div>
                  </div>
                  <div className="absolute top-40 left-24 bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#388E3C] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-[#2E2E2E]">İtalya</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
