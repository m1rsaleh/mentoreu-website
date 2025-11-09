import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, MessageSquare } from 'lucide-react';
import { supabase, Popup } from '../lib/supabase';

export default function AdminPopups() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);              // ← BU SATIRI EKLE
  const [successMessage, setSuccessMessage] = useState(''); // ← BU SATIRI EKLE
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    button_text: 'Devam Et',
    button_link: '',
    show_delay: 3,
    is_active: true
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  async function fetchPopups() {
    try {
      const { data } = await supabase
        .from('popups')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setPopups(data);
    } catch (error) {
      console.error('Error fetching popups:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSuccessMessage('');

    try {
      if (editingId && editingId !== 'new') {
        const { error } = await supabase
          .from('popups')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        setSuccessMessage('Popup başarıyla güncellendi!');
      } else {
        const { error } = await supabase.from('popups').insert([formData]);

        if (error) throw error;
        setSuccessMessage('Popup başarıyla oluşturuldu!');
      }

      await fetchPopups();
      setTimeout(() => {
        handleCancel();
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error saving popup:', error);
      alert('Kayıt sırasında bir hata oluştu: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu popup\'ı silmek istediğinizden emin misiniz?')) return;

    try {
      await supabase.from('popups').delete().eq('id', id);
      await fetchPopups();
    } catch (error) {
      console.error('Error deleting popup:', error);
    }
  }

  function handleEdit(popup: Popup) {
    setEditingId(popup.id);
    setFormData({
      title: popup.title,
      content: popup.content,
      button_text: popup.button_text,
      button_link: popup.button_link,
      show_delay: popup.show_delay,
      is_active: popup.is_active
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      button_text: 'Devam Et',
      button_link: '',
      show_delay: 3,
      is_active: true
    });
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      await supabase
        .from('popups')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      await fetchPopups();
    } catch (error) {
      console.error('Error toggling popup:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#2E2E2E]">Popup Yönetimi</h1>
        {!editingId && (
          <button
            onClick={() => setEditingId('new')}
            className="flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] font-semibold"
          >
            <Plus className="w-5 h-5" />
            Yeni Popup
          </button>
        )}
      </div>

      {editingId && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-6">
            {editingId === 'new' ? 'Yeni Popup Oluştur' : 'Popup Düzenle'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="Özel fırsat başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                İçerik *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                rows={5}
                placeholder="Popup içeriğini buraya yazın..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                  Buton Metni
                </label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="Devam Et"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                  Buton Linki
                </label>
                <input
                  type="text"
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="#contact veya /page"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Gösterim Gecikmesi (saniye)
              </label>
              <input
                type="number"
                value={formData.show_delay}
                onChange={(e) => setFormData({ ...formData, show_delay: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                min="0"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                Popup sayfada bu kadar saniye sonra görünecek
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-[#4CAF50] rounded"
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-[#2E2E2E]">
                Aktif (Yayında)
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
  {successMessage && (
    <div className="w-full bg-green-100 text-green-800 px-4 py-3 rounded-lg">
      {successMessage}
    </div>
  )}
  <div className="flex gap-3">
    <button
      onClick={handleSave}
      disabled={!formData.title || !formData.content || saving}
      className="flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] font-semibold disabled:opacity-50"
    >
      <Save className="w-5 h-5" />
      {saving ? 'Kaydediliyor...' : 'Kaydet'}
    </button>
    <button
      onClick={handleCancel}
      className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
    >
      <X className="w-5 h-5" />
      İptal
    </button>
  </div>
</div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#2E2E2E]">Başlık</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#2E2E2E]">İçerik</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-[#2E2E2E]">Gecikme</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-[#2E2E2E]">Durum</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-[#2E2E2E]">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {popups.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  Henüz popup oluşturulmamış
                </td>
              </tr>
            ) : (
              popups.map((popup) => (
                <tr key={popup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#2E2E2E]">{popup.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 truncate max-w-md">
                      {popup.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">{popup.show_delay}s</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleActive(popup.id, popup.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        popup.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {popup.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(popup)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(popup.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
