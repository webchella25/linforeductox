// app/dashboard/servicios/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/dashboard/ImageUploader';
import GalleryManager from '@/components/dashboard/GalleryManager';
import SubTreatmentsManager from '@/components/dashboard/SubTreatmentsManager';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

interface ServiceFormData {
  name: string;
  slug: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  benefits: string[];
  conditions: string[];
  active: boolean;
  heroImage: string;
  images: Array<{
    url: string;
    position: number;
    alt: string;
    publicId?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
    order: number;
  }>;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditServicePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'nuevo';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    slug: '',
    category: 'corporal',
    description: '',
    duration: 60,
    price: 0,
    benefits: [''],
    conditions: [''],
    active: true,
    heroImage: '',
    images: [],
    faqs: [],
  });

  // ✅ Cargar categorías dinámicamente desde la BD
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  useEffect(() => {
    if (!isNew) {
      fetchService();
    }
  }, [resolvedParams.id]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${resolvedParams.id}`);
      if (res.ok) {
        const service = await res.json();
        setFormData({
          name: service.name,
          slug: service.slug,
          category: service.category,
          description: service.description,
          duration: service.duration,
          price: service.price || 0,
          benefits: service.benefits.length > 0 ? service.benefits : [''],
          conditions: service.conditions.length > 0 ? service.conditions : [''],
          active: service.active,
          heroImage: service.heroImage || '',
          images: service.images || [],
          faqs: service.faqs || [],
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const handleConditionChange = (index: number, value: string) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = value;
    setFormData({ ...formData, conditions: newConditions });
  };

  const addCondition = () => {
    setFormData({ ...formData, conditions: [...formData.conditions, ''] });
  };

  const removeCondition = (index: number) => {
    const newConditions = formData.conditions.filter((_, i) => i !== index);
    setFormData({ ...formData, conditions: newConditions });
  };

  // ✅ NUEVO: Gestión de FAQs
  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '', order: formData.faqs.length }],
    });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    const newFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    const cleanedBenefits = formData.benefits.filter((b) => b.trim() !== '');
    const cleanedConditions = formData.conditions.filter((c) => c.trim() !== '');
    const cleanedFaqs = formData.faqs.filter((f) => f.question.trim() !== '' && f.answer.trim() !== '');

    const dataToSend = {
      ...formData,
      benefits: cleanedBenefits,
      conditions: cleanedConditions,
      faqs: cleanedFaqs,
      duration: Number(formData.duration) || 60,
      price: formData.price ? Number(formData.price) : null,
    };

    const url = isNew ? '/api/services' : `/api/services/${resolvedParams.id}`;
    const method = isNew ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      const data = await res.json();
      
      if (isNew) {
        // ✅ NUEVO: Redirigir a editar el servicio recién creado
        toast.success('Servicio creado. Ahora puedes añadir imágenes, FAQs y subtratamientos');
        router.push(`/dashboard/servicios/${data.service.id}`);
      } else {
        // ✅ Al editar, quedarse en la misma página y refrescar
        toast.success('Servicio actualizado correctamente');
        router.refresh();
      }
    } else {
      const error = await res.json();
      toast.error(error.error || 'Error al guardar');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al guardar el servicio');
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/servicios"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Nuevo Servicio' : 'Editar Servicio'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Información Básica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Drenaje Linfático Corporal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL amigable) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                placeholder="drenaje-linfatico-corporal"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /servicios/{formData.slug || 'slug-del-servicio'}
              </p>
            </div>

            {/* ✅ Categoría dinámica desde BD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

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
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (€) - Opcional
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Servicio activo (visible en la web)
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Descripción completa del servicio con formato rico..."
            />
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Imágenes
          </h2>

          <div>
            <ImageUploader
              value={formData.heroImage}
              onChange={(url) => setFormData({ ...formData, heroImage: url })}
              onRemove={() => setFormData({ ...formData, heroImage: '' })}
              label="Imagen Principal (Hero)"
              aspectRatio="16/9"
              maxSizeMB={5}
            />
            <p className="text-xs text-gray-500 mt-2">
              Esta imagen se mostrará en la cabecera de la página del servicio. Recomendado: 1920x1080px
            </p>
          </div>

          <div className="pt-6 border-t">
            <GalleryManager
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              maxImages={3}
            />
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Beneficios</h2>
            <button
              type="button"
              onClick={addBenefit}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              + Agregar
            </button>
          </div>

          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Reduce la retención de líquidos"
              />
              {formData.benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Indicaciones */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Indicaciones / Para quién es ideal
            </h2>
            <button
              type="button"
              onClick={addCondition}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              + Agregar
            </button>
          </div>

          {formData.conditions.map((condition, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={condition}
                onChange={(e) => handleConditionChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Personas con celulitis"
              />
              {formData.conditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ✅ FAQs */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes (FAQs)</h2>
              <p className="text-sm text-gray-600 mt-1">Añade preguntas y respuestas sobre este servicio</p>
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              + Agregar FAQ
            </button>
          </div>

          {formData.faqs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay preguntas frecuentes. Haz clic en "Agregar FAQ" para añadir una.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">FAQ #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pregunta
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="¿Cuánto dura el tratamiento?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Respuesta
                    </label>
                    <RichTextEditor
                      value={faq.answer}
                      onChange={(value) => handleFaqChange(index, 'answer', value)}
                      placeholder="Escribe la respuesta con formato..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
          <Link
            href="/dashboard/servicios"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={20} />
                {isNew ? 'Crear Servicio' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
	          {/* ✅ SUBTRATAMIENTOS - Solo mostrar si NO es nuevo */}
        {!isNew && (
          <div className="mt-8">
            <SubTreatmentsManager serviceId={resolvedParams.id} />
          </div>
        )}
    </div>
  );
}