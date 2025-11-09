import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function LeadForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    educationStatus: '',
    targetCountry: [] as string[],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const countries = ['Almanya', 'İtalya', 'Hollanda', 'Fransa', 'İspanya', 'Belçika', 'Avusturya', 'İsveç'];

  const handleCountryToggle = (country: string) => {
    setFormData(prev => ({
      ...prev,
      targetCountry: prev.targetCountry.includes(country)
        ? prev.targetCountry.filter(c => c !== country)
        : [...prev.targetCountry, country]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.educationStatus || formData.targetCountry.length === 0) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      setIsSubmitting(false);
      return;
    }

    console.log('Submitting form data:', {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      education_status: formData.educationStatus,
      target_country: formData.targetCountry,
      message: formData.message
    });

    try {
      const { data, error: submitError } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            education_status: formData.educationStatus,
            target_country: formData.targetCountry,
            message: formData.message || ''
          }
        ])
        .select();

      if (submitError) {
        console.error('Supabase error:', submitError);
        throw submitError;
      }

      console.log('Form submitted successfully:', data);

      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        educationStatus: '',
        targetCountry: [],
        message: ''
      });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      const errorMessage = err?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      setError(errorMessage);
      console.error('Form submission error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            Ücretsiz Ön Değerlendirme İçin Başvurun
          </h2>
          <p className="text-xl text-[#2E2E2E]">
            Size özel danışmanlık hizmeti için formu doldurun
          </p>
        </div>

        {isSuccess && (
          <div className="mb-8 bg-[#4CAF50] text-white p-4 rounded-lg flex items-center gap-3 animate-fade-in-up">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">Başvurunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.</span>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-500 text-white p-4 rounded-lg animate-fade-in-up">
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder="Adınız ve soyadınız"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                E-posta *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder="+90 555 123 4567"
              />
            </div>

            <div>
              <label htmlFor="educationStatus" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Eğitim Durumu *
              </label>
              <select
                id="educationStatus"
                required
                value={formData.educationStatus}
                onChange={(e) => setFormData({ ...formData, educationStatus: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
              >
                <option value="">Seçiniz</option>
                <option value="Lise">Lise</option>
                <option value="Üniversite Son Sınıf">Üniversite Son Sınıf</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
              Hedef Ülke *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {countries.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => handleCountryToggle(country)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                    formData.targetCountry.includes(country)
                      ? 'bg-[#4CAF50] text-white border-[#4CAF50]'
                      : 'bg-white text-[#2E2E2E] border-gray-200 hover:border-[#4CAF50]'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
              Mesaj
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors resize-none"
              placeholder="Bizimle paylaşmak istediğiniz ek bilgiler..."
            ></textarea>
          </div>

          <p className="text-sm text-[#2E2E2E] mb-6">
            * Bilgileriniz gizli tutulacaktır
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF9800] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#F57C00] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Başvurumu Gönder'}
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
}
