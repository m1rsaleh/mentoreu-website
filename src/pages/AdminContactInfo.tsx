import { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { supabase, ContactInfo } from '../lib/supabase';

export default function AdminContactInfo() {
  const [formData, setFormData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  async function fetchContactInfo() {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) setFormData(data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('contact_info')
        .update({
          company_description: formData.company_description,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          instagram_url: formData.instagram_url,
          linkedin_url: formData.linkedin_url,
          twitter_url: formData.twitter_url,
          facebook_url: formData.facebook_url,
          copyright_text: formData.copyright_text,
          privacy_policy_url: formData.privacy_policy_url,
          terms_url: formData.terms_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', formData.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'İletişim bilgileri kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving contact info:', error);
      setMessage({ type: 'error', text: 'Kaydetme hatası: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">İletişim & Footer Ayarları</h1>
        <p className="text-[#2E2E2E]">Footer bölümündeki iletişim bilgilerini düzenleyin</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-[#4CAF50]' : 'bg-red-500'} text-white`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
            <Mail className="inline w-4 h-4 mr-2" />
            Şirket Açıklaması
          </label>
          <textarea
            value={formData.company_description}
            onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
            placeholder="Avrupa'da eğitim hayallerinizi gerçeğe dönüştürüyoruz..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              E-posta
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              Telefon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
            <MapPin className="inline w-4 h-4 mr-2" />
            Adres
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-[#2E2E2E] mb-4">Sosyal Medya Linkleri</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                <Instagram className="inline w-4 h-4 mr-2" />
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                <Linkedin className="inline w-4 h-4 mr-2" />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://linkedin.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                <Twitter className="inline w-4 h-4 mr-2" />
                Twitter/X URL
              </label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                <Facebook className="inline w-4 h-4 mr-2" />
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-[#2E2E2E] mb-4">Footer Metinleri</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Telif Hakkı Metni
              </label>
              <input
                type="text"
                value={formData.copyright_text}
                onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                  Gizlilik Politikası Linki
                </label>
                <input
                  type="text"
                  value={formData.privacy_policy_url}
                  onChange={(e) => setFormData({ ...formData, privacy_policy_url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="/privacy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                  Kullanım Koşulları Linki
                </label>
                <input
                  type="text"
                  value={formData.terms_url}
                  onChange={(e) => setFormData({ ...formData, terms_url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="/terms"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
