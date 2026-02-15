// app/dashboard/configuracion/eventos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/dashboard/ImageUploader';

interface EventsPageConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
}

export default function EventosConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const [config, setConfig] = useState<EventsPageConfig>({
    heroImage: '',
    heroTitle: 'Eventos',
    heroSubtitle: 'Talleres, charlas y experiencias para tu bienestar',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config/eventos-page');
      if (res.ok) {
        const data = await res.json();
        setConfig({
          heroImage: data.heroImage || '',
          heroTitle: data.heroTitle || 'Eventos',
          heroSubtitle: data.heroSubtitle || 'Talleres, charlas y experiencias para tu bienestar',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config/eventos-page', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        toast.success('Configuración guardada correctamente');
      } else {
        toast.error('Error al guardar');
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Página de Eventos</h1>
          <p className="text-gray-600 mt-2">
            Personaliza el hero de la página de eventos
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
            {showPreview ? 'Ocultar' : 'Mostrar'} Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Guardando...
              </>
            ) : (
              <>
                <Save size={20} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Edición */}
        <div className="space-y-6">
          {/* Imagen de Fondo */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Imagen de Fondo</h2>
            <ImageUploader
              value={config.heroImage}
              onChange={(url) => setConfig({ ...config, heroImage: url })}
              onRemove={() => setConfig({ ...config, heroImage: '' })}
              label="Imagen del Hero"
              aspectRatio="16/9"
              maxSizeMB={5}
            />
          </div>

          {/* Textos */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Textos</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Eventos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Talleres, charlas y experiencias para tu bienestar"
              />
            </div>
          </div>
        </div>

        {/* Preview en Tiempo Real */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye size={20} />
                Vista Previa
              </h2>

              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="relative h-64 flex items-center justify-center text-white"
                  style={{
                    backgroundImage: config.heroImage
                      ? `url(${config.heroImage})`
                      : "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative z-10 text-center px-6">
                    <h1 className="text-4xl font-bold mb-2">
                      {config.heroTitle || 'Eventos'}
                    </h1>
                    <p className="text-lg text-white/90">
                      {config.heroSubtitle || 'Subtítulo'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Vista previa aproximada. Guarda los cambios para verlos en la web.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Los cambios se aplicarán inmediatamente en la página de eventos después de guardar.
        </p>
      </div>
    </div>
  );
}
