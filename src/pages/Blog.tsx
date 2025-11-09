import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import { formatDate } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'Tümü',
    'Almanya Eğitim',
    'İtalya Eğitim',
    'Burs İmkanları',
    'Vize Süreçleri',
    'Öğrenci Hikayeleri',
    'Kariyer Tavsiyeleri'
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  async function fetchPosts() {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#4CAF50] mb-4">
            MentorEU Blog
          </h1>
          <p className="text-xl text-[#2E2E2E]">
            Avrupa Eğitim Rehberi - Başarı hikayeleri, rehberler ve öneriler
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'Tümü' ? 'all' : category)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  (selectedCategory === 'all' && category === 'Tümü') ||
                  selectedCategory === category
                    ? 'bg-[#4CAF50] text-white shadow-lg'
                    : 'bg-gray-100 text-[#2E2E2E] hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#2E2E2E]">Yükleniyor...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-[#2E2E2E]">Henüz bu kategoride yazı bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-[#2E2E2E] mb-3 line-clamp-2 hover:text-[#4CAF50] transition-colors">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-[#2E2E2E] mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.read_time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-center gap-2 text-[#FF9800] font-semibold hover:text-[#F57C00] transition-colors group"
                      >
                        Devamını Oku
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
