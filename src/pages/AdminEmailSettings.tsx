import { useState, useEffect } from 'react';
import { Save, Mail, Send, ExternalLink, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { supabase, EmailSettings } from '../lib/supabase';
import emailjs from '@emailjs/browser';

export default function AdminEmailSettings() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data } = await supabase
        .from('email_settings')
        .select('*')
        .maybeSingle();

      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching email settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('email_settings')
        .update({
          service_id: settings.service_id,
          public_key: settings.public_key,
          admin_notification_enabled: settings.admin_notification_enabled,
          admin_template_id: settings.admin_template_id,
          admin_emails: settings.admin_emails,
          student_autoresponse_enabled: settings.student_autoresponse_enabled,
          student_template_id: settings.student_template_id,
          student_subject: settings.student_subject,
          reply_to_email: settings.reply_to_email,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Email ayarları kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleTestEmail() {
    if (!settings || !settings.service_id || !settings.public_key) {
      setMessage({ type: 'error', text: 'Lütfen önce Service ID ve Public Key girin!' });
      return;
    }

    try {
      setTesting(true);
      await emailjs.send(
        settings.service_id,
        settings.admin_template_id,
        {
          from_name: 'Test Kullanıcı',
          reply_to: 'test@example.com',
          phone: '+90 555 123 4567',
          education_status: 'Test Eğitim Durumu',
          target_country: 'Test Ülke',
          message: 'Bu bir test emailidir.',
          submission_date: new Date().toLocaleString('tr-TR'),
        },
        settings.public_key
      );

      setMessage({ type: 'success', text: '✅ Test email başarıyla gönderildi! Gelen kutunuzu kontrol edin.' });
      setTimeout(() => setMessage(null), 5000);
    } catch (error: any) {
      console.error('Email test error:', error);
      setMessage({ type: 'error', text: 'Email gönderilemedi: ' + (error.text || error.message) });
    } finally {
      setTesting(false);
    }
  }

  function handleAddEmail() {
    if (!settings || !newEmail) return;
    if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage({ type: 'error', text: 'Geçerli bir email adresi girin!' });
      return;
    }
    if (settings.admin_emails.includes(newEmail)) {
      setMessage({ type: 'error', text: 'Bu email zaten ekli!' });
      return;
    }
    setSettings({ ...settings, admin_emails: [...settings.admin_emails, newEmail] });
    setNewEmail('');
  }

  function handleRemoveEmail(email: string) {
    if (!settings) return;
    setSettings({ ...settings, admin_emails: settings.admin_emails.filter(e => e !== email) });
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4CAF50] mb-2">Email Ayarları</h1>
        <p className="text-[#2E2E2E]">EmailJS ile otomatik email bildirimleri</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-[#4CAF50]' : 'bg-red-500'} text-white`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-4 flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#4CAF50]" />
            📧 EmailJS Yapılandırması
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 mb-2">
                <strong>ℹ️ EmailJS Kurulum Adımları:</strong>
              </p>
              <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                <li>EmailJS'e kaydolun (ücretsiz 200 email/ay)</li>
                <li>Email service oluşturun (Gmail, Outlook, vb.)</li>
                <li>2 adet email template oluşturun</li>
                <li>Service ID ve Public Key'i aşağıya girin</li>
              </ol>
              <a
                href="https://dashboard.emailjs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                EmailJS Dashboard'a Git
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Service ID *</label>
                <input
                  type="text"
                  value={settings.service_id}
                  onChange={(e) => setSettings({ ...settings, service_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="service_xxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Public Key *</label>
                <input
                  type="text"
                  value={settings.public_key}
                  onChange={(e) => setSettings({ ...settings, public_key: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                  placeholder="xxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#2E2E2E] flex items-center gap-2">
              🔔 Yönetici Bildirimleri
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.admin_notification_enabled}
                onChange={(e) => setSettings({ ...settings, admin_notification_enabled: e.target.checked })}
                className="w-5 h-5 text-[#4CAF50] rounded"
              />
              <span className="text-sm font-semibold">Aktif</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Template ID</label>
              <input
                type="text"
                value={settings.admin_template_id}
                onChange={(e) => setSettings({ ...settings, admin_template_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="form_submission_admin"
              />
              <p className="mt-1 text-xs text-gray-500">EmailJS dashboard'da oluşturduğunuz template ID'si</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Admin Email Adresleri</label>
              <div className="space-y-2 mb-3">
                {settings.admin_emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="flex-1 text-sm">{email}</span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none text-sm"
                  placeholder="yeni@email.com"
                />
                <button
                  onClick={handleAddEmail}
                  className="flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ekle
                </button>
              </div>
            </div>

            <button
              onClick={handleTestEmail}
              disabled={testing || !settings.service_id || !settings.public_key}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {testing ? 'Gönderiliyor...' : 'Test Email Gönder'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#2E2E2E] flex items-center gap-2">
              💌 Otomatik Karşılama Emaili (Öğrenciye)
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.student_autoresponse_enabled}
                onChange={(e) => setSettings({ ...settings, student_autoresponse_enabled: e.target.checked })}
                className="w-5 h-5 text-[#4CAF50] rounded"
              />
              <span className="text-sm font-semibold">Aktif</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Template ID</label>
              <input
                type="text"
                value={settings.student_template_id}
                onChange={(e) => setSettings({ ...settings, student_template_id: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="form_submission_student"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Email Konusu</label>
              <input
                type="text"
                value={settings.student_subject}
                onChange={(e) => setSettings({ ...settings, student_subject: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">Reply-To Email</label>
              <input
                type="email"
                value={settings.reply_to_email}
                onChange={(e) => setSettings({ ...settings, reply_to_email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="info@mentoreu.com"
              />
              <p className="mt-1 text-xs text-gray-500">Öğrenci bu emaili yanıtladığında gidecek adres</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-4">📝 Email Template Örnekleri</h2>

          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              ⚠️ ÖNEMLİ: EmailJS Template Yapılandırması
            </h3>
            <div className="text-sm text-red-800 space-y-2">
              <p><strong>Student template için mutlaka şu ayarları yapın:</strong></p>
              <ol className="ml-4 list-decimal space-y-1">
                <li><strong>To Email:</strong> Template settings'de "To email" alanına <code className="bg-red-100 px-1 rounded">{"{{to_email}}"}</code> yazın</li>
                <li><strong>Reply To:</strong> "Reply to" alanına <code className="bg-red-100 px-1 rounded">{"{{reply_to}}"}</code> yazın</li>
                <li><strong>From Name:</strong> "From name" alanına <code className="bg-red-100 px-1 rounded">{"{{from_name}}"}</code> veya "MentorEU" yazın</li>
                <li><strong>Subject:</strong> Email subject alanına <code className="bg-red-100 px-1 rounded">{"{{subject}}"}</code> yazın</li>
              </ol>
              <p className="mt-2"><strong>Bu ayarları yapmazsanız "recipients address is empty" hatası alırsınız!</strong></p>
            </div>
          </div>

          <div className="space-y-4">
            <details className="p-4 bg-gray-50 rounded-lg">
              <summary className="font-semibold cursor-pointer text-[#2E2E2E]">
                Admin Template (form_submission_admin)
              </summary>
              <div className="mt-3 space-y-2">
                <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
                  <strong>EmailJS Template Settings:</strong><br/>
                  To email: <code>{"{{reply_to}}"}</code> (admin'e gönderilecek, form sahibinin emaili)<br/>
                  Reply to: <code>{"{{reply_to}}"}</code><br/>
                  Subject: 🎓 Yeni Form Başvurusu - MentorEU
                </div>
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`👤 Ad Soyad: {{from_name}}
📧 Email: {{reply_to}}
📞 Telefon: {{phone}}
🎓 Eğitim: {{education_status}}
🌍 Hedef Ülke: {{target_country}}
💬 Mesaj: {{message}}

📅 Tarih: {{submission_date}}`}
                </pre>
              </div>
            </details>

            <details open className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <summary className="font-semibold cursor-pointer text-[#2E2E2E]">
                Student Template (form_submission_student) - ZORUNLU AYARLAR
              </summary>
              <div className="mt-3 space-y-2">
                <div className="text-xs bg-green-100 p-3 rounded border border-green-300">
                  <strong className="text-green-900">⚠️ EmailJS Template Settings (ZORUNLU):</strong><br/>
                  <span className="text-green-900">
                    <strong>To email:</strong> <code className="bg-white px-1 rounded">{"{{to_email}}"}</code> (öğrencinin emaili - ZORUNLU!)<br/>
                    <strong>Reply to:</strong> <code className="bg-white px-1 rounded">{"{{reply_to}}"}</code> (info@mentoreu.com)<br/>
                    <strong>From name:</strong> <code className="bg-white px-1 rounded">{"{{from_name}}"}</code> veya "MentorEU"<br/>
                    <strong>Subject:</strong> <code className="bg-white px-1 rounded">{"{{subject}}"}</code> veya "✅ Başvurunuz Alındı - MentorEU"
                  </span>
                </div>
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`Merhaba {{to_name}},

MentorEU'ya gösterdiğiniz ilgi için teşekkür ederiz!

✅ Başvurunuz başarıyla alınmıştır.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 BAŞVURU ÖZETİ
━━━━━━━━━━━━━━━━━━━━━━━━━━

🌍 Hedef Ülke: {{target_country}}
🎓 Eğitim Durumu: {{education_status}}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔜 SONRAKI ADIMLAR
━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Danışmanlarımız 24-48 saat içinde size dönüş yapacaktır
2️⃣ Detaylı değerlendirme için bir görüşme planlayacağız
3️⃣ Size özel yol haritanızı oluşturacağız

Avrupa'da eğitim yolculuğunuzda sizinle olmaktan mutluluk duyarız!

Saygılarımızla,
MentorEU Ekibi`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#4CAF50] text-white px-8 py-4 rounded-lg hover:bg-[#388E3C] transition-colors font-semibold text-lg disabled:opacity-50 shadow-lg"
          >
            <Save className="w-6 h-6" />
            {saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
