import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { supabase, BlogPost as BlogPostType } from '../lib/supabase';
import { formatDate } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  async function fetchPost() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/blog');
        return;
      }

      setPost(data);
      fetchRelatedPosts(data.category, data.id);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelatedPosts(category: string, currentPostId: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('category', category)
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  }

  function shareOnWhatsApp() {
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(post?.title + ' - ' + url)}`, '_blank');
  }

  function shareOnTwitter() {
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(url)}`, '_blank');
  }

  function shareOnLinkedIn() {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#2E2E2E]">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Bloga Geri Dön
          </Link>

          <div className="mb-6">
            <span className="bg-[#4CAF50] text-white px-4 py-1.5 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[#2E2E2E] mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#388E3C]" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#388E3C]" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#388E3C]" />
              <span>{post.read_time} okuma</span>
            </div>
          </div>

          <div className="relative w-full mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/8500/mountains-sky-clouds-sunlight.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
                }}
              />
            </div>
          </div>

          <div className="mb-12">
            <div className="text-[#2E2E2E] text-lg leading-relaxed space-y-4">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8 border-t border-gray-200">
            <span className="text-[#2E2E2E] font-semibold flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Paylaş:
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={shareOnWhatsApp}
                className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1EBE57] transition-colors font-medium text-sm"
              >
                WhatsApp
              </button>
              <button
                onClick={shareOnTwitter}
                className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors font-medium text-sm"
              >
                Twitter
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors font-medium text-sm"
              >
                LinkedIn
              </button>
            </div>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <h2 className="text-3xl font-bold text-[#4CAF50] mb-8">İlgili Yazılar</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedPost.featured_image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#2E2E2E] mb-2 line-clamp-2 group-hover:text-[#4CAF50] transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600">{relatedPost.read_time} okuma</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
