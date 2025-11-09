import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, TrendingUp, Calendar } from 'lucide-react';
import { supabase, BlogPost, Lead } from '../lib/supabase';
import { formatDate } from '../lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalSubmissions: 0
  });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      const [postsResult, submissionsResult, recentPostsResult, recentSubmissionsResult] = await Promise.all([
        supabase.from('blog_posts').select('status', { count: 'exact' }),
        supabase.from('leads').select('*', { count: 'exact' }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      if (postsResult.data) {
        const published = postsResult.data.filter(p => p.status === 'published').length;
        const draft = postsResult.data.filter(p => p.status === 'draft').length;
        setStats(prev => ({
          ...prev,
          totalPosts: postsResult.count || 0,
          publishedPosts: published,
          draftPosts: draft
        }));
      }

      if (submissionsResult.count !== null) {
        setStats(prev => ({ ...prev, totalSubmissions: submissionsResult.count || 0 }));
      }

      setRecentPosts(recentPostsResult.data || []);
      setRecentSubmissions(recentSubmissionsResult.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Dashboard</h1>
        <p className="text-[#2E2E2E]">MentorEU Admin Paneline Hoş Geldiniz</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#4CAF50]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Toplam Yazı</p>
              <p className="text-3xl font-bold text-[#2E2E2E]">{stats.totalPosts}</p>
            </div>
            <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#4CAF50]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF9800]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Yayınlanan</p>
              <p className="text-3xl font-bold text-[#2E2E2E]">{stats.publishedPosts}</p>
            </div>
            <div className="w-12 h-12 bg-[#FF9800]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#FF9800]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#388E3C]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Taslak</p>
              <p className="text-3xl font-bold text-[#2E2E2E]">{stats.draftPosts}</p>
            </div>
            <div className="w-12 h-12 bg-[#388E3C]/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#388E3C]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF9800]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Form Başvuruları</p>
              <p className="text-3xl font-bold text-[#2E2E2E]">{stats.totalSubmissions}</p>
            </div>
            <div className="w-12 h-12 bg-[#FF9800]/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#FF9800]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2E2E2E]">Son Yazılar</h2>
            <Link to="/admin/posts" className="text-[#4CAF50] hover:text-[#388E3C] font-medium">
              Tümünü Gör
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz yazı yok</p>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#2E2E2E] truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className={`px-2 py-0.5 rounded ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2E2E2E]">Son Başvurular</h2>
            <Link to="/admin/submissions" className="text-[#4CAF50] hover:text-[#388E3C] font-medium">
              Tümünü Gör
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz başvuru yok</p>
          ) : (
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#2E2E2E]">{submission.name}</h3>
                    <span className="text-xs text-gray-500">{formatDate(submission.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{submission.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {submission.target_country?.map((country, idx) => (
                      <span key={idx} className="text-xs bg-[#4CAF50]/10 text-[#388E3C] px-2 py-1 rounded">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
