import { useState, useEffect } from 'react';
import { Save, RotateCcw, Eye, Plus, Trash2 } from 'lucide-react';
import { supabase, LandingSection } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';

type TabType = 'hero' | 'features' | 'how_it_works' | 'faq';

export default function AdminLandingEditor() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<LandingSection>>({});

  const tabs = [
    { key: 'hero' as TabType, label: 'Hero Section', type: 'hero' },
    { key: 'features' as TabType, label: 'Features', type: 'feature' },
    { key: 'how_it_works' as TabType, label: 'How It Works', type: 'how_it_works' },
    { key: 'faq' as TabType, label: 'FAQ', type: 'faq' },
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    setShowAddForm(false);
    setNewItem({});
  }, [activeTab]);

  async function fetchSections() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .order('section_type, order_number');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setMessage({ type: 'error', text: 'Bölümler yüklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(section: LandingSection) {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('landing_sections')
        .update({
          title: section.title,
          subtitle: section.subtitle,
          content: section.content,
          image_url: section.image_url,
          button_text: section.button_text,
          button_link: section.button_link,
          icon: section.icon,
          is_active: section.is_active
        })
        .eq('id', section.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Değişiklikler kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving section:', error);
      setMessage({ type: 'error', text: 'Kaydetme hatası: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('landing_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSections(sections.filter(s => s.id !== id));
      setMessage({ type: 'success', text: 'Öğe silindi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error deleting section:', error);
      setMessage({ type: 'error', text: 'Silme hatası: ' + error.message });
    }
  }

  async function handleAddNew() {
    const currentTab = tabs.find(t => t.key === activeTab);
    if (!currentTab) return;

    if (activeTab === 'faq' && (!newItem.title || !newItem.content)) {
      setMessage({ type: 'error', text: 'Soru ve cevap alanları zorunludur.' });
      return;
    }

    if ((activeTab === 'features' || activeTab === 'how_it_works') && (!newItem.title || !newItem.content)) {
      setMessage({ type: 'error', text: 'Başlık ve içerik alanları zorunludur.' });
      return;
    }

    try {
      setSaving(true);

      const existingSections = sections.filter(s => s.section_type === currentTab.type);
      const maxOrder = existingSections.length > 0
        ? Math.max(...existingSections.map(s => s.order_number))
        : 0;

      const newSection = {
        section_key: `${currentTab.type}_${Date.now()}`,
        section_type: currentTab.type,
        title: newItem.title || '',
        subtitle: newItem.subtitle || null,
        content: newItem.content || '',
        image_url: newItem.image_url || null,
        button_text: newItem.button_text || null,
        button_link: newItem.button_link || null,
        icon: newItem.icon || null,
        order_number: maxOrder + 1,
        is_active: true
      };

      const { data, error } = await supabase
        .from('landing_sections')
        .insert([newSection])
        .select()
        .single();

      if (error) throw error;

      setSections([...sections, data]);
      setShowAddForm(false);
      setNewItem({});
      setMessage({ type: 'success', text: 'Yeni öğe eklendi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error adding section:', error);
      setMessage({ type: 'error', text: 'Ekleme hatası: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  function updateSection(id: string, field: keyof LandingSection, value: any) {
    setSections(sections.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  }

  const filteredSections = sections.filter(s =>
    tabs.find(t => t.key === activeTab)?.type === s.section_type
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#2E2E2E]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Landing Page Editörü</h1>
          <p className="text-[#2E2E2E]">Ana sayfa içeriğini düzenleyin</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold"
          >
            <Eye className="w-5 h-5" />
            Önizle
          </a>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-[#4CAF50] text-white'
                    : 'bg-white text-[#2E2E2E] hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab !== 'hero' && (
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-[#FF9800] text-white px-6 py-3 rounded-lg hover:bg-[#F57C00] transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                {activeTab === 'faq' && 'Yeni Soru Ekle'}
                {activeTab === 'features' && 'Yeni Özellik Ekle'}
                {activeTab === 'how_it_works' && 'Yeni Adım Ekle'}
              </button>
            </div>
          )}

          {showAddForm && (
            <div className="mb-8 border border-[#FF9800] rounded-lg p-6 bg-orange-50">
              <h3 className="text-lg font-bold text-[#2E2E2E] mb-4">
                Yeni {activeTab === 'faq' ? 'Soru' : activeTab === 'features' ? 'Özellik' : 'Adım'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                    {activeTab === 'faq' ? 'Soru' : 'Başlık'} *
                  </label>
                  <input
                    type="text"
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                    placeholder={activeTab === 'faq' ? 'Soru' : 'Başlık'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                    {activeTab === 'faq' ? 'Cevap' : 'İçerik'} *
                  </label>
                  <textarea
                    value={newItem.content || ''}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none"
                    placeholder={activeTab === 'faq' ? 'Cevap' : 'İçerik'}
                  />
                </div>

                {(activeTab === 'features' || activeTab === 'how_it_works') && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                      İkon (Lucide Icon adı)
                    </label>
                    <input
                      type="text"
                      value={newItem.icon || ''}
                      onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                      placeholder="Target, GraduationCap, FileText, vb."
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAddNew}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] transition-all font-semibold disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Ekleniyor...' : 'Ekle'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewItem({});
                    }}
                    className="px-6 py-3 bg-gray-200 text-[#2E2E2E] rounded-lg hover:bg-gray-300 transition-all font-semibold"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredSections.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Bu bölüm için içerik bulunamadı.</p>
          ) : (
            <div className="space-y-8">
              {filteredSections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#2E2E2E]">
                      {section.section_key}
                    </h3>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={section.is_active}
                          onChange={(e) => updateSection(section.id, 'is_active', e.target.checked)}
                          className="w-5 h-5 text-[#4CAF50] rounded focus:ring-[#4CAF50]"
                        />
                        <span className="text-sm font-medium text-[#2E2E2E]">Aktif</span>
                      </label>
                      {activeTab !== 'hero' && (
                        <button
                          onClick={() => handleDelete(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={section.title || ''}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                        placeholder="Başlık"
                      />
                    </div>

                    {section.section_type === 'hero' && (
                      <div>
                        <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                          Alt Başlık
                        </label>
                        <input
                          type="text"
                          value={section.subtitle || ''}
                          onChange={(e) => updateSection(section.id, 'subtitle', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                          placeholder="Alt başlık"
                        />
                      </div>
                    )}

                    {(section.section_type === 'feature' || section.section_type === 'how_it_works') && (
                      <div>
                        <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                          İkon (Lucide Icon adı)
                        </label>
                        <input
                          type="text"
                          value={section.icon || ''}
                          onChange={(e) => updateSection(section.id, 'icon', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                          placeholder="Target"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                      İçerik
                    </label>
                    <textarea
                      value={section.content || ''}
                      onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none"
                      placeholder="İçerik"
                    />
                  </div>

                  {section.section_type === 'hero' && (
                    <>
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                          Görsel
                        </label>
                        <ImageUpload
                          currentImageUrl={section.image_url || ''}
                          onImageUrlChange={(url) => updateSection(section.id, 'image_url', url)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                            Buton Metni
                          </label>
                          <input
                            type="text"
                            value={section.button_text || ''}
                            onChange={(e) => updateSection(section.id, 'button_text', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                            placeholder="Ücretsiz Danışmanlık Alın"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                            Buton Linki
                          </label>
                          <input
                            type="text"
                            value={section.button_link || ''}
                            onChange={(e) => updateSection(section.id, 'button_link', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                            placeholder="#contact"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => handleSave(section)}
                    disabled={saving}
                    className="mt-6 flex items-center gap-2 bg-[#FF9800] text-white px-6 py-3 rounded-lg hover:bg-[#F57C00] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
