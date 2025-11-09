import { useState, useEffect } from 'react';
import { Save, Key, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export default function AdminSettings() {
  const [user, setUser] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Şifre başarıyla değiştirildi!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Şifre değiştirilemedi.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Ayarlar</h1>
        <p className="text-[#2E2E2E]">Hesap ayarlarınızı yönetin</p>
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

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-[#4CAF50]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2E2E2E]">Hesap Bilgileri</h2>
            <p className="text-sm text-gray-600">Mevcut hesap bilgileriniz</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">E-posta</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-[#2E2E2E]">
              {user?.email || 'Yükleniyor...'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Kullanıcı ID</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-[#2E2E2E] font-mono text-sm">
              {user?.id || 'Yükleniyor...'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#FF9800]/10 rounded-lg flex items-center justify-center">
            <Key className="w-6 h-6 text-[#FF9800]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2E2E2E]">Şifre Değiştir</h2>
            <p className="text-sm text-gray-600">Hesap güvenliğiniz için şifrenizi değiştirin</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
              Yeni Şifre
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              placeholder="En az 6 karakter"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              placeholder="Şifrenizi tekrar girin"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#FF9800] text-white px-6 py-3 rounded-lg hover:bg-[#F57C00] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
          </button>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">Bilgi</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Şifreniz en az 6 karakter uzunluğunda olmalıdır</li>
          <li>• Güçlü bir şifre kullanmanız önerilir</li>
          <li>• Şifrenizi düzenli olarak değiştirin</li>
        </ul>
      </div>
    </div>
  );
}
