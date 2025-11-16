// app/dashboard/configuracion/sobre-mi/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2, Plus, X, User, Home, Image as ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import ImageUploader from '@/components/dashboard/ImageUploader';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

type Tab = 'page' | 'home';

interface AboutConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  biography: string;
  philosophy: string;
  secondaryImage: string;
  yearsExperience: number;
  certifications: string[];
  videoUrl: string;
}

interface HomeAboutConfig {
  label: string;
  name: string;
  subtitle: string;
  description: string;
  quote: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
  active: boolean;
}

export default function SobreMiConfigPage() {
  const [activeTab, setActiveTab] = useState<Tab>('page');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [certificationInput, setCertificationInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Config de la página completa
  const [pageConfig, setPageConfig] = useState<AboutConfig>({
    heroImage: '',
    heroTitle: 'Aline Vidal',
    heroSubtitle: 'Especialista en Medicina Ancestral Oriental',
    biography: '',
    philosophy: '',
    secondaryImage: '',
    yearsExperience: 0,
    certifications: [],
    videoUrl: '',
  });

  // Config de la sección en portada
  const [homeConfig, setHomeConfig] = useState<HomeAboutConfig>({
    label: 'Creadora del Método',
    name: 'Aline Vidal',
    subtitle: '',
    description: '',
    quote: '',
    buttonText: 'Conoce mi historia',
    buttonLink: '/aline-vidal',
    image: '/alin-vidal.jpg',
    imageAlt: 'Aline Vidal - Fundadora de LINFOREDUCTOX',
    active: true,
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      // Cargar config de página
      const pageRes = await fetch('/api/config/about');
      if (pageRes.ok) {
        const pageData = await pageRes.json();
        setPageConfig({
          heroImage: pageData.heroImage || '',
          heroTitle: pageData.heroTitle || 'Aline Vidal',
          heroSubtitle: pageData.heroSubtitle || '',
          biography: pageData.biography || '',
          philosophy: pageData.philosophy || '',
          secondaryImage: pageData.secondaryImage || '',
          yearsExperience: pageData.yearsExperience || 0,
          certifications: pageData.certifications || [],
          videoUrl: pageData.videoUrl || '',
        });
      }

      // Cargar config de portada
      const homeRes = await fetch('/api/config/home-about');
      if (homeRes.ok) {
        const homeData = await homeRes.json();
        setHomeConfig({
          label: homeData.label || 'Creadora del Método',
          name: homeData.name || 'Aline Vidal',
          subtitle: homeData.subtitle || '',
          description: homeData.description || '',
          quote: homeData.quote || '',
          buttonText: homeData.buttonText || 'Conoce mi historia',
          buttonLink: homeData.buttonLink || '/aline-vidal',
          image: homeData.image || '/alin-vidal.jpg',
          imageAlt: homeData.imageAlt || 'Aline Vidal - Fundadora',
          active: homeData.active ?? true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config/about', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageConfig),
      });

      if (res.ok) {
        toast.success('Configuración de página guardada');
      } else {
        toast.error('Error al guardar');
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHome = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config/home-about', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homeConfig),
      });

      if (res.ok) {
        toast.success('Configuración de portada guardada');
      } else {
        toast.error('Error al guardar');
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setHomeConfig({ ...homeConfig, image: data.url });
        toast.success('Imagen subida correctamente');
      } else {
        toast.error('Error al subir la imagen');
      }
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const addCertification = () => {
    if (certificationInput.trim()) {
      setPageConfig({
        ...pageConfig,
        certifications: [...pageConfig.certifications, certificationInput.trim()],
      });
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    setPageConfig({
      ...pageConfig,
      certifications: pageConfig.certifications.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
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
            Gestiona el contenido de la página y la sección en portada
          </p>
        </div>
        <User size={40} className="text-primary" />
      </div>

      {/* Pestañas */}
      <div className="bg-white rounded-xl shadow-sm p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('page')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'page'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <User size={20} />
            Página Completa
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'home'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Home size={20} />
            Sección en Portada
          </button>
        </div>
      </div>

      {/* PESTAÑA: PÁGINA COMPLETA */}
      {activeTab === 'page' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </button>
          </div>

          {/* Hero */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Hero de la Página</h2>
            
            <ImageUploader
              value={pageConfig.heroImage}
              onChange={(url) => setPageConfig({ ...pageConfig, heroImage: url })}
              onRemove={() => setPageConfig({ ...pageConfig, heroImage: '' })}
              label="Imagen Principal"
              aspectRatio="16/9"
              maxSizeMB={5}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={pageConfig.heroTitle}
                onChange={(e) => setPageConfig({ ...pageConfig, heroTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Aline Vidal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={pageConfig.heroSubtitle}
                onChange={(e) => setPageConfig({ ...pageConfig, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Especialista en Medicina Ancestral Oriental"
              />
            </div>
          </div>

          {/* Biografía */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Biografía</h2>
            <RichTextEditor
              value={pageConfig.biography}
              onChange={(value) => setPageConfig({ ...pageConfig, biography: value })}
              placeholder="Escribe tu historia profesional, experiencia, formación..."
            />
          </div>

          {/* Filosofía */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Mi Filosofía</h2>
            <p className="text-sm text-gray-600">
              Comparte tu visión personal, tu enfoque de trabajo y lo que te hace única
            </p>
            <RichTextEditor
              value={pageConfig.philosophy}
              onChange={(value) => setPageConfig({ ...pageConfig, philosophy: value })}
              placeholder="Escribe tu filosofía de trabajo, tu visión personal..."
            />
          </div>

          {/* Imagen Secundaria */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Imagen Secundaria</h2>
            <ImageUploader
              value={pageConfig.secondaryImage}
              onChange={(url) => setPageConfig({ ...pageConfig, secondaryImage: url })}
              onRemove={() => setPageConfig({ ...pageConfig, secondaryImage: '' })}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de Experiencia
              </label>
              <input
                type="number"
                value={pageConfig.yearsExperience}
                onChange={(e) => setPageConfig({ ...pageConfig, yearsExperience: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificaciones
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Diplomada en Acupuntura Estética"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  <Plus size={20} />
                </button>
              </div>

              {pageConfig.certifications.length > 0 && (
                <div className="space-y-2">
                  {pageConfig.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{cert}</span>
                      <button
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (YouTube/Vimeo) - Opcional
              </label>
              <input
                type="url"
                value={pageConfig.videoUrl}
                onChange={(e) => setPageConfig({ ...pageConfig, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Eye size={24} />
                Vista Previa
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-6">
                {/* Hero Preview */}
                {pageConfig.heroImage && (
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={pageConfig.heroImage}
                      alt={pageConfig.heroTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="text-center">
                  <h1 className="text-4xl font-bold text-primary mb-2">
                    {pageConfig.heroTitle || 'Título'}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {pageConfig.heroSubtitle || 'Subtítulo'}
                  </p>
                </div>

                {/* Biography Preview */}
                {pageConfig.biography && (
                  <div className="p-6 border-t">
                    <h3 className="font-semibold text-lg mb-3">Biografía</h3>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: pageConfig.biography }}
                    />
                  </div>
                )}

                {/* Philosophy Preview */}
                {pageConfig.philosophy && (
                  <div className="p-6 border-t">
                    <h3 className="font-semibold text-lg mb-3">Mi Filosofía</h3>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: pageConfig.philosophy }}
                    />
                  </div>
                )}

                {/* Datos Preview */}
                {(pageConfig.yearsExperience > 0 || pageConfig.certifications.length > 0) && (
                  <div className="p-6 bg-gray-50 rounded-lg">
                    {pageConfig.yearsExperience > 0 && (
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-primary">{pageConfig.yearsExperience}+</p>
                        <p className="text-sm text-gray-600">Años de experiencia</p>
                      </div>
                    )}

                    {pageConfig.certifications.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Certificaciones:</h3>
                        <ul className="space-y-1">
                          {pageConfig.certifications.map((cert, i) => (
                            <li key={i} className="text-sm text-gray-700">• {cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                💡 Vista previa aproximada. Guarda para ver en la web.
              </p>
            </div>
          )}

          {/* Guardar Página */}
          <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
            <button
              onClick={handleSavePage}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          {/* Aviso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Una buena biografía cuenta tu historia, experiencia y filosofía de trabajo. Sé auténtica y cercana.
            </p>
          </div>
        </>
      )}

      {/* PESTAÑA: SECCIÓN EN PORTADA */}
      {activeTab === 'home' && (
        <>
          {/* Imagen */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon size={24} className="text-primary" />
              <h2 className="text-xl font-semibold">Imagen</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista Previa
                </label>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                  {homeConfig.image ? (
                    <Image
                      src={homeConfig.image}
                      alt={homeConfig.imageAlt}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subir Nueva Imagen
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload size={20} />
                      <span>{uploadingImage ? 'Subiendo...' : 'Seleccionar Imagen'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Máximo 5MB. Formato: JPG, PNG, WEBP
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto Alternativo (SEO)
                  </label>
                  <input
                    type="text"
                    value={homeConfig.imageAlt}
                    onChange={(e) => setHomeConfig({ ...homeConfig, imageAlt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Aline Vidal - Fundadora..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Textos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">📝 Textos de la Sección</h2>

            <div className="space-y-4">
              {/* Etiqueta Superior */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiqueta Superior
                </label>
                <input
                  type="text"
                  value={homeConfig.label}
                  onChange={(e) => setHomeConfig({ ...homeConfig, label: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Creadora del Método"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {homeConfig.label.length}/50 caracteres
                </p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre / Título Principal
                </label>
                <input
                  type="text"
                  value={homeConfig.name}
                  onChange={(e) => setHomeConfig({ ...homeConfig, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Aline Vidal"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {homeConfig.name.length}/100 caracteres
                </p>
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo / Credenciales
                </label>
                <textarea
                  value={homeConfig.subtitle}
                  onChange={(e) => setHomeConfig({ ...homeConfig, subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Coach Corporal y Facialista. Diplomada en Acupuntura Estética..."
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {homeConfig.subtitle.length}/300 caracteres
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción / Misión Personal
                </label>
                <textarea
                  value={homeConfig.description}
                  onChange={(e) => setHomeConfig({ ...homeConfig, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Mi pasión es ayudar a las mujeres..."
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {homeConfig.description.length}/1000 caracteres
                </p>
              </div>

              {/* Frase Destacada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frase Destacada / Quote (opcional)
                </label>
                <textarea
                  value={homeConfig.quote}
                  onChange={(e) => setHomeConfig({ ...homeConfig, quote: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Cuando el sistema linfático fluye con libertad..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {homeConfig.quote.length}/500 caracteres
                </p>
              </div>

              {/* Botón */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    value={homeConfig.buttonText}
                    onChange={(e) => setHomeConfig({ ...homeConfig, buttonText: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Conoce mi historia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace del Botón
                  </label>
                  <input
                    type="text"
                    value={homeConfig.buttonLink}
                    onChange={(e) => setHomeConfig({ ...homeConfig, buttonLink: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="/aline-vidal"
                  />
                </div>
              </div>

              {/* Toggle Mostrar/Ocultar */}
              <div className="flex items-center gap-3 pt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeConfig.active}
                    onChange={(e) => setHomeConfig({ ...homeConfig, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-check bg-primary"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  Mostrar esta sección en la portada
                </span>
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={24} className="text-primary" />
              <h2 className="text-xl font-semibold">Vista Previa</h2>
            </div>

            <div className="bg-white rounded-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Imagen */}
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  {homeConfig.image ? (
                    <Image
                      src={homeConfig.image}
                      alt={homeConfig.imageAlt}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div>
                  {homeConfig.label && (
                    <p className="text-secondary font-semibold mb-2">
                      {homeConfig.label}
                    </p>
                  )}
                  {homeConfig.name && (
                    <h2 className="text-4xl font-bold text-primary mb-4">
                      {homeConfig.name}
                    </h2>
                  )}
                  {homeConfig.subtitle && (
                    <p className="text-lg text-gray-700 mb-4 font-medium">
                      {homeConfig.subtitle}
                    </p>
                  )}
                  {homeConfig.description && (
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {homeConfig.description}
                    </p>
                  )}
                  {homeConfig.quote && (
                    <blockquote className="border-l-4 border-secondary pl-4 italic text-gray-700 mb-6">
                      "{homeConfig.quote}"
                    </blockquote>
                  )}
                  {homeConfig.buttonText && (
                    <button className="inline-flex items-center gap-2 text-primary font-semibold">
                      {homeConfig.buttonText} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
            <button
              onClick={handleSaveHome}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
            >
              <Save size={20} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}