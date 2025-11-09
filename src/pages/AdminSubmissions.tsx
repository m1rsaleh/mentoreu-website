import { useState, useEffect } from 'react';
import { Download, Search, Trash2, Eye } from 'lucide-react';
import { supabase, Lead } from '../lib/supabase';
import { formatDate, exportToCSV } from '../lib/utils';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.filter(sub => sub.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Başvuru silinirken bir hata oluştu.');
    }
  }

  function handleExport() {
    const exportData = submissions.map(sub => ({
      'Ad Soyad': sub.name,
      'E-posta': sub.email,
      'Telefon': sub.phone || '',
      'Eğitim Durumu': sub.education_status || '',
      'Hedef Ülkeler': sub.target_country?.join(', ') || '',
      'Mesaj': sub.message || '',
      'Tarih': formatDate(sub.created_at)
    }));

    exportToCSV(exportData, `mentoreu-basvurular-${new Date().toISOString().split('T')[0]}.csv`);
  }

  const filteredSubmissions = submissions.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.phone?.includes(searchTerm)
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
          <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Form Başvuruları</h1>
          <p className="text-[#2E2E2E]">{submissions.length} başvuru bulundu</p>
        </div>
        <button
          onClick={handleExport}
          disabled={submissions.length === 0}
          className="flex items-center gap-2 bg-[#FF9800] text-white px-6 py-3 rounded-lg hover:bg-[#F57C00] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          CSV İndir
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Başvuru ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
          />
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-xl text-gray-500">
            {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz başvuru yok.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Ad Soyad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">E-posta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Telefon</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Eğitim</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Hedef Ülke</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">Tarih</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#2E2E2E]">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#2E2E2E]">
                      {submission.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{submission.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{submission.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{submission.education_status || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {submission.target_country?.slice(0, 2).map((country, idx) => (
                          <span key={idx} className="text-xs bg-[#4CAF50]/10 text-[#388E3C] px-2 py-1 rounded">
                            {country}
                          </span>
                        ))}
                        {submission.target_country && submission.target_country.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{submission.target_country.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-2 text-[#4CAF50] hover:bg-[#4CAF50]/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(submission.id)}
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

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#4CAF50] mb-6">Başvuru Detayları</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Ad Soyad</label>
                <p className="text-lg text-[#2E2E2E]">{selectedSubmission.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">E-posta</label>
                <p className="text-lg text-[#2E2E2E]">{selectedSubmission.email}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Telefon</label>
                <p className="text-lg text-[#2E2E2E]">{selectedSubmission.phone || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Eğitim Durumu</label>
                <p className="text-lg text-[#2E2E2E]">{selectedSubmission.education_status || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Hedef Ülkeler</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSubmission.target_country?.map((country, idx) => (
                    <span key={idx} className="bg-[#4CAF50]/10 text-[#388E3C] px-3 py-1 rounded-lg">
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              {selectedSubmission.message && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Mesaj</label>
                  <p className="text-lg text-[#2E2E2E] mt-2 p-4 bg-gray-50 rounded-lg">
                    {selectedSubmission.message}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-600">Başvuru Tarihi</label>
                <p className="text-lg text-[#2E2E2E]">{formatDate(selectedSubmission.created_at)}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedSubmission(null)}
              className="mt-6 w-full bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">Başvuruyu Sil</h3>
            <p className="text-[#2E2E2E] mb-6">
              Bu başvuruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
