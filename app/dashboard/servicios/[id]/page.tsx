// app/dashboard/servicios/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import RichTextEditor from '@/components/dashboard/RichTextEditor';
import SubTreatmentsManager from '@/components/dashboard/SubTreatmentsManager';
import ImageUpload from '@/components/dashboard/ImageUploader';

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

interface FAQ {
  question: string;
  answer: string;
}

export default function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'nuevo';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
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
    heroImage: '',
    images: [] as string[],
    isSubService: false,
    parentServiceId: '',
  });

  const [faqs, setFaqs] = useState<FAQ[]>([{ question: '', answer: '' }]);

  useEffect(() => {
    fetchCategories();
    fetchParentServices();
    if (!isNew) {
      fetchService();
    }
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
        // Filtrar el servicio actual para que no se pueda seleccionar a sí mismo
        setParentServices(
          data.services.filter((s: ParentService) => s.id !== resolvedParams.id)
        );
      }
    } catch (error) {
      console.error('Error cargando servicios padre:', error);
    }
  };

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${resolvedParams.id}`);
      if (res.ok) {
        const service = await res.json();

        setFormData({
          name: service.name,
          slug: service.slug,
          description: service.description,
          duration: service.duration.toString(),
          price: service.price?.toString() || '',
          categoryId: service.categoryId || '',
          benefits: service.benefits.length > 0 ? service.benefits : [''],
          conditions: service.conditions.length > 0 ? service.conditions : [''],
          order: service.order,
          active: service.active,
          heroImage: service.heroImage || '',
          images: Array.isArray(service.images)
            ? service.images.map((img: any) => img.url || img)
            : [],
          isSubService: service.parentServiceId ? true : false,
          parentServiceId: service.parentServiceId || '',
        });

        if (service.faqs && service.faqs.length > 0) {
          setFaqs(service.faqs.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer,
          })));
        }
      } else {
        toast.error('Servicio no encontrado');
        router.push('/dashboard/servicios');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar servicio');
    } finally {
      setLoading(false);
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

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const benefits = formData.benefits.filter((b) => b.trim());
      const conditions = formData.conditions.filter((c) => c.trim());
      const validFaqs = faqs.filter((faq) => faq.question.trim() && faq.answer.trim());

      const dataToSend = {
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
        heroImage: formData.heroImage || null,
        images: formData.images.length > 0 ? formData.images : null,
        faqs: validFaqs.length > 0 ? validFaqs : null,
        parentServiceId: formData.isSubService && formData.parentServiceId 
          ? formData.parentServiceId 
          : null,
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
          toast.success('Servicio creado. Ahora puedes añadir más detalles');
          router.push(`/dashboard/servicios/${data.service.id}`);
        } else {
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
            {/* ✅ NUEVO: Tipo de servicio */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 md:col-span-2">
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
                    Los subtratamientos aparecen dentro de un servicio principal y tienen su propia página
                  </p>
                </div>
              </label>
            </div>

            {/* ✅ NUEVO: Selector de servicio padre */}
            {formData.isSubService && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicio Padre *
                </label>
                <select
                  required={formData.isSubService}
                  value={formData.parentServiceId}
                  onChange={(e) => setFormData({ ...formData, parentServiceId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecciona el servicio padre</option>
                  {parentServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {formData.parentServiceId && (
                  <p className="text-sm text-gray-600 mt-2">
                    Este subtratamiento aparecerá en la página de "{parentServices.find(s => s.id === formData.parentServiceId)?.name}"
                  </p>
                )}
              </div>
            )}

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
                placeholder="Ej: Masaje Relajante 60min"
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
                placeholder="masaje-relajante-60min"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /servicios/{formData.slug || 'slug-del-servicio'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="45.00"
              />
            </div>

<div className="md:col-span-2">
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
</div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 rounded-lg">
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
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Imágenes
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen Principal (Hero)
            </label>
            <ImageUpload
              value={formData.heroImage}
              onChange={(url) => setFormData({ ...formData, heroImage: url })}
              folder="services"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galería de Imágenes
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Sube múltiples imágenes para la galería del servicio
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <ImageUpload
                value=""
                onChange={(url) => {
                  setFormData({ ...formData, images: [...formData.images, url] });
                }}
                folder="services"
              />
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Beneficios
          </h2>

          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Reduce el estrés y la ansiedad"
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addBenefit}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Plus size={18} />
            Añadir beneficio
          </button>
        </div>

        {/* Condiciones */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Condiciones / Contraindicaciones
          </h2>

          {formData.conditions.map((condition, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={condition}
                onChange={(e) => updateCondition(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: No recomendado durante el embarazo"
              />
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addCondition}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Plus size={18} />
            Añadir condición
          </button>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Preguntas Frecuentes (FAQs)
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Añade preguntas y respuestas comunes sobre este servicio
              </p>
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Plus size={18} />
              Añadir FAQ
            </button>
          </div>

          {faqs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay FAQs todavía. Haz clic en "Añadir FAQ" para crear una.
            </p>
          ) : (
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">FAQ #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
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
                      placeholder="¿Pregunta frecuente?"
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

     
      
    </div>
  );
}