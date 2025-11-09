import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook, Globe, MessageCircle } from 'lucide-react';
import { supabase, ContactInfo, EducationCountry, WhatsAppSettings } from '../lib/supabase';

export default function AdminFooterSettings() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [countries, setCountries] = useState<EducationCountry[]>([]);
  const [whatsapp, setWhatsapp] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [editingCountry, setEditingCountry] = useState<string | null>(null);
  const [newCountry, setNewCountry] = useState({ name: '', flag_emoji: '', link_url: '', order_number: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [contactResult, countriesResult, whatsappResult] = await Promise.all([
        supabase.from('contact_info').select('*').maybeSingle(),
        supabase.from('education_countries').select('*').order('order_number'),
        supabase.from('whatsapp_settings').select('*').maybeSingle()
      ]);

      if (contactResult.data) setContactInfo(contactResult.data);
      if (countriesResult.data) setCountries(countriesResult.data);
      if (whatsappResult.data) setWhatsapp(whatsappResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveContactInfo() {
    if (!contactInfo) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('contact_info')
        .update({
          company_description: contactInfo.company_description,
          email: contactInfo.email,
          phone: contactInfo.phone,
          address: contactInfo.address,
          instagram_url: contactInfo.instagram_url,
          linkedin_url: contactInfo.linkedin_url,
          twitter_url: contactInfo.twitter_url,
          facebook_url: contactInfo.facebook_url,
          copyright_text: contactInfo.copyright_text,
          privacy_policy_url: contactInfo.privacy_policy_url,
          terms_url: contactInfo.terms_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactInfo.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Footer ayarları kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCountry(country: EducationCountry) {
    try {
      const { error } = await supabase
        .from('education_countries')
        .update({
          name: country.name,
          flag_emoji: country.flag_emoji,
          link_url: country.link_url,
          order_number: country.order_number,
          is_active: country.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', country.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Ülke kaydedildi!' });
      setEditingCountry(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  async function handleAddCountry() {
    try {
      const { error } = await supabase
        .from('education_countries')
        .insert([{ ...newCountry, is_active: true }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Ülke eklendi!' });
      setShowAddCountry(false);
      setNewCountry({ name: '', flag_emoji: '', link_url: '', order_number: countries.length + 1 });
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  async function handleDeleteCountry(id: string) {
    if (!confirm('Bu ülkeyi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase.from('education_countries').delete().eq('id', id);
      if (error) throw error;

      setCountries(countries.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Ülke silindi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  async function handleSaveWhatsApp() {
    if (!whatsapp) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('whatsapp_settings')
        .update({
          phone_number: whatsapp.phone_number,
          default_message: whatsapp.default_message,
          is_enabled: whatsapp.is_enabled,
          button_text: whatsapp.button_text,
          updated_at: new Date().toISOString()
        })
        .eq('id', whatsapp.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'WhatsApp ayarları kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
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

  if (!contactInfo || !whatsapp) return null;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Footer & İletişim Ayarları</h1>
        <p className="text-[#2E2E2E]">Footer bölümündeki tüm bilgileri bu sayfadan yönetin</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-[#4CAF50]' : 'bg-red-500'} text-white`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2E2E2E] flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
              💬 WhatsApp Ayarları
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsapp.is_enabled}
                onChange={(e) => setWhatsapp({ ...whatsapp, is_enabled: e.target.checked })}
                className="w-5 h-5 text-[#25D366] rounded"
              />
              <span className="text-sm font-semibold">Aktif</span>
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Telefon Numarası (Ülke kodu ile)
              </label>
              <input
                type="text"
                value={whatsapp.phone_number}
                onChange={(e) => setWhatsapp({ ...whatsapp, phone_number: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#25D366] focus:outline-none"
                placeholder="905551234567"
              />
              <p className="mt-1 text-xs text-gray-500">Örnek: 905551234567 (Türkiye için 90)</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Varsayılan Mesaj
              </label>
              <textarea
                value={whatsapp.default_message}
                onChange={(e) => setWhatsapp({ ...whatsapp, default_message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#25D366] focus:outline-none"
                placeholder="Merhaba, MentorEU hakkında bilgi almak istiyorum."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Buton Metni (Hover'da görünür)
              </label>
              <input
                type="text"
                value={whatsapp.button_text}
                onChange={(e) => setWhatsapp({ ...whatsapp, button_text: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#25D366] focus:outline-none"
              />
            </div>
            <button
              onClick={handleSaveWhatsApp}
              disabled={saving}
              className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg hover:bg-[#128C7E] transition-colors font-semibold disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Kaydediliyor...' : 'WhatsApp Ayarlarını Kaydet'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#4CAF50]" />
            Şirket Bilgileri
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Şirket Açıklaması / Slogan
              </label>
              <textarea
                value={contactInfo.company_description}
                onChange={(e) => setContactInfo({ ...contactInfo, company_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="Avrupa'da eğitim hayallerinizi gerçeğe dönüştürüyoruz..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-2">
            <Phone className="w-6 h-6 text-[#4CAF50]" />
            İletişim Bilgileri
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">E-posta</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Telefon</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Adres</label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-2">
            <Instagram className="w-6 h-6 text-[#4CAF50]" />
            Sosyal Medya Linkleri
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center gap-2">
                <Instagram className="w-4 h-4" /> Instagram URL
              </label>
              <input
                type="url"
                value={contactInfo.instagram_url}
                onChange={(e) => setContactInfo({ ...contactInfo, instagram_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn URL
              </label>
              <input
                type="url"
                value={contactInfo.linkedin_url}
                onChange={(e) => setContactInfo({ ...contactInfo, linkedin_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center gap-2">
                <Twitter className="w-4 h-4" /> Twitter/X URL
              </label>
              <input
                type="url"
                value={contactInfo.twitter_url}
                onChange={(e) => setContactInfo({ ...contactInfo, twitter_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center gap-2">
                <Facebook className="w-4 h-4" /> Facebook URL
              </label>
              <input
                type="url"
                value={contactInfo.facebook_url}
                onChange={(e) => setContactInfo({ ...contactInfo, facebook_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2E2E2E] flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#4CAF50]" />
              Eğitim Ülkeleri (Footer'da Görünür)
            </h2>
            <button
              onClick={() => setShowAddCountry(true)}
              className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Yeni Ülke Ekle
            </button>
          </div>

          {showAddCountry && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-[#4CAF50]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#2E2E2E]">Yeni Ülke Ekle</h3>
                <button onClick={() => setShowAddCountry(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newCountry.name}
                  onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                  placeholder="Ülke Adı"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={newCountry.flag_emoji}
                  onChange={(e) => setNewCountry({ ...newCountry, flag_emoji: e.target.value })}
                  placeholder="🇩🇪"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={newCountry.link_url}
                  onChange={(e) => setNewCountry({ ...newCountry, link_url: e.target.value })}
                  placeholder="Link (opsiyonel)"
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={newCountry.order_number}
                  onChange={(e) => setNewCountry({ ...newCountry, order_number: parseInt(e.target.value) })}
                  placeholder="Sıra"
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleAddCountry}
                disabled={!newCountry.name}
                className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] font-semibold disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          )}

          <div className="space-y-3">
            {countries.map((country) => (
              <div key={country.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {editingCountry === country.id ? (
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={country.name}
                      onChange={(e) => setCountries(countries.map(c => c.id === country.id ? { ...c, name: e.target.value } : c))}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={country.flag_emoji}
                      onChange={(e) => setCountries(countries.map(c => c.id === country.id ? { ...c, flag_emoji: e.target.value } : c))}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={country.order_number}
                      onChange={(e) => setCountries(countries.map(c => c.id === country.id ? { ...c, order_number: parseInt(e.target.value) } : c))}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveCountry(country)}
                        className="flex-1 bg-[#4CAF50] text-white px-3 py-2 rounded-lg hover:bg-[#388E3C] font-semibold text-sm"
                      >
                        <Save className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => setEditingCountry(null)}
                        className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 font-semibold text-sm"
                      >
                        <X className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl">{country.flag_emoji}</span>
                    <span className="flex-1 font-semibold">{country.name}</span>
                    <span className="text-sm text-gray-500">Sıra: {country.order_number}</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={country.is_active}
                        onChange={(e) => {
                          const updated = { ...country, is_active: e.target.checked };
                          setCountries(countries.map(c => c.id === country.id ? updated : c));
                          handleSaveCountry(updated);
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Aktif</span>
                    </label>
                    <button
                      onClick={() => setEditingCountry(country.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCountry(country.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-6">Copyright & Yasal Linkler</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Telif Hakkı Metni</label>
              <input
                type="text"
                value={contactInfo.copyright_text}
                onChange={(e) => setContactInfo({ ...contactInfo, copyright_text: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Gizlilik Politikası Linki</label>
                <input
                  type="text"
                  value={contactInfo.privacy_policy_url}
                  onChange={(e) => setContactInfo({ ...contactInfo, privacy_policy_url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="/privacy"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Kullanım Koşulları Linki</label>
                <input
                  type="text"
                  value={contactInfo.terms_url}
                  onChange={(e) => setContactInfo({ ...contactInfo, terms_url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="/terms"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveContactInfo}
            disabled={saving}
            className="flex items-center gap-2 bg-[#4CAF50] text-white px-8 py-4 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold text-lg disabled:opacity-50 shadow-lg"
          >
            <Save className="w-6 h-6" />
            {saving ? 'Kaydediliyor...' : 'Footer Ayarlarını Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
