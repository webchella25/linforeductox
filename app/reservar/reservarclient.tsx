// app/reservar/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Check, Loader2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  slug: string;
  duration: number;
  description: string;
  price?: number;
  category: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export default function ReservarPage() {
  const searchParams = useSearchParams();
  const servicioParam = searchParams.get('servicio'); // corporal, facial, acupuntura

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  // Datos del cliente
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientNotes: '',
  });

  // Cargar servicios al montar
  useEffect(() => {
    fetchServices();
  }, []);

  // Pre-seleccionar servicio si viene en la URL
  useEffect(() => {
    if (servicioParam && services.length > 0 && !selectedService) {
      const service = services.find(
        (s) => s.category.toLowerCase() === servicioParam.toLowerCase()
      );
      if (service) {
        setSelectedService(service);
        setStep(2);
      }
    }
  }, [servicioParam, services, selectedService]);

  // Cargar slots cuando se selecciona fecha y servicio
  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      toast.error('Error al cargar los servicios');
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedService) return;

    setLoadingSlots(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const res = await fetch(
        `/api/bookings/available-slots?date=${dateStr}&serviceId=${selectedService.id}`
      );
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch (error) {
      toast.error('Error al cargar horarios disponibles');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedDate || !selectedSlot) {
      toast.error('Por favor completa todos los pasos');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('¡Reserva realizada exitosamente!');
        setStep(4); // Paso de confirmación
      } else {
        toast.error(data.error || 'Error al crear la reserva');
      }
    } catch (error) {
      toast.error('Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  const maxDate = addDays(new Date(), 60); // Permitir reservar hasta 60 días adelante

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream/50 py-20">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Reserva tu Cita
          </h1>
          <p className="text-xl text-gray-600">
            Selecciona el tratamiento y el horario que mejor se adapte a ti
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12 overflow-x-auto">
          <div className="flex items-center gap-2 md:gap-4 min-w-max px-4">
            {[
              { num: 1, label: 'Servicio' },
              { num: 2, label: 'Fecha y Hora' },
              { num: 3, label: 'Datos' },
              { num: 4, label: 'Confirmación' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    step >= s.num
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.num ? <Check size={20} /> : s.num}
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden md:inline ${
                    step >= s.num ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
                {idx < 3 && (
                  <div
                    className={`w-8 md:w-12 h-0.5 mx-2 md:mx-4 ${
                      step > s.num ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Selección de Servicio */}
        {step === 1 && (
          <>
            {loadingServices ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No hay servicios disponibles en este momento
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left group border-2 border-transparent hover:border-primary"
                  >
                    <h3 className="font-heading text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500">
                        <Clock size={16} />
                        {service.duration} min
                      </span>
                      {service.price && (
                        <span className="font-semibold text-secondary">
                          {service.price}€
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Step 2: Selección de Fecha y Hora */}
        {step === 2 && selectedService && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="font-heading text-3xl font-bold text-primary mb-6">
              {selectedService.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendario */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="text-secondary" size={24} />
                  Selecciona una fecha
                </h3>
                <div className="border rounded-xl p-4">
                  <input
                    type="date"
                    min={format(minDate, 'yyyy-MM-dd')}
                    max={format(maxDate, 'yyyy-MM-dd')}
                    value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => handleDateSelect(new Date(e.target.value))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Horarios disponibles */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="text-secondary" size={24} />
                  Horarios disponibles
                </h3>

                {!selectedDate ? (
                  <p className="text-gray-500 text-center py-8">
                    Selecciona una fecha para ver los horarios disponibles
                  </p>
                ) : loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No hay horarios disponibles para esta fecha
                    </p>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="text-primary hover:underline text-sm"
                    >
                      Seleccionar otra fecha
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSlotSelect(slot)}
                        className="p-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all font-medium"
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setSelectedDate(null);
                setSelectedSlot(null);
              }}
              className="mt-6 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
            >
              ← Volver a servicios
            </button>
          </div>
        )}

        {/* Step 3: Datos del Cliente */}
        {step === 3 && selectedService && selectedDate && selectedSlot && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-primary mb-6">
              Tus Datos
            </h2>

            {/* Resumen de la reserva */}
            <div className="bg-cream/50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-lg mb-3">Resumen de tu reserva:</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Servicio:</strong> {selectedService.name}
                </p>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </p>
                <p>
                  <strong>Hora:</strong> {selectedSlot.startTime} -{' '}
                  {selectedSlot.endTime}
                </p>
                <p>
                  <strong>Duración:</strong> {selectedService.duration} minutos
                </p>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={18} />
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail size={18} />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone size={18} />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.clientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, clientPhone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare size={18} />
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={formData.clientNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, clientNotes: e.target.value })
                  }
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="¿Alguna consulta o información adicional?"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setSelectedSlot(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
                >
                  ← Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Reserva'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Confirmación */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-600" size={40} />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">
              ¡Reserva Solicitada!
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Hemos recibido tu solicitud de reserva. Recibirás un email de
              confirmación en cuanto revisemos tu solicitud.
            </p>
            <div className="bg-cream/50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-lg mb-3">Detalles de tu reserva:</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Servicio:</strong> {selectedService?.name}
                </p>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {selectedDate &&
                    format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                </p>
                <p>
                  <strong>Hora:</strong> {selectedSlot?.startTime}
                </p>
                <p>
                  <strong>Email:</strong> {formData.clientEmail}
                </p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = '/')}
              className="bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-dark transition-all"
            >
              Volver al Inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}