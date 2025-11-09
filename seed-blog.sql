-- First, you need to create an admin user in Supabase Auth
-- Go to Authentication > Users in your Supabase dashboard and create a user with:
-- Email: admin@mentoreu.com
-- Password: mentoreu2025

-- Then insert some demo blog posts
-- Note: Replace 'YOUR_USER_ID' with the actual user ID from Supabase Auth

INSERT INTO blog_posts (
  title,
  slug,
  featured_image,
  author,
  category,
  tags,
  excerpt,
  content,
  status,
  read_time,
  meta_title,
  meta_description,
  published_at
) VALUES 
(
  'Almanya''da Üniversite Okumak: 2025 Rehberi',
  'almanyada-universite-okumak-2025-rehberi',
  'https://images.pexels.com/photos/301930/pexels-photo-301930.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Ahmet Yılmaz',
  'Almanya Eğitim',
  ARRAY['almanya', 'üniversite', 'eğitim', 'rehber'],
  'Almanya''da üniversite okumak isteyenler için kapsamlı rehber. Başvuru sürecinden vize işlemlerine, yaşam maliyetlerinden burs olanaklarına kadar bilmeniz gereken her şey.',
  'Almanya, yüksek kaliteli eğitimi ve düşük maliyetleriyle dünya çapında öğrencilerin tercih ettiği bir destinasyon. Bu rehberde, Almanya''da üniversite okumak için bilmeniz gereken tüm detayları bulacaksınız.

## Neden Almanya?

1. **Düşük veya hiç öğrenim ücreti yok** - Çoğu devlet üniversitesi ücretsiz eğitim sunuyor
2. **Yüksek kaliteli eğitim** - Dünya çapında tanınan üniversiteler
3. **Çalışma imkanları** - Öğrenciler haftada 20 saat çalışabilir
4. **Mezuniyet sonrası iş arama vizesi** - 18 ay süreyle iş arama hakkı

## Başvuru Süreci

Almanya''da üniversite başvurusu genellikle şu adımları içerir:

1. Üniversite ve program seçimi
2. Dil yeterlilik belgesi (TestDaF, Goethe, veya İngilizce programlar için IELTS/TOEFL)
3. Diploma denkliği (Anabin veya Uni-Assist)
4. Motivasyon mektubu ve CV
5. Vize başvurusu

## Yaşam Maliyetleri

Almanya''da bir öğrencinin aylık ortalama harcaması:
- Konaklama: 300-500€
- Yemek: 200-250€
- Ulaşım: 80-100€
- Sigorta: 110€
- Diğer: 100-150€

Toplam: Yaklaşık 800-1.100€/ay

## En İyi Üniversiteler

- Münih Teknik Üniversitesi (TUM)
- Münih Ludwig Maximilian Üniversitesi (LMU)
- Heidelberg Üniversitesi
- Humboldt Üniversitesi Berlin
- RWTH Aachen

## Sonuç

Almanya''da eğitim, kariyer hedeflerinize ulaşmak için harika bir fırsat. Doğru planlama ve hazırlıkla, bu yolculukta başarılı olabilirsiniz. MentorEU olarak, bu süreçte size rehberlik etmekten mutluluk duyarız.',
  'published',
  '8 min',
  'Almanya''da Üniversite Okumak: 2025 Kapsamlı Rehber',
  'Almanya''da üniversite eğitimi almak isteyenler için detaylı rehber. Başvuru, vize, burs ve yaşam maliyetleri hakkında tüm bilgiler.',
  NOW()
),
(
  'DAAD Bursları Nasıl Alınır? Adım Adım Başvuru',
  'daad-burslari-nasil-alinir-adim-adim-basvuru',
  'https://images.pexels.com/photos/3769120/pexels-photo-3769120.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Zeynep Demir',
  'Burs İmkanları',
  ARRAY['daad', 'burs', 'almanya', 'başvuru'],
  'DAAD bursları, Almanya''da eğitim almak isteyen öğrenciler için harika bir fırsat. Bu yazıda, DAAD bursu başvuru sürecini adım adım anlatıyoruz.',
  'DAAD (Deutscher Akademischer Austauschdienst), Almanya''nın en büyük burs kuruluşudur. Her yıl binlerce uluslararası öğrenciye burs sağlıyor.

## DAAD Bursu Nedir?

DAAD bursları, lisans, yüksek lisans ve doktora öğrencilerine sunulan finansal desteklerdir. Burslar genellikle şunları kapsar:

- Aylık öğrenci maaşı (850-1.200€)
- Sağlık sigortası
- Seyahat masrafları
- Araştırma ve materyel desteği

## Kimler Başvurabilir?

- Lisans son sınıf öğrencileri
- Yüksek lisans adayları
- Doktora adayları
- Araştırmacılar

## Başvuru Süreci

### 1. Program Seçimi
DAAD''nin birçok farklı burs programı var. Kendinize en uygun olanı seçin:
- Lisans bursları
- Yüksek lisans bursları
- Araştırma bursları
- Staj bursları

### 2. Gerekli Belgeler
- CV (Europass formatında)
- Motivasyon mektubu
- Akademik transkript
- Diploma
- Referans mektupları (2 adet)
- Dil yeterlilik belgesi

### 3. Online Başvuru
DAAD portalından online başvuru yapılır. Tüm belgeler PDF formatında yüklenir.

### 4. Mülakat
Başarılı başvurular mülakat için çağrılır. Mülakat genellikle İngilizce veya Almanca yapılır.

## Başvuru Tarihleri

- Yüksek lisans bursları: Genellikle Eylül-Ekim
- Araştırma bursları: Yıl boyunca farklı dönemler

## İpuçları

1. **Erken başlayın** - Belge hazırlığı zaman alır
2. **Dikkatli olun** - Motivasyon mektubunuz özgün ve etkileyici olmalı
3. **Referansları iyi seçin** - Sizi iyi tanıyan akademisyenlerden alın
4. **Dil pratiği yapın** - Mülakat için hazırlıklı olun

## Sonuç

DAAD bursları, Almanya''da eğitim hayalinizi gerçekleştirmenin harika bir yolu. MentorEU olarak, başvuru sürecinizde size profesyonel destek sunuyoruz.',
  'published',
  '6 min',
  'DAAD Bursları: Başvuru Rehberi 2025',
  'DAAD bursu başvuru süreci, gerekli belgeler ve ipuçları. Almanya''da burslu eğitim için adım adım rehber.',
  NOW()
),
(
  'Avrupa''da En Uygun Fiyatlı Üniversiteler',
  'avrupada-en-uygun-fiyatli-universiteler',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Mehmet Kaya',
  'Kariyer Tavsiyeleri',
  ARRAY['avrupa', 'üniversite', 'fiyat', 'bütçe'],
  'Bütçeniz sınırlı ama Avrupa''da eğitim almak istiyorsanız, bu yazı tam size göre. İşte en uygun fiyatlı Avrupa üniversiteleri ve ülkeleri.',
  'Avrupa''da kaliteli eğitim almak pahalı olmak zorunda değil. Birçok ülke, uluslararası öğrencilere uygun fiyatlı veya ücretsiz eğitim sunuyor.

## Ücretsiz veya Düşük Ücretli Ülkeler

### 1. Almanya
- **Öğrenim ücreti**: 0€ (devlet üniversiteleri)
- **Yarıyıl ücreti**: 150-350€
- **Yaşam maliyeti**: 800-1.100€/ay

### 2. Norveç
- **Öğrenim ücreti**: 0€
- **Yaşam maliyeti**: 1.000-1.400€/ay
- Not: Pahalı bir ülke ama eğitim ücretsiz

### 3. Finlandiya
- **Öğrenim ücreti**: 0€ (AB dışı öğrenciler için bazı programlarda ücret var)
- **Yaşam maliyeti**: 700-1.000€/ay

### 4. Avusturya
- **Öğrenim ücreti**: 750€/yarıyıl (AB dışı öğrenciler için)
- **Yaşam maliyeti**: 900-1.200€/ay

### 5. İtalya
- **Öğrenim ücreti**: 1.000-4.000€/yıl
- **Yaşam maliyeti**: 700-1.000€/ay
- Bölgeye göre değişiyor, güney daha uygun

## Uygun Fiyatlı Üniversiteler

### Almanya
1. **Münih Teknik Üniversitesi** - Ücretsiz
2. **Heidelberg Üniversitesi** - Ücretsiz
3. **Humboldt Üniversitesi Berlin** - Ücretsiz

### İtalya
1. **Bologna Üniversitesi** - 1.000-4.000€/yıl
2. **Padova Üniversitesi** - 1.200-3.500€/yıl
3. **Torino Üniversitesi** - 1.000-3.000€/yıl

### Fransa
1. **Paris-Saclay Üniversitesi** - 170-3.770€/yıl
2. **Sorbonne Üniversitesi** - Benzer ücretler
3. **Lyon Üniversitesi** - 170-3.770€/yıl

## Burs Olanakları

Uygun fiyatlı ülkelerde bile burs bulabilirsiniz:
- DAAD (Almanya)
- Erasmus+
- Üniversite bursları
- Hükümet bursları

## Yaşam Maliyetini Düşürme İpuçları

1. **Öğrenci yurtları** - En ucuz konaklama seçeneği
2. **Yemek kart** - Üniversite mensası daha ucuz
3. **Öğrenci indirimleri** - Ulaşım, müze, sinema vb.
4. **Part-time çalışma** - Yaşam maliyetini karşılamaya yardımcı

## Sonuç

Avrupa''da uygun fiyatlı kaliteli eğitim mümkün. Doğru ülke ve üniversite seçimiyle, bütçenizi zorlamadan dünya standartlarında eğitim alabilirsiniz.

MentorEU olarak, size en uygun seçenekleri bulmak için buradayız!',
  'published',
  '7 min',
  'Avrupa''da En Uygun Üniversiteler 2025',
  'Bütçe dostu Avrupa üniversiteleri. Düşük ücretli veya ücretsiz eğitim veren ülkeler ve üniversiteler.',
  NOW()
);
