// app/reservar/reservarclient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Check, Loader2, ArrowRight } from 'lucide-react';
import { format, addDays, isBefore, isAfter, startOfDay } from 'date-fns';
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

export default function ReservarClient() {
  const searchParams = useSearchParams();
  const servicioParam = searchParams.get('servicio');

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientNotes: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

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
    setSelectedDate(undefined);
    setSelectedSlot(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleWhatsAppBooking = async (e: React.FormEvent) => {
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
          source: 'whatsapp',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '34612345678';
        
        const message = `Hola Aline, quiero reservar una cita para:

👤 ${formData.clientName}
📞 ${formData.clientPhone}
📧 ${formData.clientEmail}

💆 Servicio: ${selectedService.name}
📅 Fecha: ${format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
🕐 Hora: ${selectedSlot.startTime}

${formData.clientNotes ? `📝 Notas: ${formData.clientNotes}\n` : ''}ID de reserva: ${data.booking.id}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        toast.success('¡Reserva guardada! Completa el envío en WhatsApp');
        setStep(4);
        window.open(whatsappUrl, '_blank');
      } else {
        toast.error(data.error || 'Error al crear la reserva');
      }
    } catch (error) {
      toast.error('Error al procesar la reserva');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 60);

  // Deshabilitar fechas pasadas
  const disabledDays = [
    { before: today },
    { after: maxDate }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream/50 py-20">
      <div className="container-custom max-w-6xl">
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
                  className={`ml-2 text-sm font-medium ${
                    step >= s.num ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
                {idx < 3 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 ml-2 ${
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingServices ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No hay servicios disponibles
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-primary"
                >
                  <h3 className="font-heading text-xl font-bold text-primary mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{service.duration} min</span>
                    </div>
                    {service.price && (
                      <span className="font-semibold text-primary text-lg">
                        {service.price}€
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Step 2: Fecha y Hora con DayPicker */}
        {step === 2 && selectedService && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              Selecciona Fecha y Hora - {selectedService.name}
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendario */}
              <div className="flex flex-col items-center">
                <h3 className="font-semibold mb-4 text-lg">Selecciona una fecha</h3>
                <div className="calendar-wrapper">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    locale={es}
                    className="border rounded-lg p-4"
                    modifiersClassNames={{
                      selected: 'bg-primary text-white hover:bg-primary-dark',
                      today: 'font-bold text-primary border-primary',
                    }}
                    styles={{
                      caption: { color: '#2C5F2D' },
                      head_cell: { color: '#2C5F2D', fontWeight: 'bold' },
                    }}
                  />
                </div>
                {selectedDate && (
                  <p className="mt-4 text-sm text-gray-600">
                    Fecha seleccionada:{' '}
                    <span className="font-semibold text-primary">
                      {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </span>
                  </p>
                )}
              </div>

              {/* Horarios disponibles */}
              <div className="flex flex-col">
                <h3 className="font-semibold mb-4 text-lg">Horarios disponibles</h3>
                {!selectedDate ? (
                  <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Calendar className="mx-auto mb-2 text-gray-400" size={40} />
                      <p>Selecciona primero una fecha en el calendario</p>
                    </div>
                  </div>
                ) : loadingSlots ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={40} />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500 bg-red-50 rounded-lg border-2 border-red-200">
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 text-red-400" size={40} />
                      <p className="font-semibold">No hay horarios disponibles</p>
                      <p className="text-sm mt-1">Prueba con otra fecha</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSlotSelect(slot)}
                        className="group p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-cream transition-all text-center"
                      >
                        <div className="flex items-center justify-center gap-2 font-medium text-gray-700 group-hover:text-primary">
                          <Clock size={16} />
                          {slot.startTime}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-6 border-t">
              <button
                onClick={() => setStep(1)}
                className="text-primary hover:underline font-medium"
              >
                ← Cambiar servicio
              </button>
              {selectedDate && availableSlots.length > 0 && (
                <p className="text-sm text-gray-600">
                  {availableSlots.length} horarios disponibles
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Formulario de Datos + WhatsApp */}
        {step === 3 && selectedService && selectedDate && selectedSlot && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              Tus Datos
            </h2>

            {/* Resumen de reserva */}
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
            <form onSubmit={handleWhatsAppBooking} className="space-y-6">
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
                  placeholder="612 345 678"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="¿Alguna preferencia o información que debamos saber?"
                />
              </div>

              {/* Información importante */}
              <div className="bg-green-50 border-l-4 border-primary p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>📱 Confirmación por WhatsApp:</strong> Al hacer clic en reservar, 
                  se guardará tu cita y se abrirá WhatsApp con un mensaje pre-escrito para 
                  Aline. Solo tienes que enviarlo y ella te confirmará en minutos.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all"
                >
                  ← Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 bg-primary text-white px-6 py-4 rounded-full hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Procesando...
                    </>
                  ) : (
                    <>
                      📱 Reservar por WhatsApp
                      <ArrowRight size={20} />
                    </>
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
              ¡Reserva Guardada!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Tu reserva se ha guardado correctamente. Si WhatsApp no se abrió automáticamente, 
              puedes contactar directamente:
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '34612345678'}`, '_blank')}
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all shadow-lg"
              >
                📱 Abrir WhatsApp
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-dark transition-all"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .rdp {
          --rdp-cell-size: 45px;
          --rdp-accent-color: #2C5F2D;
          --rdp-background-color: #F5F1E8;
        }
        
        .rdp-day_selected {
          background-color: #2C5F2D !important;
          color: white !important;
          font-weight: bold;
        }
        
        .rdp-day_selected:hover {
          background-color: #1e3d1f !important;
        }
        
        .rdp-day_today {
          font-weight: bold;
          color: #2C5F2D;
        }
        
        .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
          background-color: #F5F1E8;
        }
        
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #F5F1E8;
        }
      `}</style>
    </div>
  );
}