// app/dashboard/configuracion/contacto/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  Loader2, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  Instagram,
  Facebook,
  Video,
  Linkedin,
  Globe
} from 'lucide-react';

interface ContactInfo {
  id: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

interface SocialMedia {
  id: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  showInstagram: boolean;
  showFacebook: boolean;
  showTiktok: boolean;
  showYoutube: boolean;
  showLinkedin: boolean;
}

export default function ContactoConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [contactData, setContactData] = useState<ContactInfo>({
    id: '',
    phone: '',
    email: '',
    whatsapp: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [socialData, setSocialData] = useState<SocialMedia>({
    id: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    linkedin: '',
    showInstagram: true,
    showFacebook: true,
    showTiktok: false,
    showYoutube: false,
    showLinkedin: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener información de contacto
      const contactRes = await fetch('/api/contact-info');
      if (contactRes.ok) {
        const contactInfo = await contactRes.json();
        setContactData(contactInfo);
      }

      // Obtener redes sociales
      const socialRes = await fetch('/api/config/social-media');
      if (socialRes.ok) {
        const socialInfo = await socialRes.json();
        setSocialData(socialInfo);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (res.ok) {
        toast.success('Información de contacto actualizada');
      } else {
        toast.error('Error al actualizar contacto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/config/social-media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialData),
      });

      if (res.ok) {
        toast.success('Redes sociales actualizadas');
      } else {
        toast.error('Error al actualizar redes sociales');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Información de Contacto y Redes Sociales</h1>
        <p className="text-gray-600 mt-2">
          Gestiona los datos de contacto y redes sociales que aparecen en el footer y página de contacto
        </p>
      </div>

      {/* SECCIÓN 1: INFORMACIÓN DE CONTACTO */}
      <form onSubmit={handleSaveContact} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">📞 Información de Contacto</h2>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teléfono */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone size={18} className="text-primary" />
              Teléfono
            </label>
            <input
              type="tel"
              value={contactData.phone || ''}
              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              placeholder="+34 943 123 456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail size={18} className="text-primary" />
              Email
            </label>
            <input
              type="email"
              value={contactData.email || ''}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              placeholder="info@linforeductox.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MessageCircle size={18} className="text-primary" />
              WhatsApp
            </label>
            <input
              type="tel"
              value={contactData.whatsapp || ''}
              onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
              placeholder="+34 943 123 456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Con código de país (ej: +34943123456)
            </p>
          </div>

          {/* Dirección */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={18} className="text-primary" />
              Dirección
            </label>
            <input
              type="text"
              value={contactData.address || ''}
              onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
              placeholder="Calle Principal, 123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={contactData.city || ''}
              onChange={(e) => setContactData({ ...contactData, city: e.target.value })}
              placeholder="Errenteria, Gipuzkoa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Código Postal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              value={contactData.zipCode || ''}
              onChange={(e) => setContactData({ ...contactData, zipCode: e.target.value })}
              placeholder="20100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </form>

      {/* SECCIÓN 2: REDES SOCIALES */}
      <form onSubmit={handleSaveSocial} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">📱 Redes Sociales</h2>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Instagram */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Instagram size={18} className="text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                value={socialData.instagram || ''}
                onChange={(e) => setSocialData({ ...socialData, instagram: e.target.value })}
                placeholder="https://instagram.com/linforeductox"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={socialData.showInstagram}
                  onChange={(e) => setSocialData({ ...socialData, showInstagram: e.target.checked })}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Mostrar</span>
              </label>
            </div>
          </div>

          {/* Facebook */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Facebook size={18} className="text-blue-600" />
                Facebook
              </label>
              <input
                type="url"
                value={socialData.facebook || ''}
                onChange={(e) => setSocialData({ ...socialData, facebook: e.target.value })}
                placeholder="https://facebook.com/linforeductox"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={socialData.showFacebook}
                  onChange={(e) => setSocialData({ ...socialData, showFacebook: e.target.checked })}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Mostrar</span>
              </label>
            </div>
          </div>

          {/* TikTok */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Video size={18} className="text-black" />
                TikTok
              </label>
              <input
                type="url"
                value={socialData.tiktok || ''}
                onChange={(e) => setSocialData({ ...socialData, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@linforeductox"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={socialData.showTiktok}
                  onChange={(e) => setSocialData({ ...socialData, showTiktok: e.target.checked })}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Mostrar</span>
              </label>
            </div>
          </div>

          {/* YouTube */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Globe size={18} className="text-red-600" />
                YouTube
              </label>
              <input
                type="url"
                value={socialData.youtube || ''}
                onChange={(e) => setSocialData({ ...socialData, youtube: e.target.value })}
                placeholder="https://youtube.com/@linforeductox"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={socialData.showYoutube}
                  onChange={(e) => setSocialData({ ...socialData, showYoutube: e.target.checked })}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Mostrar</span>
              </label>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Linkedin size={18} className="text-blue-700" />
                LinkedIn
              </label>
              <input
                type="url"
                value={socialData.linkedin || ''}
                onChange={(e) => setSocialData({ ...socialData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/linforeductox"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={socialData.showLinkedin}
                  onChange={(e) => setSocialData({ ...socialData, showLinkedin: e.target.checked })}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Mostrar</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Consejo:</strong> Marca "Mostrar" solo en las redes sociales que uses activamente. 
            Puedes agregar la URL completa de tu perfil en cada red social.
          </p>
        </div>
      </form>

      {/* Info adicional */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>✅ Los cambios se reflejan automáticamente en:</strong>
        </p>
        <ul className="mt-2 text-sm text-green-700 space-y-1 list-disc list-inside">
          <li>Footer del sitio web</li>
          <li>Página de contacto</li>
          <li>Íconos de redes sociales (solo las marcadas como "Mostrar")</li>
        </ul>
      </div>
    </div>
  );
}