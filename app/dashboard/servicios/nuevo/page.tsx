// app/dashboard/servicios/nuevo/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FAQ {
  question: string;
  answer: string;
}

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

  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: '', answer: '' }
  ]);

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

  // ✅ FUNCIONES PARA FAQS
  const addFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const benefits = formData.benefits.filter((b) => b.trim() !== '');
      const conditions = formData.conditions.filter((c) => c.trim() !== '');
      
      // ✅ Filtrar FAQs vacías
      const validFaqs = faqs.filter(
        (faq) => faq.question.trim() !== '' && faq.answer.trim() !== ''
      );

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          benefits,
          conditions,
          faqs: validFaqs.length > 0 ? validFaqs : null, // ✅ ENVIAR FAQS
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
            La URL será: /servicios/{formData.slug || 'slug-del-servicio'}
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Describe en qué consiste este tratamiento..."
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
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="45.00"
            />
            <p className="text-sm text-gray-500 mt-1">
              Deja vacío si no quieres mostrar precio
            </p>
          </div>
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
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Beneficios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beneficios
          </label>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder="Ej: Mejora la circulación linfática"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addBenefit}
            className="mt-2 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Plus size={18} />
            Añadir beneficio
          </button>
        </div>

        {/* Indicado para */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indicado para
          </label>
          <div className="space-y-2">
            {formData.conditions.map((condition, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => updateCondition(index, e.target.value)}
                  placeholder="Ej: Personas con retención de líquidos"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCondition}
            className="mt-2 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Plus size={18} />
            Añadir indicación
          </button>
        </div>

        {/* ✅ SECCIÓN FAQs */}
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Preguntas Frecuentes (FAQ) 💡
            </h3>
            <p className="text-sm text-gray-600">
              Las FAQs mejoran el SEO y ayudan a los clientes a resolver dudas antes de contactar
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Pregunta {index + 1}</h4>
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
                      title="Eliminar pregunta"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pregunta
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="Ej: ¿Cuántas sesiones necesito?"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Respuesta
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      placeholder="Ej: Se recomienda un mínimo de 6-8 sesiones para ver resultados óptimos..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addFAQ}
            className="mt-4 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Plus size={18} />
            Añadir otra pregunta
          </button>
        </div>

        {/* Orden */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orden de visualización
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => {
              const value = e.target.value;
              setFormData({
                ...formData,
                order: value === '' ? 0 : parseInt(value) || 0
              });
            }}
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