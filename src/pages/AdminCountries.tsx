import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Globe } from 'lucide-react';
import { supabase, EducationCountry } from '../lib/supabase';

export default function AdminCountries() {
  const [countries, setCountries] = useState<EducationCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCountry, setNewCountry] = useState({ name: '', flag_emoji: '', link_url: '', order_number: 0 });

  useEffect(() => {
    fetchCountries();
  }, []);

  async function fetchCountries() {
    try {
      const { data, error } = await supabase
        .from('education_countries')
        .select('*')
        .order('order_number');

      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(country: EducationCountry) {
    try {
      setSaving(true);
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
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd() {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('education_countries')
        .insert([{
          ...newCountry,
          is_active: true
        }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Ülke eklendi!' });
      setShowAddForm(false);
      setNewCountry({ name: '', flag_emoji: '', link_url: '', order_number: countries.length + 1 });
      fetchCountries();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu ülkeyi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('education_countries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCountries(countries.filter(c => c.id !== id));
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Eğitim Ülkeleri</h1>
          <p className="text-[#2E2E2E]">Footer ve form'da görünecek ülkeleri yönetin</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Yeni Ülke Ekle
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-[#4CAF50]' : 'bg-red-500'} text-white`}>
          {message.text}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-[#2E2E2E] mb-4">Yeni Ülke Ekle</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Ülke Adı *</label>
              <input
                type="text"
                value={newCountry.name}
                onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="Almanya"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Bayrak Emoji</label>
              <input
                type="text"
                value={newCountry.flag_emoji}
                onChange={(e) => setNewCountry({ ...newCountry, flag_emoji: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="🇩🇪"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Link URL (Opsiyonel)</label>
              <input
                type="text"
                value={newCountry.link_url}
                onChange={(e) => setNewCountry({ ...newCountry, link_url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="/countries/germany"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Sıra No</label>
              <input
                type="number"
                value={newCountry.order_number}
                onChange={(e) => setNewCountry({ ...newCountry, order_number: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={saving || !newCountry.name}
              className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] font-semibold disabled:opacity-50"
            >
              Ekle
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {countries.map((country) => (
          <div key={country.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Ülke Adı</label>
                <input
                  type="text"
                  value={country.name}
                  onChange={(e) => setCountries(countries.map(c => c.id === country.id ? { ...c, name: e.target.value } : c))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Bayrak</label>
                <input
                  type="text"
                  value={country.flag_emoji}
                  onChange={(e) => setCountries(countries.map(c => c.id === country.id ? { ...c, flag_emoji: e.target.value } : c))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Sıra</label>
                <input
                  type="number"
                  value={country.order_number}
                  onChange={(e) => setCountries(countries.map(c => c.id === country.id ? { ...c, order_number: parseInt(e.target.value) } : c))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={country.is_active}
                    onChange={(e) => setCountries(countries.map(c => c.id === country.id ? { ...c, is_active: e.target.checked } : c))}
                    className="w-5 h-5 text-[#4CAF50] rounded"
                  />
                  <span className="text-sm font-semibold">Aktif</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleSave(country)}
                disabled={saving}
                className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Kaydet
              </button>
              <button
                onClick={() => handleDelete(country.id)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
