// app/dashboard/servicios/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react'; // ✅ Importar use
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>; // ✅ params es Promise
}

export default function EditarServicioPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params); // ✅ Unwrap params con use()
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    duration: 60,
    price: 0,
    category: '',
    benefits: [] as string[],
    conditions: [] as string[],
    active: true,
    order: 0,
  });

  const [benefitInput, setBenefitInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${id}`); // ✅ Ahora id está disponible
      const data = await res.json();

      if (res.ok) {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          duration: data.duration || 60,
          price: data.price || 0,
          category: data.category || '',
          benefits: data.benefits || [],
          conditions: data.conditions || [],
          active: data.active ?? true,
          order: data.order || 0,
        });
      } else {
        toast.error('Error al cargar el servicio');
        router.push('/dashboard/servicios');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el servicio');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Servicio actualizado correctamente');
        router.push('/dashboard/servicios');
      } else {
        toast.error('Error al actualizar el servicio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, benefitInput.trim()],
      });
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setFormData({
        ...formData,
        conditions: [...formData.conditions, conditionInput.trim()],
      });
      setConditionInput('');
    }
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/servicios"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Servicio</h1>
          <p className="text-gray-600 mt-2">Modifica los detalles del servicio</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tratamiento-corporal"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Duración y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (minutos) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Seleccionar categoría</option>
              <option value="corporal">Corporal</option>
              <option value="facial">Facial</option>
              <option value="acupuntura">Acupuntura</option>
            </select>
          </div>

          {/* Beneficios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficios
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                placeholder="Añadir beneficio..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Añadir
              </button>
            </div>
            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Condiciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condiciones que trata
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                placeholder="Añadir condición..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={addCondition}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Añadir
              </button>
            </div>
            <div className="space-y-2">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1">{condition}</span>
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active y Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Servicio activo
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <Link
              href="/dashboard/servicios"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}