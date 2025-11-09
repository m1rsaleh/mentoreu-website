import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase, WhatsAppSettings } from '../lib/supabase';

export default function FloatingWhatsApp() {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchSettings();
    setTimeout(() => setIsVisible(true), 1000);
  }, []);

  async function fetchSettings() {
    try {
      const { data } = await supabase
        .from('whatsapp_settings')
        .select('*')
        .maybeSingle();

      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
    }
  }

  function handleClick() {
    if (!settings) return;

    const message = encodeURIComponent(settings.default_message);
    const url = `https://wa.me/${settings.phone_number}?text=${message}`;
    window.open(url, '_blank');
  }

  if (!settings || !settings.is_enabled) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <button
        onClick={handleClick}
        className="group relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none"
        aria-label={settings.button_text}
      >
        <MessageCircle className="w-8 h-8" />

        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-[#2E2E2E] text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          {settings.button_text}
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#2E2E2E]"></div>
        </div>
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
