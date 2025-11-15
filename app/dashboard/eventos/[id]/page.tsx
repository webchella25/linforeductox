// app/dashboard/eventos/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/dashboard/ImageUploader';
import GalleryManager from '@/components/dashboard/GalleryManager';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

interface EventFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  locationDetails: string;
  eventType: string;
  price: number;
  isFree: boolean;
  maxPlaces: number | null;
  availablePlaces: number | null;
  heroImage: string;
  images: Array<{
    url: string;
    position: number;
    alt: string;
    publicId?: string;
  }>;
  videoUrl: string;
  includes: string[];
  whatToBring: string[];
  requirements: string;
  whatsappNumber: string;
  whatsappMessage: string;
  status: string;
  active: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === 'nuevo';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [includeInput, setIncludeInput] = useState('');
  const [bringInput, setBringInput] = useState('');

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    startDate: '',
    endDate: '',
    location: 'Centro',
    locationDetails: '',
    eventType: 'Taller',
    price: 0,
    isFree: false,
    maxPlaces: null,
    availablePlaces: null,
    heroImage: '',
    images: [],
    videoUrl: '',
    includes: [],
    whatToBring: [],
    requirements: '',
    whatsappNumber: '',
    whatsappMessage: '',
    status: 'UPCOMING',
    active: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchEvent();
    }
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${resolvedParams.id}`);
      if (res.ok) {
        const event = await res.json();
        
        // Parsear images
        let parsedImages = [];
        try {
          if (event.images) {
            parsedImages = typeof event.images === 'string' 
              ? JSON.parse(event.images) 
              : event.images;
          }
        } catch (error) {
          console.error('Error parsing images:', error);
        }

        // Formatear fechas para input datetime-local
        const formatDateForInput = (date: string) => {
          if (!date) return '';
          const d = new Date(date);
          return d.toISOString().slice(0, 16);
        };

        setFormData({
          title: event.title,
          slug: event.slug,
          shortDescription: event.shortDescription || '',
          description: event.description || '',
          startDate: formatDateForInput(event.startDate),
          endDate: event.endDate ? formatDateForInput(event.endDate) : '',
          location: event.location || 'Centro',
          locationDetails: event.locationDetails || '',
          eventType: event.eventType || 'Taller',
          price: event.price || 0,
          isFree: event.isFree || false,
          maxPlaces: event.maxPlaces,
          availablePlaces: event.availablePlaces,
          heroImage: event.heroImage || '',
          images: Array.isArray(parsedImages) ? parsedImages : [],
          videoUrl: event.videoUrl || '',
          includes: event.includes || [],
          whatToBring: event.whatToBring || [],
          requirements: event.requirements || '',
          whatsappNumber: event.whatsappNumber || '',
          whatsappMessage: event.whatsappMessage || '',
          status: event.status || 'UPCOMING',
          active: event.active,
        });
      } else {
        toast.error('Error al cargar el evento');
        router.push('/dashboard/eventos');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      title: name,
      slug: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    });
  };

  const addInclude = () => {
    if (includeInput.trim()) {
      setFormData({
        ...formData,
        includes: [...formData.includes, includeInput.trim()],
      });
      setIncludeInput('');
    }
  };

  const removeInclude = (index: number) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((_, i) => i !== index),
    });
  };

  const addBring = () => {
    if (bringInput.trim()) {
      setFormData({
        ...formData,
        whatToBring: [...formData.whatToBring, bringInput.trim()],
      });
      setBringInput('');
    }
  };

  const removeBring = (index: number) => {
    setFormData({
      ...formData,
      whatToBring: formData.whatToBring.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = {
        ...formData,
        price: formData.isFree ? 0 : Number(formData.price),
        maxPlaces: formData.maxPlaces ? Number(formData.maxPlaces) : null,
        availablePlaces: formData.availablePlaces ? Number(formData.availablePlaces) : null,
      };

      const url = isNew ? '/api/events' : `/api/events/${resolvedParams.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        toast.success(isNew ? 'Evento creado' : 'Evento actualizado');
        router.push('/dashboard/eventos');
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el evento');
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
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/eventos"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? 'Nuevo Evento' : 'Editar Evento'}
          </h1>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información Básica */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Información Básica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Evento *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Taller de Autocuidado Facial"
              />
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /eventos/{formData.slug || 'slug-del-evento'}
              </p>
            </div>

            {/* Descripción Corta */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Corta * (para listado)
              </label>
              <textarea
                required
                rows={2}
                maxLength={200}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Breve descripción del evento (máx. 200 caracteres)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.shortDescription.length}/200 caracteres
              </p>
            </div>

            {/* Tipo de Evento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evento *
              </label>
              <select
                required
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Taller">Taller</option>
                <option value="Charla">Charla</option>
                <option value="Retiro">Retiro</option>
                <option value="Evento Especial">Evento Especial</option>
                <option value="Colaboración">Colaboración</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="DRAFT">Borrador</option>
                <option value="UPCOMING">Próximo</option>
                <option value="ONGOING">En curso</option>
                <option value="FINISHED">Finalizado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            {/* Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora de Inicio *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora de Fin (opcional)
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Activo */}
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Evento activo (visible en la web)
              </label>
            </div>
          </div>
        </div>

        {/* Descripción Completa */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Descripción Completa
          </h2>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Describe el evento en detalle: qué se hará, objetivos, beneficios..."
          />
        </div>

{/* Ubicación */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Ubicación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Ubicación *
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Centro">En el Centro LINFOREDUCTOX</option>
                <option value="Online">Online</option>
                <option value="Otra">Otra ubicación</option>
              </select>
            </div>

            {/* Detalles de Ubicación */}
            {formData.location === 'Otra' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección Completa
                </label>
                <input
                  type="text"
                  value={formData.locationDetails}
                  onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Calle Mayor 123, Madrid"
                />
              </div>
            )}
          </div>
        </div>

        {/* Precio y Plazas */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Precio y Plazas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gratuito */}
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="isFree"
                checked={formData.isFree}
                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked, price: 0 })}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                Evento gratuito
              </label>
            </div>

            {/* Precio */}
            {!formData.isFree && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Plazas Máximas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plazas Máximas (opcional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxPlaces || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maxPlaces: e.target.value ? parseInt(e.target.value) : null,
                  availablePlaces: e.target.value ? parseInt(e.target.value) : null,
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: 20"
              />
            </div>

            {/* Plazas Disponibles */}
            {formData.maxPlaces && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazas Disponibles
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.maxPlaces}
                  value={formData.availablePlaces || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    availablePlaces: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Actualizarás esto conforme se inscriban personas
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Imágenes
          </h2>

          {/* Hero Image */}
          <div>
            <ImageUploader
              value={formData.heroImage}
              onChange={(url) => setFormData({ ...formData, heroImage: url })}
              onRemove={() => setFormData({ ...formData, heroImage: '' })}
              label="Imagen Principal"
              aspectRatio="16/9"
              maxSizeMB={5}
            />
            <p className="text-xs text-gray-500 mt-2">
              Esta imagen se mostrará en la cabecera del evento. Recomendado: 1920x1080px
            </p>
          </div>

          {/* Galería */}
          <div className="pt-6 border-t">
            <GalleryManager
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              maxImages={5}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Para eventos pasados, agrega fotos del evento realizado
            </p>
          </div>

          {/* Video */}
          <div className="pt-6 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Promocional (opcional)
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 mt-1">
              URL de YouTube o Vimeo
            </p>
          </div>
        </div>

        {/* ¿Qué Incluye? */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              ¿Qué Incluye el Evento?
            </h2>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={includeInput}
              onChange={(e) => setIncludeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Material incluido, Café y snacks..."
            />
            <button
              type="button"
              onClick={addInclude}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              <Plus size={20} />
            </button>
          </div>

          {formData.includes.length > 0 && (
            <div className="space-y-2">
              {formData.includes.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ¿Qué Llevar? */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              ¿Qué Debe Llevar el Participante?
            </h2>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={bringInput}
              onChange={(e) => setBringInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBring())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Ropa cómoda, Esterilla..."
            />
            <button
              type="button"
              onClick={addBring}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              <Plus size={20} />
            </button>
          </div>

          {formData.whatToBring.length > 0 && (
            <div className="space-y-2">
              {formData.whatToBring.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <span className="flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeBring(index)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requisitos */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Requisitos
          </h2>
          <textarea
            rows={4}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Ej: Edad mínima 18 años, Nivel principiante..."
          />
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Inscripción por WhatsApp
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Número */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: +34612345678"
              />
              <p className="text-xs text-gray-500 mt-1">
                Incluye el código del país
              </p>
            </div>

            {/* Mensaje pre-rellenado */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje Pre-rellenado (opcional)
              </label>
              <textarea
                rows={3}
                value={formData.whatsappMessage}
                onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Hola, me gustaría inscribirme al evento..."
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end bg-white rounded-xl shadow-sm p-6">
          <Link
            href="/dashboard/eventos"
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
                {isNew ? 'Crear Evento' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}