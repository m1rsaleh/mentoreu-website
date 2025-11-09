import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn } from 'lucide-react';
import { signIn } from '../lib/auth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-12 h-12 text-[#4CAF50]" />
              <span className="text-3xl font-bold text-[#4CAF50]">MentorEU</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#2E2E2E]">Admin Paneli</h1>
          <p className="text-[#2E2E2E] mt-2">Devam etmek için giriş yapın</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder="admin@mentoreu.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF9800] text-white px-6 py-3.5 rounded-lg text-lg font-semibold hover:bg-[#F57C00] transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Giriş yapılıyor...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Giriş Yap
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#2E2E2E] mt-6">
          © 2025 MentorEU. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
