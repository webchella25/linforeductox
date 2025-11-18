// app/dashboard/servicios/nuevo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/dashboard/RichTextEditor'; // ✅ AGREGAR

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ParentService {
  id: string;
  name: string;
  slug: string;
}

export default function NuevoServicioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentServices, setParentServices] = useState<ParentService[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    duration: '',
    price: '',
    categoryId: '',
    benefits: [''],
    conditions: [''],
    order: 0,
    active: true,
    isSubService: false,
    parentServiceId: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchParentServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const fetchParentServices = async () => {
    try {
      const res = await fetch('/api/services?parentOnly=true');
      if (res.ok) {
        const data = await res.json();
        setParentServices(data.services || []);
      }
    } catch (error) {
      console.error('Error cargando servicios padre:', error);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData({ ...formData, name, slug });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
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
    setFormData({ ...formData, conditions: [...formData.conditions, ''] });
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
      const benefits = formData.benefits.filter((b) => b.trim());
      const conditions = formData.conditions.filter((c) => c.trim());

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          duration: parseInt(formData.duration),
          categoryId: formData.categoryId,
          price: formData.price ? parseFloat(formData.price) : null,
          benefits,
          conditions,
          order: formData.order,
          active: formData.active,
          parentServiceId: formData.isSubService && formData.parentServiceId 
            ? formData.parentServiceId 
            : null,
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
        {/* ✅ NUEVO: Tipo de servicio */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isSubService}
              onChange={(e) => setFormData({ 
                ...formData, 
                isSubService: e.target.checked,
                parentServiceId: e.target.checked ? formData.parentServiceId : '',
              })}
              className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary rounded"
            />
            <div>
              <span className="text-gray-900 font-medium">
                Este es un subtratamiento (servicio hijo)
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Los subtratamientos aparecen dentro de un servicio principal y tienen su propia página individual
              </p>
            </div>
          </label>
        </div>

        {/* ✅ NUEVO: Selector de servicio padre (solo si es subtratamiento) */}
        {formData.isSubService && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicio Padre *
            </label>
            <select
              required={formData.isSubService}
              value={formData.parentServiceId}
              onChange={(e) => setFormData({ ...formData, parentServiceId: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona el servicio padre</option>
              {parentServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-2">
              Este subtratamiento aparecerá en la página de "{parentServices.find(s => s.id === formData.parentServiceId)?.name || 'servicio padre'}"
            </p>
          </div>
        )}

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
            placeholder="Ej: Masaje Relajante 60min"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
            placeholder="masaje-relajante-60min"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL: /servicios/{formData.slug || 'slug-del-servicio'}
          </p>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción con RichTextEditor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe el servicio en detalle... Puedes usar formato de texto enriquecido."
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Usa las herramientas de formato para destacar información importante
          </p>
        </div>

        {/* Duración y Precio */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración (minutos) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio (€)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="45.00"
            />
          </div>
        </div>

        {/* Beneficios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beneficios
          </label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2 mb-2">
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
            className="text-primary hover:underline text-sm"
          >
            + Añadir beneficio
          </button>
        </div>

        {/* Condiciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condiciones / Contraindicaciones
          </label>
          {formData.conditions.map((condition, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={condition}
                onChange={(e) => updateCondition(index, e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: No recomendado en embarazo"
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
            className="text-primary hover:underline text-sm"
          >
            + Añadir condición
          </button>
        </div>

        {/* Orden */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orden de visualización
          </label>
          <input
            type="number"
            min="0"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Determina el orden en la página de servicios
          </p>
        </div>

        {/* Estado */}
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