import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import { formatDate } from '../lib/utils';

export default function AdminPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Yazı silinirken bir hata oluştu.');
    }
  }

 const filteredPosts = posts.filter(post =>
  post.title_tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
  post.author.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Tüm Yazılar</h1>
          <p className="text-[#2E2E2E]">{posts.length} yazı bulundu</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="flex items-center gap-2 bg-[#FF9800] text-white px-6 py-3 rounded-lg hover:bg-[#F57C00] transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Yeni Yazı Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Yazı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-xl text-gray-500">
            {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz yazı yok. İlk yazınızı oluşturun!'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Görsel</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Başlık</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Yazar</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Durum</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Tarih</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#2E2E2E]">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={post.featured_image}
                        alt={post.title_tr}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#2E2E2E] max-w-xs truncate">
                        {post.title_tr}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-[#4CAF50]/10 text-[#388E3C] px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="p-2 text-[#4CAF50] hover:bg-[#4CAF50]/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Yazıyı Sil</h3>
            <p className="text-[#2E2E2E] mb-6">
              Bu yazıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-[#2E2E2E] rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
