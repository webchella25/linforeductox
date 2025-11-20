// app/dashboard/configuracion/seo-analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, BarChart3, Search, TrendingUp, Code, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface SeoConfig {
  id: string;
  googleSearchConsole: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  googleTagManagerId: string;
}

export default function SeoAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SeoConfig>({
    id: '',
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
        setConfig(data);
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
      console.error('Error:', error);
      toast.error('Error al guardar configuración');
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

  const integrationStatus = [
    {
      name: 'Google Search Console',
      active: !!config.googleSearchConsole,
      icon: Search,
    },
    {
      name: 'Google Analytics 4',
      active: !!config.googleAnalyticsId,
      icon: BarChart3,
    },
    {
      name: 'Meta Pixel',
      active: !!config.metaPixelId,
      icon: TrendingUp,
    },
    {
      name: 'Google Tag Manager',
      active: !!config.googleTagManagerId,
      icon: Code,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO y Analytics</h1>
        <p className="text-gray-600 mt-2">
          Configura las herramientas de seguimiento y optimización
        </p>
      </div>

      {/* ✅ NUEVA SECCIÓN: Redirecciones 301 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Redirecciones 301
              </h2>
              <p className="text-gray-600 mb-4">
                Gestiona redirecciones permanentes de URLs antiguas a nuevas. 
                Importante para mantener el SEO cuando cambias URLs.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Evita errores 404 en Google
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Mantiene el posicionamiento de páginas antiguas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Estadísticas de uso de cada redirección
                </li>
              </ul>
              <Link
                href="/dashboard/configuracion/seo-analytics/redirects"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Gestionar Redirecciones
                <ExternalLink size={18} />
              </Link>
            </div>
          </div>
        </div>
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

      {/* Meta Pixel */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={24} className="text-blue-500" />
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
            <li>Ve a <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer" className="underline">Meta Events Manager</a></li>
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
          <Code size={24} className="text-purple-600" />
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
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Guardando...
            </>
          ) : (
            <>
              <Save size={20} />
              Guardar Configuración
            </>
          )}
        </button>
      </div>

      {/* Estado de Integración */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estado de Integración
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrationStatus.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.active ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Icon size={20} className={item.active ? 'text-green-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className={`text-xs ${item.active ? 'text-green-600' : 'text-gray-500'}`}>
                    {item.active ? '✅ Configurado' : '⭕ No configurado'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}