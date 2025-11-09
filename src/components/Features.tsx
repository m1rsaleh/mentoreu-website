import { Flag, UserCheck, ClipboardCheck, Briefcase, DollarSign, MessageSquare, Rocket } from 'lucide-react';

const features = [
  {
    icon: Flag,
    title: 'Avrupa Odaklı Uzmanlık',
    description: 'Almanya, İtalya, Hollanda, Fransa\'da lisans ve yüksek lisans programları',
    caption: 'Avrupa\'da eğitim, MentorEU ile adım adım planlı.',
    color: '#4CAF50'
  },
  {
    icon: UserCheck,
    title: 'Kişiye Özel Danışmanlık',
    description: 'Akademik profil, dil seviyesi ve bütçeye göre bireysel yol haritası',
    caption: 'Her başvuru bir hikayedir, şablon değil.',
    color: '#FF9800'
  },
  {
    icon: ClipboardCheck,
    title: 'Tüm Süreci Tek Yerden Yönetme',
    description: 'Başvurudan vizeden konaklamaya kadar tam destek',
    caption: 'Belgeler, başvuru, vize, konaklama – hepsi tek çatı altında.',
    color: '#388E3C'
  },
  {
    icon: Briefcase,
    title: 'Kariyer Odaklı Yaklaşım',
    description: 'Mezuniyet sonrası kariyer planlaması ve iş arama vizesi desteği',
    caption: 'Eğitimle bitmeyen, kariyerle başlayan bir yolculuk.',
    color: '#4CAF50'
  },
  {
    icon: DollarSign,
    title: 'Burs ve Finansal Destek',
    description: 'DAAD, Erasmus+ ve düşük öğrenim ücretli programlar',
    caption: 'Avrupa\'da eğitim artık lüks değil, plan işi.',
    color: '#FF9800'
  },
  {
    icon: MessageSquare,
    title: 'Güvenilir ve Ulaşılabilir Ekip',
    description: 'WhatsApp, Zoom ve e-posta ile 7/24 iletişim',
    caption: 'Bir mesaj uzağınızdayız.',
    color: '#388E3C'
  },
  {
    icon: Rocket,
    title: 'Modern Marka İmajı',
    description: 'Genç, yenilikçi ve motive edici yaklaşım',
    caption: 'Yeni nesil öğrenciler için yeni nesil danışmanlık.',
    color: '#4CAF50'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            Neden MentorEU?
          </h2>
          <p className="text-xl text-[#2E2E2E] max-w-2xl mx-auto">
            Avrupa'da eğitim hayalinizi gerçeğe dönüştürmek için ihtiyacınız olan her şey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#2E2E2E] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#2E2E2E] mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <p className="text-sm text-[#388E3C] font-medium italic">
                  {feature.caption}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
