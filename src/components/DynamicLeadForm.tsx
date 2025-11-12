import { useState, useEffect } from 'react';
import { Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase, FormSettings, EmailSettings, WhatsAppSettings, FormEducationOption, FormCountryOption } from '../lib/supabase';
import emailjs from '@emailjs/browser';

export default function DynamicLeadForm() {
  const { t, i18n } = useTranslation();
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
  const [formSettings, setFormSettings] = useState<FormSettings | null>(null);
  const [countries, setCountries] = useState<FormCountryOption[]>([]);
  const [educationOptions, setEducationOptions] = useState<FormEducationOption[]>([]);
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormSettings();
  }, []);

  async function fetchFormSettings() {
    try {
      const [settingsResult, countriesResult, educationResult, emailResult, whatsappResult] = await Promise.all([
        supabase.from('form_settings').select('*').maybeSingle(),
        supabase.from('form_country_options').select('*').eq('is_active', true).order('order_number'),
        supabase.from('form_education_options').select('*').eq('is_active', true).order('order_number'),
        supabase.from('email_settings').select('*').maybeSingle(),
        supabase.from('whatsapp_settings').select('*').maybeSingle()
      ]);

      if (settingsResult.data) setFormSettings(settingsResult.data);
      if (countriesResult.data) setCountries(countriesResult.data);
      if (educationResult.data) setEducationOptions(educationResult.data);
      if (emailResult.data) setEmailSettings(emailResult.data);
      if (whatsappResult.data) setWhatsappSettings(whatsappResult.data);
    } catch (error) {
      console.error('Error fetching form settings:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCountryToggle = (country: string) => {
    setFormData(prev => ({
      ...prev,
      targetCountry: prev.targetCountry.includes(country)
        ? prev.targetCountry.filter(c => c !== country)
        : [...prev.targetCountry, country]
    }));
  };

  async function sendEmails() {
    if (!emailSettings || !emailSettings.service_id || !emailSettings.public_key) {
      return;
    }

    try {
      if (emailSettings.admin_notification_enabled) {
        await emailjs.send(
          emailSettings.service_id,
          emailSettings.admin_template_id,
          {
            from_name: formData.fullName,
            reply_to: formData.email,
            phone: formData.phone,
            education_status: formData.educationStatus,
            target_country: formData.targetCountry.join(', '),
            message: formData.message || 'Mesaj yok',
            submission_date: new Date().toLocaleString('tr-TR'),
          },
          emailSettings.public_key
        );
      }

      if (emailSettings.student_autoresponse_enabled) {
        await emailjs.send(
          emailSettings.service_id,
          emailSettings.student_template_id,
          {
            to_name: formData.fullName,
            to_email: formData.email,
            reply_to: emailSettings.reply_to_email || 'info@mentoreu.com',
            from_name: 'MentorEU',
            target_country: formData.targetCountry.join(', '),
            education_status: formData.educationStatus,
            subject: emailSettings.student_subject || 'Başvurunuz Alındı - MentorEU',
          },
          emailSettings.public_key
        );
      }
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }

  function handleWhatsAppClick() {
    if (!whatsappSettings) return;

    const message = `Merhaba, az önce başvuru formunu gönderdim.

İsim: ${formData.fullName || '[Form temizlendi]'}
Email: ${formData.email || '[Form temizlendi]'}
Hedef Ülke: ${formData.targetCountry.join(', ') || '[Form temizlendi]'}

Detaylı görüşmek isterim.`;

    const url = `https://wa.me/${whatsappSettings.phone_number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.educationStatus || formData.targetCountry.length === 0) {
      setError(t('form.error'));
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: submitError } = await supabase
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
        ]);

      if (submitError) throw submitError;

      await sendEmails();

      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        educationStatus: '',
        targetCountry: [],
        message: ''
      });

      setTimeout(() => setIsSuccess(false), 30000);
    } catch (err: any) {
      const errorMessage = err?.message || t('form.error');
      setError(errorMessage);
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-4">
            {t('form.title')}
          </h2>
          <p className="text-xl text-[#2E2E2E]">
            {t('form.subtitle')}
          </p>
        </div>

        {isSuccess && (
          <div className="mb-8 space-y-4">
            <div className="bg-[#4CAF50] text-white p-6 rounded-lg shadow-lg animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-bold text-xl">{t('form.success')}</h3>
                </div>
              </div>
              {whatsappSettings && whatsappSettings.is_enabled && (
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] text-white px-6 py-4 rounded-lg hover:bg-[#128C7E] transition-all font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6" />
                  {i18n.language === 'en' 
                    ? 'Contact via WhatsApp'
                    : i18n.language === 'de'
                    ? 'Kontakt über WhatsApp'
                    : 'WhatsApp\'tan İletişime Geç'
                  }
                </button>
              )}
            </div>
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
                {t('form.name')} *
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder={i18n.language === 'en' ? 'John Doe' : i18n.language === 'de' ? 'Max Mustermann' : 'Adınız ve soyadınız'}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                {t('form.email')} *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder={i18n.language === 'en' ? 'john@example.com' : i18n.language === 'de' ? 'max@beispiel.de' : 'ornek@email.com'}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                {t('form.phone')} *
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
                {t('form.education')} *
              </label>
              <select
                id="educationStatus"
                required
                value={formData.educationStatus}
                onChange={(e) => setFormData({ ...formData, educationStatus: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
              >
                <option value="">
                  {i18n.language === 'en' ? 'Select' : i18n.language === 'de' ? 'Auswählen' : 'Seçiniz'}
                </option>
                {educationOptions.map((option) => (
                  <option key={option.id} value={option.option_text}>
                    {option.option_text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
              {t('form.country')} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {countries.map((country) => (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => handleCountryToggle(country.name)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                    formData.targetCountry.includes(country.name)
                      ? 'bg-[#4CAF50] text-white border-[#4CAF50]'
                      : 'bg-white text-[#2E2E2E] border-gray-200 hover:border-[#4CAF50]'
                  }`}
                >
                  {country.flag_emoji && <span className="mr-1">{country.flag_emoji}</span>}
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
              {t('form.message')}
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors resize-none"
              placeholder={i18n.language === 'en' ? 'Your message...' : i18n.language === 'de' ? 'Ihre Nachricht...' : 'Mesajınız...'}
            ></textarea>
          </div>

          <p className="text-sm text-[#2E2E2E] mb-6">
            {t('form.privacy')}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF9800] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#F57C00] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting 
              ? (i18n.language === 'en' ? 'Sending...' : i18n.language === 'de' ? 'Wird gesendet...' : 'Gönderiliyor...') 
              : t('form.submit')
            }
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  );
}