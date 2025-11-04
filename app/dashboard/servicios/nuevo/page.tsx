// app/dashboard/servicios/nuevo/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NuevoServicioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    duration: 60,
    price: '',
    category: 'corporal',
    benefits: [''],
    conditions: [''],
    active: true,
    order: 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ''],
    });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, ''],
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index),
    });
  };

  const updateCondition = (index: number, value: string) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = value;
    setFormData({ ...formData, conditions: newConditions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const benefits = formData.benefits.filter((b) => b.trim() !== '');
      const conditions = formData.conditions.filter((c) => c.trim() !== '');

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          benefits,
          conditions,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Servicio creado correctamente');
        router.push('/dashboard/servicios');
      } else {
        toast.error(data.error || 'Error al crear el servicio');
      }
    } catch (error) {
      toast.error('Error al crear el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/servicios"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
        >
          <ArrowLeft size={20} />
          Volver a servicios
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Servicio</h1>
        <p className="text-gray-600 mt-2">
          Crea un nuevo servicio que aparecerá en la web
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del servicio *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Masaje Ayurvédico"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL) *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="masaje-ayurvedico"
          />
          <p className="text-sm text-gray-500 mt-1">
            URL: /servicios/{formData.slug || 'slug'}
          </p>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="corporal">Corporal</option>
            <option value="facial">Facial</option>
            <option value="acupuntura">Acupuntura</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Describe el servicio en detalle..."
          />
        </div>

        {/* Duración y Precio */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración (minutos) *
            </label>
            <input
              type="number"
              required
              min="15"
              step="15"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Opcional"
            />
          </div>
        </div>

        {/* Beneficios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beneficios
          </label>
          <div className="space-y-3">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Reduce el estrés"
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBenefit}
              className="text-primary hover:text-primary-dark font-medium"
            >
              + Añadir beneficio
            </button>
          </div>
        </div>

        {/* Condiciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condiciones que trata
          </label>
          <div className="space-y-3">
            {formData.conditions.map((condition, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => updateCondition(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Dolor muscular"
                />
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCondition}
              className="text-primary hover:text-primary-dark font-medium"
            >
              + Añadir condición
            </button>
          </div>
        </div>

        {/* Orden y Estado */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Orden
  </label>
  <input
    type="number"
    min="0"
    value={formData.order || 0}  // ✅ Fallback a 0
    onChange={(e) => {
      const value = e.target.value;
      setFormData({ 
        ...formData, 
        order: value === '' ? 0 : parseInt(value) || 0  // ✅ Manejo de string vacío
      });
    }}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
  />
  <p className="text-sm text-gray-500 mt-1">
    Determina el orden en la página de servicios
  </p>
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary rounded"
              />
              <span className="text-gray-700">Servicio activo (visible en la web)</span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creando...
              </>
            ) : (
              <>
                <Save size={20} />
                Crear Servicio
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}