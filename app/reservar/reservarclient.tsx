// app/reservar/reservarclient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DayPicker } from 'react-day-picker';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Check, Loader2, ArrowRight } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';
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

interface SiteConfig {
  primaryColor: string;
  primaryDark: string;
  secondaryColor: string;
  secondaryLight: string;
  creamColor: string;
  textColor: string;
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

  // ✅ NUEVO: Cargar colores dinámicos
  const [colors, setColors] = useState<SiteConfig>({
    primaryColor: '#2C5F2D',
    primaryDark: '#1e3d1f',
    secondaryColor: '#A27B5C',
    secondaryLight: '#b89171',
    creamColor: '#F5F1E8',
    textColor: '#1F2937',
  });

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientNotes: '',
  });

  // ✅ Cargar colores al montar
  useEffect(() => {
    fetchColors();
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

  const fetchColors = async () => {
    try {
      const res = await fetch('/api/site-config');
      const data = await res.json();
      setColors(data);
    } catch (error) {
      console.error('Error cargando colores:', error);
    }
  };

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
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all`}
                  style={{
                    backgroundColor: step >= s.num ? colors.primaryColor : '#E5E7EB',
                    color: step >= s.num ? 'white' : '#6B7280',
                  }}
                >
                  {step > s.num ? <Check size={20} /> : s.num}
                </div>
                <span
                  className={`ml-2 text-sm font-medium`}
                  style={{ color: step >= s.num ? colors.primaryColor : '#6B7280' }}
                >
                  {s.label}
                </span>
                {idx < 3 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 ml-2`}
                    style={{ backgroundColor: step > s.num ? colors.primaryColor : '#E5E7EB' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingServices ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="animate-spin" style={{ color: colors.primaryColor }} size={40} />
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
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent"
                  style={{
                    '--hover-border-color': colors.primaryColor,
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <h3 className="font-heading text-xl font-bold mb-2" style={{ color: colors.primaryColor }}>
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
                      <span className="font-semibold text-lg" style={{ color: colors.primaryColor }}>
                        {service.price}€
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      {/* CALENDARIO MEJORADO - Step 2 completo */}
{step === 2 && selectedService && (
  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">
    <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: colors.primaryColor }}>
      Selecciona Fecha y Hora - {selectedService.name}
    </h2>
    
    <div className="grid lg:grid-cols-2 gap-8">
      {/* CALENDARIO */}
      <div className="flex flex-col items-center">
        <h3 className="font-semibold mb-6 text-lg">Selecciona una fecha</h3>
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            locale={es}
            className="mx-auto"
            classNames={{
              months: "flex flex-col",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center mb-4",
              caption_label: "text-lg font-bold",
              nav: "flex items-center justify-between absolute w-full px-2",
              nav_button: "h-10 w-10 bg-transparent hover:bg-gray-100 rounded-lg inline-flex items-center justify-center transition-colors",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse",
              head_row: "flex w-full",
              head_cell: "text-gray-600 rounded-md w-12 font-semibold text-sm uppercase flex-1 text-center",
              row: "flex w-full mt-2",
              cell: "text-gray-600 rounded-md w-12 h-12 text-center text-sm p-0 relative flex-1 flex items-center justify-center",
              day: "h-12 w-12 p-0 font-normal rounded-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center cursor-pointer",
              day_selected: "font-bold text-white hover:bg-primary-dark",
              day_today: "font-bold",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-300 cursor-not-allowed hover:bg-transparent",
              day_hidden: "invisible",
            }}
            styles={{
              caption_label: { color: colors.primaryColor },
              day_selected: { 
                backgroundColor: colors.primaryColor,
                color: 'white',
              },
              day_today: { 
                color: colors.primaryColor,
                fontWeight: 'bold',
                border: `2px solid ${colors.primaryColor}`,
              },
            }}
          />
        </div>
        {selectedDate && (
          <div className="mt-6 p-4 rounded-lg w-full text-center" style={{ backgroundColor: `${colors.creamColor}80` }}>
            <p className="text-sm text-gray-600">
              Fecha seleccionada:
            </p>
            <p className="font-bold text-lg mt-1" style={{ color: colors.primaryColor }}>
              {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>
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
            <Loader2 className="animate-spin" style={{ color: colors.primaryColor }} size={40} />
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
                className="group p-4 border-2 border-gray-200 rounded-lg transition-all text-center hover:shadow-md"
                style={{
                  borderColor: '#E5E7EB',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primaryColor;
                  e.currentTarget.style.backgroundColor = colors.creamColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center justify-center gap-2 font-medium text-gray-700">
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
        className="font-medium hover:underline"
        style={{ color: colors.primaryColor }}
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

        {step === 3 && selectedService && selectedDate && selectedSlot && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: colors.primaryColor }}>
              Tus Datos
            </h2>

            <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: `${colors.creamColor}80` }}>
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--focus-ring-color': colors.primaryColor } as React.CSSProperties}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${colors.primaryColor}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${colors.primaryColor}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${colors.primaryColor}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  onFocus={(e) => {
                    e.currentTarget.style.outline = `2px solid ${colors.primaryColor}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                  placeholder="¿Alguna preferencia o información que debamos saber?"
                />
              </div>

              <div className="bg-green-50 border-l-4 p-4 rounded" style={{ borderColor: colors.primaryColor }}>
                <p className="text-sm text-gray-700">
                  <strong>📱 Confirmación por WhatsApp:</strong> Al hacer clic en reservar, 
                  se guardará tu cita y se abrirá WhatsApp con un mensaje pre-escrito para 
                  Aline. Solo tienes que enviarlo y ella te confirmará en minutos.
                </p>
              </div>

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
                  className="flex-1 flex items-center justify-center gap-3 text-white px-6 py-4 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: loading ? '#D1D5DB' : colors.primaryColor,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = colors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = colors.primaryColor;
                  }}
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

        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-600" size={40} />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-4" style={{ color: colors.primaryColor }}>
              ¡Reserva Guardada!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Tu reserva se ha guardado correctamente. Si WhatsApp no se abrió automáticamente, 
              puedes contactar directamente:
            </p>
            
            <div className="rounded-xl p-6 mb-8 text-left" style={{ backgroundColor: `${colors.creamColor}80` }}>
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
                className="inline-flex items-center justify-center text-white px-8 py-4 rounded-full transition-all"
                style={{ backgroundColor: colors.primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryColor;
                }}
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}
      </div>

{/* Y actualiza los estilos al final del componente */}
<style jsx global>{`
  /* Ya no necesitamos estilos globales para .rdp porque usamos classNames inline */
  
  .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
    background-color: ${colors.creamColor} !important;
    transform: scale(1.05);
  }
  
  .rdp-day_selected:hover {
    background-color: ${colors.primaryDark} !important;
  }
`}</style>
    </div>
  );
}