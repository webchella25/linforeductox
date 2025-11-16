// app/dashboard/configuracion/seo-analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Search, BarChart3, Share2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SeoAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    googleSearchConsole: '',
    googleAnalyticsId: '',
    metaPixelId: '',
    googleTagManagerId: '',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config/seo-analytics');
      if (res.ok) {
        const data = await res.json();
        setConfig({
          googleSearchConsole: data.googleSearchConsole || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          metaPixelId: data.metaPixelId || '',
          googleTagManagerId: data.googleTagManagerId || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/config/seo-analytics', {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO y Analytics</h1>
          <p className="text-gray-600 mt-2">
            Configura las herramientas de seguimiento y optimización
          </p>
        </div>
        <BarChart3 size={40} className="text-primary" />
      </div>

      {/* Google Search Console */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Google Search Console</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Verifica tu sitio web en Google Search Console para monitorear el rendimiento en búsquedas.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Verificación
          </label>
          <input
            type="text"
            value={config.googleSearchConsole}
            onChange={(e) => setConfig({ ...config, googleSearchConsole: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            placeholder="abc123def456ghi789..."
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 Ve a Google Search Console → Configuración → Verificación de propiedad → Etiqueta HTML
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">📋 Instrucciones:</p>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Ve a <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="underline">search.google.com/search-console</a></li>
            <li>Agrega tu propiedad: <code className="bg-blue-100 px-1 rounded">https://linforeductox.com</code></li>
            <li>Elige "Etiqueta HTML"</li>
            <li>Copia solo el código entre comillas: <code className="bg-blue-100 px-1 rounded">content="..."</code></li>
            <li>Pégalo arriba y guarda</li>
          </ol>
        </div>
      </div>

      {/* Google Analytics 4 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 size={24} className="text-orange-600" />
          <h2 className="text-xl font-semibold">Google Analytics 4</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Mide el tráfico y comportamiento de los usuarios en tu web.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID de Medición (Measurement ID)
          </label>
          <input
            type="text"
            value={config.googleAnalyticsId}
            onChange={(e) => setConfig({ ...config, googleAnalyticsId: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            placeholder="G-XXXXXXXXXX"
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 Formato: G-XXXXXXXXXX (empieza con "G-")
          </p>
        </div>

        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-800 font-medium mb-2">📋 Instrucciones:</p>
          <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
            <li>Ve a <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline">analytics.google.com</a></li>
            <li>Crea una cuenta o usa una existente</li>
            <li>Crea una propiedad GA4</li>
            <li>Copia el "ID de medición" (G-XXXXXXXXXX)</li>
            <li>Pégalo arriba y guarda</li>
          </ol>
        </div>
      </div>

      {/* Meta Pixel (Facebook) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Share2 size={24} className="text-blue-500" />
          <h2 className="text-xl font-semibold">Meta Pixel (Facebook)</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Rastrea conversiones y crea audiencias personalizadas para anuncios en Facebook e Instagram.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pixel ID
          </label>
          <input
            type="text"
            value={config.metaPixelId}
            onChange={(e) => setConfig({ ...config, metaPixelId: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            placeholder="123456789012345"
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 Solo números (15-16 dígitos)
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">📋 Instrucciones:</p>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Ve a <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noopener noreferrer" className="underline">Meta Events Manager</a></li>
            <li>Selecciona tu Pixel o crea uno nuevo</li>
            <li>Ve a "Configuración"</li>
            <li>Copia el "ID del píxel" (solo números)</li>
            <li>Pégalo arriba y guarda</li>
          </ol>
        </div>
      </div>

      {/* Google Tag Manager */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Tag size={24} className="text-purple-600" />
          <h2 className="text-xl font-semibold">Google Tag Manager</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Gestiona todos tus códigos de seguimiento desde un solo lugar (opcional pero recomendado).
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Container ID
          </label>
          <input
            type="text"
            value={config.googleTagManagerId}
            onChange={(e) => setConfig({ ...config, googleTagManagerId: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            placeholder="GTM-XXXXXXX"
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 Formato: GTM-XXXXXXX (empieza con "GTM-")
          </p>
        </div>

        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800 font-medium mb-2">📋 Instrucciones:</p>
          <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
            <li>Ve a <a href="https://tagmanager.google.com" target="_blank" rel="noopener noreferrer" className="underline">tagmanager.google.com</a></li>
            <li>Crea una cuenta y un contenedor</li>
            <li>Copia el "ID del contenedor" (GTM-XXXXXXX)</li>
            <li>Pégalo arriba y guarda</li>
            <li>⚠️ Si usas GTM, configura Analytics y Pixel DESDE GTM, no arriba</li>
          </ol>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {/* Info adicional */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6">
        <div className="flex gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <h3 className="font-bold text-green-900 mb-2">Estado de Integración</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center gap-2">
                {config.googleSearchConsole ? '✅' : '⭕'} Google Search Console
              </div>
              <div className="flex items-center gap-2">
                {config.googleAnalyticsId ? '✅' : '⭕'} Google Analytics 4
              </div>
              <div className="flex items-center gap-2">
                {config.metaPixelId ? '✅' : '⭕'} Meta Pixel
              </div>
              <div className="flex items-center gap-2">
                {config.googleTagManagerId ? '✅' : '⭕'} Google Tag Manager
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}