import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';import { generateSlug, calculateReadTime } from '../lib/utils';
import { getCurrentUser } from '../lib/auth';
import ImageUpload from '../components/ImageUpload';

type Language = 'tr' | 'en' | 'de';

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState<Language>('tr');
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    title_de: '',
    slug_tr: '',
    slug_en: '',
    slug_de: '',
    featured_image: '',
    author: '',
    category: '',
    tags: '',
    excerpt_tr: '',
    excerpt_en: '',
    excerpt_de: '',
    content_tr: '',
    content_en: '',
    content_de: '',
    status: 'draft' as 'draft' | 'published',
    meta_title: '',
    meta_description: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Almanya Eğitim',
    'İtalya Eğitim',
    'Burs İmkanları',
    'Viza Süreçleri',
    'Öğrenci Hikayeleri',
    'Kariyer Tavsiyeleri'
  ];

  const languages = [
    { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    const titleKey = `title_${activeTab}`;
    const slugKey = `slug_${activeTab}`;
    if (!isEditing && formData[titleKey as keyof typeof formData] && !formData[slugKey as keyof typeof formData]) {
      setFormData(prev => ({ 
        ...prev, 
        [slugKey]: generateSlug(formData[titleKey as keyof typeof formData] as string) 
      }));
    }
  }, [formData[`title_${activeTab}` as keyof typeof formData]]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          title_tr: data.title_tr,
          title_en: data.title_en || '',
          title_de: data.title_de || '',
          slug_tr: data.slug_tr,
          slug_en: data.slug_en || '',
          slug_de: data.slug_de || '',
          featured_image: data.featured_image,
          author: data.author,
          category: data.category,
          tags: data.tags.join(', '),
          excerpt_tr: data.excerpt_tr,
          excerpt_en: data.excerpt_en || '',
          excerpt_de: data.excerpt_de || '',
          content_tr: data.content_tr,
          content_en: data.content_en || '',
          content_de: data.content_de || '',
          status: data.status,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || ''
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Yazı yüklenirken bir hata oluştu.');
      navigate('/admin/posts');
    }
  }

  async function handleSubmit(status: 'draft' | 'published') {
    if (!formData.title_tr || !formData.content_tr || !formData.category || !formData.author) {
      alert('Lütfen en az Türkçe başlık, içerik, kategori ve yazar alanlarını doldurun.');
      return;
    }

    try {
      setLoading(true);
      const user = await getCurrentUser();

      const postData = {
        title_tr: formData.title_tr,
        title_en: formData.title_en || null,
        title_de: formData.title_de || null,
        slug_tr: formData.slug_tr || generateSlug(formData.title_tr),
        slug_en: formData.slug_en || null,
        slug_de: formData.slug_de || null,
        featured_image: formData.featured_image,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        excerpt_tr: formData.excerpt_tr || formData.content_tr.substring(0, 150),
        excerpt_en: formData.excerpt_en || null,
        excerpt_de: formData.excerpt_de || null,
        content_tr: formData.content_tr,
        content_en: formData.content_en || null,
        content_de: formData.content_de || null,
        status: status,
        read_time: calculateReadTime(formData.content_tr),
        meta_title: formData.meta_title || formData.title_tr,
        meta_description: formData.meta_description || formData.excerpt_tr,
        user_id: user?.id
      };

      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      alert(status === 'published' ? 'Yazı yayınlandı!' : 'Yazı taslak olarak kaydedildi!');
      navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert('Yazı kaydedilirken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">
          {isEditing ? 'Yazıyı Düzenle' : 'Yeni Yazı Oluştur'}
        </h1>
        <p className="text-[#2E2E2E]">Blog yazısı bilgilerini girin (çoklu dil desteği)</p>
      </div>

      {/* Language Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveTab(lang.code)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === lang.code
                  ? 'bg-[#4CAF50] text-white'
                  : 'bg-gray-100 text-[#2E2E2E] hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          💡 Türkçe zorunlu, diğer diller isteğe bağlı
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Başlık {activeTab === 'tr' && '*'}
              </label>
              <input
                type="text"
                value={formData[`title_${activeTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`title_${activeTab}`]: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder={`Yazı başlığı (${activeTab.toUpperCase()})...`}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData[`slug_${activeTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`slug_${activeTab}`]: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="yazi-slug"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /blog/{formData[`slug_${activeTab}` as keyof typeof formData] || 'yazi-slug'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Özet (150 karakter)
              </label>
              <textarea
                value={formData[`excerpt_${activeTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`excerpt_${activeTab}`]: e.target.value })}
                maxLength={150}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none"
                placeholder={`Kısa özet (${activeTab.toUpperCase()})...`}
              />
              <p className="text-sm text-gray-500 mt-1">
                {(formData[`excerpt_${activeTab}` as keyof typeof formData] as string).length}/150 karakter
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                İçerik {activeTab === 'tr' && '*'}
              </label>
              <textarea
                value={formData[`content_${activeTab}` as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [`content_${activeTab}`]: e.target.value })}
                rows={20}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none font-mono text-sm"
                placeholder={`Yazı içeriği (${activeTab.toUpperCase()}) - markdown desteklenir...`}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#2E2E2E] mb-4">SEO Ayarları</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Meta Başlık
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="SEO başlığı (varsayılan: Türkçe başlık)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Meta Açıklama
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none"
                placeholder="SEO açıklaması (varsayılan: Türkçe özet)"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#2E2E2E] mb-4">Yazı Ayarları</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Yazar *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="Yazar adı"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Etiketler
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="almanya, burs, vize (virgülle ayırın)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Öne Çıkan Görsel *
              </label>
              <ImageUpload
                currentImageUrl={formData.featured_image}
                onImageUrlChange={(url) => setFormData({ ...formData, featured_image: url })}
                bucketName="blog-images"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#2E2E2E] mb-4">Yayınla</h3>

            <div className="space-y-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Taslak Olarak Kaydet
              </button>

              <button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#4CAF50] text-white px-4 py-3 rounded-lg hover:bg-[#388E3C] transition-all font-semibold disabled:opacity-50"
              >
                <Eye className="w-5 h-5" />
                Yayınla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}