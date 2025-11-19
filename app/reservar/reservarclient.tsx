// app/reservar/reservarclient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Check, Loader2, ArrowRight, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  slug: string;
  duration: number;
  description: string;
  price?: number;
  category: string;
  parentServiceId?: string | null;
  childServices?: Service[];
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    fetchColors();
    fetchServices();
  }, []);

  useEffect(() => {
    if (servicioParam && services.length > 0 && !selectedService) {
      const service = services.find(
        (s) => s.slug === servicioParam || s.category.toLowerCase() === servicioParam.toLowerCase()
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
      const res = await fetch('/api/services?active=true');
      const data = await res.json();
      
      // Organizar en jerarquía
      const allServices = data.services || [];
      const parents = allServices.filter((s: Service) => !s.parentServiceId);
      const children = allServices.filter((s: Service) => s.parentServiceId);
      
      const servicesWithChildren = parents.map((parent: Service) => ({
        ...parent,
        childServices: children.filter((child: Service) => child.parentServiceId === parent.id),
      }));
      
      setServices(servicesWithChildren);
      // Expandir todos por defecto
      setExpandedParents(new Set(parents.map((p: Service) => p.id)));
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

  const toggleParent = (parentId: string) => {
    const newExpanded = new Set(expandedParents);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
    }
    setExpandedParents(newExpanded);
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

        toast.success('¡Reserva guardada! Abriendo WhatsApp...');
        
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          setStep(4);
        }, 1000);
      } else {
        toast.error(data.error || 'Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar servicios por búsqueda
  const filteredServices = services.filter((parent) => {
    const parentMatches = parent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const childrenMatch = parent.childServices?.some((child) =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return parentMatches || childrenMatch;
  });

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
    // ✅ AGREGAR ESTAS LÍNEAS AQUÍ
  const minDate = startOfDay(new Date());
  const maxDate = addDays(minDate, 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream/50 py-12 px-4">
      <div className="container-custom max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.primaryColor }}>
            Reserva tu Cita
          </h1>
          <p className="text-xl text-gray-600">
            Selecciona el tratamiento y el horario que mejor se adapte a ti
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Servicio' },
              { num: 2, label: 'Fecha y Hora' },
              { num: 3, label: 'Datos' },
              { num: 4, label: 'Confirmación' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
                    step >= s.num
                      ? 'text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  style={{
                    backgroundColor: step >= s.num ? colors.primaryColor : undefined,
                  }}
                >
                  {step > s.num ? <Check size={24} /> : s.num}
                </div>
                <div className="ml-3 hidden md:block">
                  <p className={`font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.label}
                  </p>
                </div>
                {idx < 3 && (
                  <div
                    className={`hidden md:block w-16 h-1 mx-4 ${
                      step > s.num ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PASO 1: Seleccionar Servicio */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primaryColor }}>
              Selecciona tu Tratamiento
            </h2>

            {/* Buscador */}
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tratamiento..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': colors.primaryColor } as React.CSSProperties}
              />
            </div>

            {loadingServices ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin mx-auto mb-4" size={40} style={{ color: colors.primaryColor }} />
                <p className="text-gray-500">Cargando tratamientos...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((parent) => (
                  <div key={parent.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Servicio Padre */}
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: colors.creamColor }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2" style={{ color: colors.primaryColor }}>
                            {parent.name}
                          </h3>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {stripHtml(parent.description).substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock size={16} />
                              {parent.duration} min
                            </span>
                            <span className="capitalize px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.secondaryLight, color: 'white' }}>
                              {parent.category}
                            </span>
                            {parent.childServices && parent.childServices.length > 0 && (
                              <span className="text-xs font-medium" style={{ color: colors.secondaryColor }}>
                                {parent.childServices.length} opciones disponibles
                              </span>
                            )}
                          </div>
                        </div>
                        {parent.childServices && parent.childServices.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleParent(parent.id);
                            }}
                            className="ml-4 p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            {expandedParents.has(parent.id) ? (
                              <ChevronUp size={24} style={{ color: colors.primaryColor }} />
                            ) : (
                              <ChevronDown size={24} style={{ color: colors.primaryColor }} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subtratamientos */}
                    {expandedParents.has(parent.id) && parent.childServices && parent.childServices.length > 0 && (
                      <div className="border-t border-gray-200 bg-white">
                        {parent.childServices.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleServiceSelect(child)}
                            className="w-full p-6 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pl-6 border-l-4" style={{ borderColor: colors.secondaryLight }}>
                                <h4 className="font-bold text-lg mb-2" style={{ color: colors.textColor }}>
                                  {child.name}
                                </h4>
                                <div
                                  className="text-gray-600 mb-3 line-clamp-3 prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: child.description }}
                                />
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <Clock size={16} />
                                    {child.duration} min
                                  </span>
                                  {child.price && (
                                    <span className="font-bold" style={{ color: colors.secondaryColor }}>
                                      {child.price}€
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="flex-shrink-0 ml-4" size={24} style={{ color: colors.primaryColor }} />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {filteredServices.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No se encontraron tratamientos que coincidan con "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedService && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: colors.primaryColor }}>
              Selecciona Fecha y Hora - {selectedService.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Selecciona una fecha</h3>
                <input
                  type="date"
                  min={format(minDate, 'yyyy-MM-dd')}
                  max={format(maxDate, 'yyyy-MM-dd')}
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleDateSelect(new Date(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{
                    colorScheme: 'light',
                  }}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-4">Horarios disponibles</h3>
                {!selectedDate ? (
                  <p className="text-gray-500 text-sm">
                    Selecciona primero una fecha
                  </p>
                ) : loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" style={{ color: colors.primaryColor }} size={30} />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No hay horarios disponibles para esta fecha
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSlotSelect(slot)}
                        className="p-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-cream transition-all text-sm font-medium"
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-6 hover:underline font-medium"
              style={{ color: colors.primaryColor }}
            >
              ← Cambiar servicio
            </button>
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
    </div>
  );
}