import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase, BlogPost } from '../lib/supabase';
import DynamicHeader from '../components/Header';
import DynamicFooter from '../components/DynamicFooter';


export default function Blog() {
  const { i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  const getLocalizedField = (post: BlogPost, field: 'title' | 'excerpt' | 'slug') => {
    const lang = i18n.language as 'tr' | 'en' | 'de';
    const fieldKey = `${field}_${lang}` as keyof BlogPost;
    return post[fieldKey] || post[`${field}_tr` as keyof BlogPost] || '';
  };

  const filteredPosts = posts.filter(post => {
    const title = getLocalizedField(post, 'title') as string;
    const excerpt = getLocalizedField(post, 'excerpt') as string;
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           excerpt.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicHeader />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-6">
            {i18n.language === 'en' 
              ? 'Blog'
              : i18n.language === 'de'
              ? 'Blog'
              : 'Blog'
            }
          </h1>
          <p className="text-xl text-[#2E2E2E] max-w-3xl mx-auto">
            {i18n.language === 'en' 
              ? 'Education tips, experiences and news from Europe'
              : i18n.language === 'de'
              ? 'Bildungstipps, Erfahrungen und Neuigkeiten aus Europa'
              : 'Eğitim ipuçları, deneyimler ve Avrupa\'dan haberler'
            }
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={i18n.language === 'en' ? 'Search...' : i18n.language === 'de' ? 'Suchen...' : 'Ara...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {i18n.language === 'en' 
                  ? 'No posts found.'
                  : i18n.language === 'de'
                  ? 'Keine Beiträge gefunden.'
                  : 'Yazı bulunamadı.'
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const slug = getLocalizedField(post, 'slug') as string;
                const title = getLocalizedField(post, 'title') as string;
                const excerpt = getLocalizedField(post, 'excerpt') as string;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.created_at).toLocaleDateString(
                            i18n.language === 'en' ? 'en-US' : i18n.language === 'de' ? 'de-DE' : 'tr-TR'
                          )}
                        </div>
                        {post.author_name && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author_name}
                          </div>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-[#2E2E2E] mb-3 line-clamp-2">
                        {title}
                      </h2>

                      <p className="text-[#2E2E2E] mb-4 line-clamp-3">
                        {excerpt}
                      </p>

                      <Link
                        to={`/blog/${slug}`}
                        className="inline-flex items-center gap-2 text-[#4CAF50] font-semibold hover:gap-3 transition-all"
                      >
                        {i18n.language === 'en' 
                          ? 'Read More'
                          : i18n.language === 'de'
                          ? 'Weiterlesen'
                          : 'Devamını Oku'
                        }
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <DynamicFooter />
    </div>
  );
}