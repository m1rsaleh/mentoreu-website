import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Home,
  Phone,
  Globe,
  Mail,
  MessageSquare
} from 'lucide-react';
import { signOut, getCurrentUser } from '../lib/auth';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/admin');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      navigate('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/posts', icon: FileText, label: 'Tüm Yazılar' },
    { path: '/admin/posts/new', icon: PlusCircle, label: 'Yeni Yazı Ekle' },
    { path: '/admin/submissions', icon: Users, label: 'Form Başvuruları' },
    { path: '/admin/landing-editor', icon: Home, label: 'Ana Sayfa Editörü' },
    { path: '/admin/footer-settings', icon: Phone, label: 'Footer & İletişim' },
    { path: '/admin/form-settings', icon: Globe, label: 'Form Ayarları' },
    { path: '/admin/email-settings', icon: Mail, label: 'Email Ayarları' },
    { path: '/admin/popups', icon: MessageSquare, label: 'Popup Yönetimi' },
    { path: '/admin/settings', icon: Settings, label: 'Ayarlar' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#2E2E2E]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-[#4CAF50]" />
            <span className="text-xl font-bold text-[#4CAF50]">MentorEU Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#2E2E2E]"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#2E2E2E] text-white transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-[#4CAF50]" />
            <div>
              <h1 className="text-xl font-bold">MentorEU</h1>
              <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-[#4CAF50] text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="mb-4 px-4">
            <p className="text-sm text-gray-400">Giriş yapan:</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="lg:ml-64 pt-20 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
