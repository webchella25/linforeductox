// app/testimonios/nuevo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
}

export default function NewTestimonialPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    rating: 5,
    text: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar servicios disponibles
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services?active=true');
        const data = await res.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Error cargando servicios:', error);
      }
    }
    fetchServices();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.service) {
      newErrors.service = 'Debes seleccionar un servicio';
    }

    if (formData.text.trim().length < 10) {
      newErrors.text = 'El testimonio debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/testimonials/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        // Manejar errores de validación del backend
        if (data.details) {
          const backendErrors: Record<string, string> = {};
          data.details.forEach((issue: any) => {
            if (issue.path && issue.path.length > 0) {
              backendErrors[issue.path[0]] = issue.message;
            }
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.error || 'Error al enviar el testimonio' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-cream/30">
        <div className="max-w-md mx-auto text-center p-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-primary mb-4">
            ¡Gracias por tu Testimonio!
          </h1>
          <p className="text-gray-700 mb-8">
            Tu opinión ha sido enviada correctamente y será revisada por nuestro equipo.
            Una vez aprobada, aparecerá en nuestra página de testimonios.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/testimonios"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Ver Testimonios
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 py-16">
      <div className="container-custom max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Comparte tu Experiencia
          </h1>
          <p className="text-xl text-gray-700">
            Tu opinión nos ayuda a mejorar y a que otros descubran LINFOREDUCTOX
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {errors.general}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="María García"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="maria@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                No compartiremos tu email. Solo lo usamos para verificación.
              </p>
            </div>

            {/* Servicio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ¿Qué servicio probaste? *
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.service ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p className="mt-1 text-sm text-red-600">{errors.service}</p>
              )}
            </div>

            {/* Calificación */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu Calificación *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="p-2 transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={
                        rating <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {formData.rating === 5 && '⭐ Excelente'}
                {formData.rating === 4 && '😊 Muy bueno'}
                {formData.rating === 3 && '👍 Bueno'}
                {formData.rating === 2 && '😐 Regular'}
                {formData.rating === 1 && '😞 Necesita mejorar'}
              </p>
            </div>

            {/* Testimonio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tu Testimonio *
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                  errors.text ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Cuéntanos tu experiencia con LINFOREDUCTOX..."
              />
              {errors.text && (
                <p className="mt-1 text-sm text-red-600">{errors.text}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Mínimo 10 caracteres ({formData.text.length}/10)
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Enviar Testimonio
                  </>
                )}
              </button>

              <Link
                href="/testimonios"
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Al enviar tu testimonio, aceptas que tu nombre y opinión puedan ser publicados en nuestra web.
          </p>
          <p className="mt-2">
            Tu email nunca será compartido públicamente.
          </p>
        </div>
      </div>
    </div>
  );
}