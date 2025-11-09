import { Search, GraduationCap, FileCheck, Plane } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'İlk Görüşme ve Profil Analizi',
    description: 'Hedeflerinizi, akademik geçmişinizi ve bütçenizi değerlendiriyoruz.'
  },
  {
    icon: GraduationCap,
    number: '02',
    title: 'Üniversite ve Program Seçimi',
    description: 'Size en uygun üniversiteleri ve programları birlikte belirliyoruz.'
  },
  {
    icon: FileCheck,
    number: '03',
    title: 'Başvuru ve Vize Süreci',
    description: 'Başvuru belgelerinden vize işlemlerine kadar her adımda yanınızdayız.'
  },
  {
    icon: Plane,
    number: '04',
    title: 'Avrupa\'da Yeni Hayatınız',
    description: 'Konaklamadan kariyere kadar yeni yaşamınızda destek sunuyoruz.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-xl text-[#2E2E2E] max-w-2xl mx-auto">
            Avrupa'ya giden yolculuğunuz 4 basit adımda başlıyor
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#4CAF50] via-[#FF9800] to-[#4CAF50] transform -translate-y-1/2 -z-10"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-[#4CAF50]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-5xl font-bold text-[#4CAF50]/10">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#2E2E2E] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 transform -translate-y-1/2">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#FF9800] rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
