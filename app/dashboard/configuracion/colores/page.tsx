// app/dashboard/configuracion/colores/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, RotateCcw, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const PRESETS = {
  verde: {
    name: 'Verde Natural',
    primaryColor: '#2C5F2D',
    primaryDark: '#1e3d1f',
    secondaryColor: '#A27B5C',
    secondaryLight: '#b89171',
    creamColor: '#F5F1E8',
  },
  dorado: {
    name: 'Dorado Elegante',
    primaryColor: '#B8860B',
    primaryDark: '#8B6914',
    secondaryColor: '#D4AF37',
    secondaryLight: '#E5C158',
    creamColor: '#FFF8DC',
  },
  rosa: {
    name: 'Rosa Suave',
    primaryColor: '#C97D8C',
    primaryDark: '#A35866',
    secondaryColor: '#E8B4BC',
    secondaryLight: '#F0D0D5',
    creamColor: '#FFF5F7',
  },
  azul: {
    name: 'Azul Relajante',
    primaryColor: '#4A7C9C',
    primaryDark: '#2D5A75',
    secondaryColor: '#7BA8C0',
    secondaryLight: '#A1C4D9',
    creamColor: '#F0F8FF',
  },
};

export default function ColoresPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [colors, setColors] = useState({
    primaryColor: '#2C5F2D',
    primaryDark: '#1e3d1f',
    secondaryColor: '#A27B5C',
    secondaryLight: '#b89171',
    creamColor: '#F5F1E8',
    textColor: '#1F2937',
  });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const res = await fetch('/api/config/colors');
      if (res.ok) {
        const data = await res.json();
        setColors({
          primaryColor: data.primaryColor,
          primaryDark: data.primaryDark,
          secondaryColor: data.secondaryColor,
          secondaryLight: data.secondaryLight,
          creamColor: data.creamColor,
          textColor: data.textColor,
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
      const res = await fetch('/api/config/colors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colors),
      });

      if (res.ok) {
        toast.success('Colores actualizados. Recarga la página para ver los cambios.');
      } else {
        toast.error('Error al guardar');
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (preset: keyof typeof PRESETS) => {
    setColors({
      ...colors,
      ...PRESETS[preset],
    });
    toast.success(`Preset "${PRESETS[preset].name}" aplicado`);
  };

  if (loading) {
    return <div className="flex justify-center p-12">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Colores de la Web</h1>
        <p className="text-gray-600 mt-2">
          Personaliza los colores principales de tu sitio web
        </p>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette size={24} />
          Estilos Predefinidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: preset.secondaryColor }}
                />
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: preset.creamColor }}
                />
              </div>
              <p className="font-medium text-sm">{preset.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor de Colores */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Colores Personalizados</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Primario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Primario
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={colors.primaryColor}
                onChange={(e) => setColors({ ...colors, primaryColor: e.target.value })}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.primaryColor}
                onChange={(e) => setColors({ ...colors, primaryColor: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="#2C5F2D"
              />
            </div>
          </div>

          {/* Color Primario Oscuro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Primario Oscuro
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={colors.primaryDark}
                onChange={(e) => setColors({ ...colors, primaryDark: e.target.value })}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.primaryDark}
                onChange={(e) => setColors({ ...colors, primaryDark: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Color Secundario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario (Dorado)
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={colors.secondaryColor}
                onChange={(e) => setColors({ ...colors, secondaryColor: e.target.value })}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.secondaryColor}
                onChange={(e) => setColors({ ...colors, secondaryColor: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Color Secundario Claro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario Claro
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={colors.secondaryLight}
                onChange={(e) => setColors({ ...colors, secondaryLight: e.target.value })}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.secondaryLight}
                onChange={(e) => setColors({ ...colors, secondaryLight: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Color Crema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo Suave
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={colors.creamColor}
                onChange={(e) => setColors({ ...colors, creamColor: e.target.value })}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.creamColor}
                onChange={(e) => setColors({ ...colors, creamColor: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Color de Texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Texto
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={colors.textColor}
                onChange={(e) => setColors({ ...colors, textColor: e.target.value })}
                className="w-16 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={colors.textColor}
                onChange={(e) => setColors({ ...colors, textColor: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>
        <div className="space-y-4">
          <div className="p-6 rounded-lg" style={{ backgroundColor: colors.creamColor }}>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: colors.primaryColor }}
            >
              Título Principal
            </h3>
            <p style={{ color: colors.textColor }}>
              Este es un texto de ejemplo con el color de texto principal.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                className="px-6 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: colors.primaryColor }}
              >
                Botón Primario
              </button>
              <button
                className="px-6 py-3 rounded-lg text-white font-semibold"
                style={{ backgroundColor: colors.secondaryColor }}
              >
                Botón Secundario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={fetchColors}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RotateCcw size={20} />
          Resetear
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {/* Aviso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Después de guardar los colores, recarga la página para ver los cambios aplicados en toda la web.
        </p>
      </div>
    </div>
  );
}