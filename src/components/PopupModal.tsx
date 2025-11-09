import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase, Popup } from '../lib/supabase';

export default function PopupModal() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchPopup();
  }, []);

  async function fetchPopup() {
    try {
      const { data } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        const dismissed = localStorage.getItem(`popup_dismissed_${data.id}`);
        if (!dismissed) {
          setPopup(data);
          setTimeout(() => {
            setIsVisible(true);
          }, data.show_delay * 1000);
        }
      }
    } catch (error) {
      console.error('Error fetching popup:', error);
    }
  }

  function handleClose() {
    if (popup) {
      localStorage.setItem(`popup_dismissed_${popup.id}`, 'true');
    }
    setIsVisible(false);
  }

  function handleButtonClick() {
    if (popup?.button_link) {
      window.location.href = popup.button_link;
    }
    handleClose();
  }

  if (!isVisible || !popup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-4 pr-8">
          {popup.title}
        </h2>

        <div className="text-gray-600 mb-6 whitespace-pre-wrap">
          {popup.content}
        </div>

        {popup.button_text && (
          <button
            onClick={handleButtonClick}
            className="w-full bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold"
          >
            {popup.button_text}
          </button>
        )}
      </div>
    </div>
  );
}
