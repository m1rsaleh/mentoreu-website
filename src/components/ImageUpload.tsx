import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUrlChange: (url: string) => void;
  bucketName?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUrlChange,
  bucketName = 'landing-images'
}: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onImageUrlChange(publicUrl);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Yükleme başarısız oldu.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleUrlSubmit() {
    if (!urlInput) {
      setError('Lütfen bir URL girin.');
      return;
    }
    onImageUrlChange(urlInput);
    setError('');
  }

  function handleRemoveImage() {
    onImageUrlChange('');
    setUrlInput('');
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setUploadMode('upload')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            uploadMode === 'upload'
              ? 'bg-[#4CAF50] text-white'
              : 'bg-gray-200 text-[#2E2E2E] hover:bg-gray-300'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Dosya Yükle
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            uploadMode === 'url'
              ? 'bg-[#4CAF50] text-white'
              : 'bg-gray-200 text-[#2E2E2E] hover:bg-gray-300'
          }`}
        >
          <LinkIcon className="w-4 h-4 inline mr-2" />
          URL Kullan
        </button>
      </div>

      {currentImageUrl && (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Görsel+Yüklenemedi';
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {uploadMode === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#4CAF50] transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Yükleniyor...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 text-[#2E2E2E]">
                <Upload className="w-5 h-5" />
                Resim Seç (Max 5MB)
              </span>
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP formatları desteklenir</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#388E3C] transition-colors font-medium"
          >
            Kaydet
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
