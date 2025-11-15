// app/dashboard/configuracion/sobre-mi/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/dashboard/ImageUploader';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

interface AboutConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  biography: string;
  secondaryImage: string;
  yearsExperience: number;
  certifications: string[];
  videoUrl: string;
}

export default function SobreMiConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [certificationInput, setCertificationInput] = useState('');
  
  const [config, setConfig] = useState<AboutConfig>({
    heroImage: '',
    heroTitle: 'Aline Vidal',
    heroSubtitle: 'Especialista en Medicina Ancestral Oriental',
    biography: '',
    secondaryImage: '',
    yearsExperience: 0,
    certifications: [],
    videoUrl: '',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config/about');
      if (res.ok) {
        const data = await res.json();
        setConfig({
          heroImage: data.heroImage || '',
          heroTitle: data.heroTitle || 'Aline Vidal',
          heroSubtitle: data.heroSubtitle || 'Especialista en Medicina Ancestral Oriental',
          biography: data.biography || '',
          secondaryImage: data.secondaryImage || '',
          yearsExperience: data.yearsExperience || 0,
          certifications: data.certifications || [],
          videoUrl: data.videoUrl || '',
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
      const res = await fetch('/api/config/about', {
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

  const addCertification = () => {
    if (certificationInput.trim()) {
      setConfig({
        ...config,
        certifications: [...config.certifications, certificationInput.trim()],
      });
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    setConfig({
      ...config,
      certifications: config.certifications.filter((_, i) => i !== index),
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Configuración "Sobre Mí"</h1>
          <p className="text-gray-600 mt-2">
            Personaliza tu página de presentación profesional
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
          {/* Hero */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Hero de la Página</h2>

            {/* Imagen Hero */}
            <div>
              <ImageUploader
                value={config.heroImage}
                onChange={(url) => setConfig({ ...config, heroImage: url })}
                onRemove={() => setConfig({ ...config, heroImage: '' })}
                label="Foto Principal"
                aspectRatio="16/9"
                maxSizeMB={5}
              />
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Aline Vidal"
              />
            </div>

            {/* Subtítulo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo/Especialidad
              </label>
              <input
                type="text"
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Especialista en Medicina Ancestral Oriental"
              />
            </div>
          </div>

          {/* Biografía */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Biografía</h2>
            <RichTextEditor
              value={config.biography}
              onChange={(value) => setConfig({ ...config, biography: value })}
              placeholder="Escribe tu historia profesional, experiencia, filosofía de trabajo..."
            />
          </div>

          {/* Imagen Secundaria */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Imagen Secundaria</h2>
            <ImageUploader
              value={config.secondaryImage}
              onChange={(url) => setConfig({ ...config, secondaryImage: url })}
              onRemove={() => setConfig({ ...config, secondaryImage: '' })}
              label="Foto Adicional"
              aspectRatio="4/3"
              maxSizeMB={3}
            />
            <p className="text-xs text-gray-500">
              Esta imagen aparecerá al lado del texto biográfico
            </p>
          </div>

          {/* Datos Destacados */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Datos Destacados</h2>

            {/* Años de Experiencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de Experiencia
              </label>
              <input
                type="number"
                min="0"
                value={config.yearsExperience}
                onChange={(e) => setConfig({ 
                  ...config, 
                  yearsExperience: parseInt(e.target.value) || 0 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="10"
              />
            </div>

            {/* Certificaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificaciones y Títulos
              </label>
              
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Máster en Medicina Tradicional China"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <Plus size={20} />
                </button>
              </div>

              {config.certifications.length > 0 && (
                <div className="space-y-2">
                  {config.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                      <span className="flex-1">{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Video de Presentación</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de YouTube o Vimeo (opcional)
              </label>
              <input
                type="url"
                value={config.videoUrl}
                onChange={(e) => setConfig({ ...config, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye size={20} />
                Vista Previa
              </h2>

              <div className="border-2 border-gray-200 rounded-lg overflow-hidden space-y-4">
                {/* Hero Preview */}
                <div 
                  className="relative h-64 flex items-center justify-center text-white"
                  style={{
                    backgroundImage: config.heroImage 
                      ? `url(${config.heroImage})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 text-center px-6">
                    <h1 className="text-4xl font-bold mb-2">{config.heroTitle}</h1>
                    <p className="text-xl">{config.heroSubtitle}</p>
                  </div>
                </div>

                {/* Biografía Preview */}
                <div className="p-6">
                  {config.biography ? (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: config.biography }}
                    />
                  ) : (
                    <p className="text-gray-400 italic">Escribe tu biografía...</p>
                  )}
                </div>

                {/* Datos Preview */}
                {(config.yearsExperience > 0 || config.certifications.length > 0) && (
                  <div className="p-6 bg-gray-50">
                    {config.yearsExperience > 0 && (
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-primary">{config.yearsExperience}+</p>
                        <p className="text-sm text-gray-600">Años de experiencia</p>
                      </div>
                    )}

                    {config.certifications.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Certificaciones:</h3>
                        <ul className="space-y-1">
                          {config.certifications.map((cert, i) => (
                            <li key={i} className="text-sm text-gray-700">• {cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">
                💡 Vista previa aproximada. Guarda para ver en la web.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Una buena biografía cuenta tu historia, experiencia y filosofía de trabajo. Sé auténtica y cercana.
        </p>
      </div>
    </div>
  );
}