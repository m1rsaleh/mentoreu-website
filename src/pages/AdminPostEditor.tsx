import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import { generateSlug, calculateReadTime } from '../lib/utils';
import { getCurrentUser } from '../lib/auth';
import ImageUpload from '../components/ImageUpload';

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featured_image: '',
    author: '',
    category: '',
    tags: '',
    excerpt: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    meta_title: '',
    meta_description: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Almanya Eğitim',
    'İtalya Eğitim',
    'Burs İmkanları',
    'Vize Süreçleri',
    'Öğrenci Hikayeleri',
    'Kariyer Tavsiyeleri'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (!isEditing && formData.title && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title]);

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
          title: data.title,
          slug: data.slug,
          featured_image: data.featured_image,
          author: data.author,
          category: data.category,
          tags: data.tags.join(', '),
          excerpt: data.excerpt,
          content: data.content,
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
    if (!formData.title || !formData.content || !formData.category || !formData.author) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    try {
      setLoading(true);
      const user = await getCurrentUser();

      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        featured_image: formData.featured_image,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        excerpt: formData.excerpt || formData.content.substring(0, 150),
        content: formData.content,
        status: status,
        read_time: calculateReadTime(formData.content),
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
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
        <p className="text-[#2E2E2E]">Blog yazısı bilgilerini girin</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="Yazı başlığı..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="yazi-slug"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /blog/{formData.slug || 'yazi-slug'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Özet (150 karakter)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                maxLength={150}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none"
                placeholder="Kısa özet..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.excerpt.length}/150 karakter
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                İçerik *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none resize-none font-mono text-sm"
                placeholder="Yazı içeriği (markdown desteklenir)..."
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
                placeholder="SEO başlığı (varsayılan: yazı başlığı)"
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
                placeholder="SEO açıklaması (varsayılan: özet)"
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
