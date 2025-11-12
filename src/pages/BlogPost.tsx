import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase, BlogPost as BlogPostType } from '../lib/supabase';
import DynamicHero from '../components/Header';
import Footer from '../components/Footer';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, i18n.language]);

  async function fetchPost() {
    try {
      setLoading(true);
      const lang = i18n.language as 'tr' | 'en' | 'de';
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq(`slug_${lang}`, slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: fallbackData } = await supabase
          .from('blog_posts')
          .select('*')
          .or(`slug_tr.eq.${slug},slug_en.eq.${slug},slug_de.eq.${slug}`)
          .eq('is_published', true)
          .maybeSingle();

        setPost(fallbackData);
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }

  const getLocalizedField = (field: 'title' | 'content') => {
    if (!post) return '';
    const lang = i18n.language as 'tr' | 'en' | 'de';
    const fieldKey = `${field}_${lang}` as keyof BlogPostType;
    return post[fieldKey] || post[`${field}_tr` as keyof BlogPostType] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DynamicHero />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#2E2E2E]">
              {i18n.language === 'en' 
                ? 'Loading...'
                : i18n.language === 'de'
                ? 'Lädt...'
                : 'Yükleniyor...'
              }
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DynamicHero />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-[#2E2E2E] mb-4">
            {i18n.language === 'en' 
              ? 'Post not found'
              : i18n.language === 'de'
              ? 'Beitrag nicht gefunden'
              : 'Yazı bulunamadı'
            }
          </h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#4CAF50] font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {i18n.language === 'en' 
              ? 'Back to Blog'
              : i18n.language === 'de'
              ? 'Zurück zum Blog'
              : 'Blog\'a Dön'
            }
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = getLocalizedField('title') as string;
  const content = getLocalizedField('content') as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicHero />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#4CAF50] font-semibold hover:gap-3 transition-all mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {i18n.language === 'en' 
            ? 'Back to Blog'
            : i18n.language === 'de'
            ? 'Zurück zum Blog'
            : 'Blog\'a Dön'
          }
        </Link>

        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={title}
            className="w-full h-96 object-cover rounded-2xl shadow-2xl mb-8"
          />
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2E2E2E] mb-6">
            {title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {new Date(post.created_at).toLocaleDateString(
                i18n.language === 'en' ? 'en-US' : i18n.language === 'de' ? 'de-DE' : 'tr-TR'
              )}
            </div>
            {post.author_name && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {post.author_name}
              </div>
            )}
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
}