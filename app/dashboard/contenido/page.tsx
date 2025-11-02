// app/dashboard/contenido/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, Save, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ContentItem {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content: string;
}

const sections = [
  { key: 'home_hero', label: 'Inicio - Hero', description: 'Título y descripción principal' },
  { key: 'home_quote', label: 'Inicio - Frase destacada', description: 'Cita sobre sistema linfático' },
  { key: 'home_cta', label: 'Inicio - Call to Action', description: 'Texto final de la home' },
  { key: 'about_intro', label: 'Sobre Nosotros - Introducción', description: 'Filosofía LINFOREDUCTOX' },
  { key: 'about_method', label: 'Sobre Nosotros - Método', description: 'Descripción del método' },
  { key: 'aline_bio', label: 'Aline Vidal - Biografía', description: 'Historia y formación' },
  { key: 'aline_philosophy', label: 'Aline Vidal - Filosofía', description: 'Visión personal' },
];

export default function ContenidoPage() {
  const [content, setContent] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState(sections[0].key);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        const contentMap = data.reduce((acc: any, item: ContentItem) => {
          acc[item.section] = item;
          return acc;
        }, {});
        setContent(contentMap);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string) => {
    setSaving(section);
    try {
      const contentItem = content[section];
      
      const res = await fetch(`/api/content/${section}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: contentItem?.title || '',
          subtitle: contentItem?.subtitle || '',
          content: contentItem?.content || '',
        }),
      });

      if (res.ok) {
        toast.success('Contenido actualizado');
      } else {
        toast.error('Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  const updateContent = (section: string, field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        section,
        [field]: value,
      } as ContentItem,
    }));
  };

  const selectedSectionData = sections.find((s) => s.key === selectedSection);
  const currentContent = content[selectedSection] || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contenido Web</h1>
          <p className="text-gray-600 mt-2">Edita los textos de tu sitio web</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={18} />
            Recargar
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={18} />
            Ver sitio
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          Cargando contenido...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de secciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Secciones</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setSelectedSection(section.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedSection === section.key
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{section.label}</div>
                    <div className={`text-xs mt-1 ${
                      selectedSection === section.key ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor de contenido */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={24} className="text-primary" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedSectionData?.label}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {selectedSectionData?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título (Opcional)
                  </label>
                  <input
                    type="text"
                    value={currentContent.title || ''}
                    onChange={(e) => updateContent(selectedSection, 'title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Título de la sección..."
                  />
                </div>

                {/* Subtítulo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtítulo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={currentContent.subtitle || ''}
                    onChange={(e) => updateContent(selectedSection, 'subtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Subtítulo de la sección..."
                  />
                </div>

                {/* Contenido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido
                  </label>
                  <textarea
                    value={currentContent.content || ''}
                    onChange={(e) => updateContent(selectedSection, 'content', e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                    placeholder="Contenido de la sección..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Puedes usar saltos de línea para separar párrafos
                  </p>
                </div>

                {/* Botón guardar */}
                <button
                  onClick={() => handleSave(selectedSection)}
                  disabled={saving === selectedSection}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving === selectedSection ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}