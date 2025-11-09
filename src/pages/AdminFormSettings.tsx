import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import { supabase, FormFieldConfig, FormEducationOption, FormCountryOption, FormTextSetting } from '../lib/supabase';

export default function AdminFormSettings() {
  const [fields, setFields] = useState<FormFieldConfig[]>([]);
  const [educationOptions, setEducationOptions] = useState<FormEducationOption[]>([]);
  const [formCountries, setFormCountries] = useState<FormCountryOption[]>([]);
  const [textSettings, setTextSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [newEduOption, setNewEduOption] = useState('');
  const [newCountry, setNewCountry] = useState({ name: '', flag_emoji: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [fieldsRes, eduRes, countriesRes, textRes] = await Promise.all([
        supabase.from('form_field_config').select('*').order('order_number'),
        supabase.from('form_education_options').select('*').order('order_number'),
        supabase.from('form_country_options').select('*').order('order_number'),
        supabase.from('form_text_settings').select('*')
      ]);

      if (fieldsRes.data) setFields(fieldsRes.data);
      if (eduRes.data) setEducationOptions(eduRes.data);
      if (countriesRes.data) setFormCountries(countriesRes.data);

      if (textRes.data) {
        const settings: Record<string, string> = {};
        textRes.data.forEach(s => settings[s.setting_key] = s.setting_value);
        setTextSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTextSettings() {
    try {
      setSaving(true);
      const updates = Object.entries(textSettings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      for (const update of updates) {
        await supabase.from('form_text_settings').upsert(update, { onConflict: 'setting_key' });
      }

      setMessage({ type: 'success', text: 'Form metinleri kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveField(field: FormFieldConfig) {
    try {
      const { error } = await supabase.from('form_field_config').update(field).eq('id', field.id);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Alan kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  async function handleAddEducationOption() {
    try {
      const { error } = await supabase.from('form_education_options').insert([{
        option_text: newEduOption,
        order_number: educationOptions.length + 1,
        is_active: true
      }]);
      if (error) throw error;
      setShowAddEdu(false);
      setNewEduOption('');
      fetchData();
      setMessage({ type: 'success', text: 'Eğitim seçeneği eklendi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  async function handleDeleteEducationOption(id: string) {
    if (!confirm('Bu seçeneği silmek istediğinizden emin misiniz?')) return;
    try {
      const { error } = await supabase.from('form_education_options').delete().eq('id', id);
      if (error) throw error;
      setEducationOptions(educationOptions.filter(e => e.id !== id));
      setMessage({ type: 'success', text: 'Seçenek silindi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  async function handleAddFormCountry() {
    try {
      const { error } = await supabase.from('form_country_options').insert([{
        ...newCountry,
        order_number: formCountries.length + 1,
        is_active: true
      }]);
      if (error) throw error;
      setShowAddCountry(false);
      setNewCountry({ name: '', flag_emoji: '' });
      fetchData();
      setMessage({ type: 'success', text: 'Ülke eklendi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  async function handleDeleteFormCountry(id: string) {
    if (!confirm('Bu ülkeyi silmek istediğinizden emin misiniz?')) return;
    try {
      const { error } = await supabase.from('form_country_options').delete().eq('id', id);
      if (error) throw error;
      setFormCountries(formCountries.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Ülke silindi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Form Ayarları</h1>
        <p className="text-[#2E2E2E]">İletişim formunu özelleştirin</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-[#4CAF50]' : 'bg-red-500'} text-white`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-6">📋 Form Başlığı & Mesajlar</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Form Başlığı</label>
              <input
                type="text"
                value={textSettings.form_title || ''}
                onChange={(e) => setTextSettings({ ...textSettings, form_title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Alt Başlık / Açıklama</label>
              <textarea
                value={textSettings.form_subtitle || ''}
                onChange={(e) => setTextSettings({ ...textSettings, form_subtitle: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Gönder Butonu Metni</label>
              <input
                type="text"
                value={textSettings.submit_button_text || ''}
                onChange={(e) => setTextSettings({ ...textSettings, submit_button_text: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Başarı Mesajı</label>
              <textarea
                value={textSettings.success_message || ''}
                onChange={(e) => setTextSettings({ ...textSettings, success_message: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Gizlilik Bildirimi</label>
              <textarea
                value={textSettings.privacy_notice || ''}
                onChange={(e) => setTextSettings({ ...textSettings, privacy_notice: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <button
              onClick={handleSaveTextSettings}
              disabled={saving}
              className="bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] font-semibold disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Metinleri Kaydet
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-6">✏️ Form Alanları</h2>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Alan Adı</label>
                    <input
                      type="text"
                      value={field.field_name}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tip</label>
                    <input
                      type="text"
                      value={field.field_type}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Label (Görünen İsim)</label>
                    <input
                      type="text"
                      value={field.label_text}
                      onChange={(e) => setFields(fields.map(f => f.id === field.id ? { ...f, label_text: e.target.value } : f))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={field.placeholder_text}
                      onChange={(e) => setFields(fields.map(f => f.id === field.id ? { ...f, placeholder_text: e.target.value } : f))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.is_required}
                      onChange={(e) => setFields(fields.map(f => f.id === field.id ? { ...f, is_required: e.target.checked } : f))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Zorunlu</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.is_visible}
                      onChange={(e) => setFields(fields.map(f => f.id === field.id ? { ...f, is_visible: e.target.checked } : f))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Göster</span>
                  </label>
                  <button
                    onClick={() => handleSaveField(field)}
                    className="ml-auto bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] font-semibold text-sm"
                  >
                    <Save className="w-4 h-4 inline" /> Kaydet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2E2E2E]">🎓 Eğitim Durumu Seçenekleri</h2>
            <button
              onClick={() => setShowAddEdu(true)}
              className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Yeni Ekle
            </button>
          </div>

          {showAddEdu && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-[#4CAF50]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEduOption}
                  onChange={(e) => setNewEduOption(e.target.value)}
                  placeholder="Örn: Yüksek Lisans"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button onClick={handleAddEducationOption} disabled={!newEduOption} className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50">
                  Ekle
                </button>
                <button onClick={() => setShowAddEdu(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold">
                  İptal
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {educationOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="flex-1 font-semibold">{option.option_text}</span>
                <span className="text-sm text-gray-500">Sıra: {option.order_number}</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={option.is_active}
                    onChange={async (e) => {
                      const { error } = await supabase.from('form_education_options').update({ is_active: e.target.checked }).eq('id', option.id);
                      if (!error) fetchData();
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Aktif</span>
                </label>
                <button onClick={() => handleDeleteEducationOption(option.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2E2E2E]">🌍 Hedef Ülke Seçenekleri (Form İçin)</h2>
            <button
              onClick={() => setShowAddCountry(true)}
              className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              Yeni Ekle
            </button>
          </div>

          {showAddCountry && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-[#4CAF50]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCountry.name}
                  onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                  placeholder="Ülke Adı"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={newCountry.flag_emoji}
                  onChange={(e) => setNewCountry({ ...newCountry, flag_emoji: e.target.value })}
                  placeholder="🇩🇪"
                  className="w-20 px-3 py-2 border rounded-lg"
                />
                <button onClick={handleAddFormCountry} disabled={!newCountry.name} className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50">
                  Ekle
                </button>
                <button onClick={() => setShowAddCountry(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold">
                  İptal
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {formCountries.map((country) => (
              <div key={country.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{country.flag_emoji}</span>
                <span className="flex-1 font-semibold">{country.name}</span>
                <span className="text-sm text-gray-500">Sıra: {country.order_number}</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={country.is_active}
                    onChange={async (e) => {
                      const { error } = await supabase.from('form_country_options').update({ is_active: e.target.checked }).eq('id', country.id);
                      if (!error) fetchData();
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Aktif</span>
                </label>
                <button onClick={() => handleDeleteFormCountry(country.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
