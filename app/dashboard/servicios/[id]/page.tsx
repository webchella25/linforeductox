// app/dashboard/servicios/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Plus, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function EditarServicioPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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
  const [faqs, setFaqs] = useState<FAQ[]>([{ question: '', answer: '' }]);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${id}`);
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
        
        // ✅ Cargar FAQs existentes
        if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs);
        } else {
          setFaqs([{ question: '', answer: '' }]);
        }
      } else {
        toast.error('Error al cargar el servicio');
        router.push('/dashboard/servicios');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el servicio');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Filtrar FAQs vacías
      const validFaqs = faqs.filter(
        (faq) => faq.question.trim() !== '' && faq.answer.trim() !== ''
      );

      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          faqs: validFaqs.length > 0 ? validFaqs : null, // ✅ ENVIAR FAQS
        }),
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

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

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
                min="15"
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
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
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
              <option value="">Seleccionar...</option>
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
            <div className="space-y-2 mb-2">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1 text-gray-700">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                placeholder="Nuevo beneficio..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Indicado para */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indicado para
            </label>
            <div className="space-y-2 mb-2">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1 text-gray-700">{condition}</span>
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                placeholder="Nueva indicación..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={addCondition}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <Plus size={20} />
              </button>
            </div>
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
              Orden
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Servicio activo (visible en la web)
              </span>
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-6 border-t mt-6">
          <button
            type="button"
            onClick={() => router.push('/dashboard/servicios')}
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
                Guardando...
              </>
            ) : (
              <>
                <Save size={20} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}