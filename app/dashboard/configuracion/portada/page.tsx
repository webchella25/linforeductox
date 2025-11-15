// app/dashboard/configuracion/portada/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/dashboard/ImageUploader';

interface HeroConfig {
  backgroundImage: string;
  greeting: string;
  mainTitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export default function PortadaConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
  const [config, setConfig] = useState<HeroConfig>({
    backgroundImage: '',
    greeting: 'Bienvenid@',
    mainTitle: 'LINFOREDUCTOX',
    description: 'Regenera y depura tu sistema linfático.\nActiva tu metabolismo.\nEsculpe tu belleza facial y corporal.',
    primaryButtonText: 'Ver Tratamientos',
    primaryButtonLink: '/servicios',
    secondaryButtonText: 'Reserva tu Experiencia',
    secondaryButtonLink: '/reservar',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config/hero');
      if (res.ok) {
        const data = await res.json();
        setConfig({
          backgroundImage: data.backgroundImage || '',
          greeting: data.greeting || 'Bienvenid@',
          mainTitle: data.mainTitle || 'LINFOREDUCTOX',
          description: data.description || '',
          primaryButtonText: data.primaryButtonText || 'Ver Tratamientos',
          primaryButtonLink: data.primaryButtonLink || '/servicios',
          secondaryButtonText: data.secondaryButtonText || 'Reserva tu Experiencia',
          secondaryButtonLink: data.secondaryButtonLink || '/reservar',
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
      const res = await fetch('/api/config/hero', {
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

  const linkOptions = [
    { value: '/servicios', label: 'Tratamientos' },
    { value: '/eventos', label: 'Eventos' },
    { value: '/aline-vidal', label: 'Sobre Mí' },
    { value: '/testimonios', label: 'Testimonios' },
    { value: '/contacto', label: 'Contacto' },
    { value: '/reservar', label: 'Reservar' },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Portada</h1>
          <p className="text-gray-600 mt-2">
            Personaliza el Hero principal de tu web
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
              value={config.backgroundImage}
              onChange={(url) => setConfig({ ...config, backgroundImage: url })}
              onRemove={() => setConfig({ ...config, backgroundImage: '' })}
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
                Saludo
              </label>
              <input
                type="text"
                value={config.greeting}
                onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Bienvenid@"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={config.mainTitle}
                onChange={(e) => setConfig({ ...config, mainTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="LINFOREDUCTOX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                rows={4}
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Escribe la descripción..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Usa saltos de línea para separar cada frase
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Botones de Acción</h2>

            {/* Botón Primario */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900">Botón Primario</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={config.primaryButtonText}
                  onChange={(e) => setConfig({ ...config, primaryButtonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace
                </label>
                <select
                  value={config.primaryButtonLink}
                  onChange={(e) => setConfig({ ...config, primaryButtonLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {linkOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón Secundario */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900">Botón Secundario</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={config.secondaryButtonText}
                  onChange={(e) => setConfig({ ...config, secondaryButtonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace
                </label>
                <select
                  value={config.secondaryButtonLink}
                  onChange={(e) => setConfig({ ...config, secondaryButtonLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {linkOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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

              {/* Hero Preview */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="relative h-96 flex items-center justify-center text-white"
                  style={{
                    backgroundImage: config.backgroundImage 
                      ? `url(${config.backgroundImage})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Overlay oscuro */}
                  <div className="absolute inset-0 bg-black/40" />

                  {/* Contenido */}
                  <div className="relative z-10 text-center px-6 max-w-3xl">
                    {config.greeting && (
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        {config.greeting}
                      </h2>
                    )}
                    {config.mainTitle && (
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                        {config.mainTitle}
                      </h1>
                    )}
                    {config.description && (
                      <div className="text-lg md:text-xl mb-6">
                        {config.description.split('\n').map((line, i) => (
                          <p key={i} className="mb-1">{line}</p>
                        ))}
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-all">
                        {config.primaryButtonText}
                      </button>
                      <button className="bg-secondary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary-light transition-all flex items-center justify-center gap-2">
                        {config.secondaryButtonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">
                💡 Esta es una vista previa aproximada. Guarda los cambios para verlos en la web.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Los cambios se aplicarán inmediatamente en la portada de tu web después de guardar.
        </p>
      </div>
    </div>
  );
}