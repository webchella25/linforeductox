'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface WorkingHour {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  isActive: boolean;
}

interface BlockedDate {
  id: string;
  date: Date;
  reason: string | null;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
}

interface ContactInfo {
  bufferMinutes: number;
}

const DAYS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export default function HorariosPage() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bufferMinutes, setBufferMinutes] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Nuevo bloqueo
  const [newBlockedDate, setNewBlockedDate] = useState({
    date: '',
    reason: '',
    allDay: true,
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const [hoursRes, blockedRes, contactRes] = await Promise.all([
      fetch('/api/working-hours'),
      fetch('/api/blocked-dates'),
      fetch('/api/contact-info'),
    ]);

    if (hoursRes.ok) {
      const hours = await hoursRes.json();
      
      // ✅ MAPEO CORRECTO: API → Frontend
      const mappedHours = hours.map((h: any) => ({
        id: h.id,
        dayOfWeek: h.dayOfWeek,
        isActive: h.isOpen,           // ✅ isOpen → isActive
        startTime: h.openTime || '09:00',   // ✅ openTime → startTime
        endTime: h.closeTime || '20:00',    // ✅ closeTime → endTime
        breakStart: h.breakStart,
        breakEnd: h.breakEnd,
      }));
      
      setWorkingHours(mappedHours);
    }

    if (blockedRes.ok) {
      const blocked = await blockedRes.json();
      setBlockedDates(blocked);
    }

    if (contactRes.ok) {
      const contact = await contactRes.json();
      setBufferMinutes(contact.bufferMinutes || 15);
    }
  } catch (error) {
    toast.error('Error al cargar la configuración');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleWorkingHourChange = (
    dayOfWeek: number,
    field: keyof WorkingHour,
    value: any
  ) => {
    setWorkingHours((prev) => {
      const existing = prev.find((h) => h.dayOfWeek === dayOfWeek);

      if (existing) {
        return prev.map((h) =>
          h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
        );
      } else {
        return [
          ...prev,
          {
            id: '',
            dayOfWeek,
            startTime: '09:00',
            endTime: '20:00',
            breakStart: null,
            breakEnd: null,
            isActive: true,
            [field]: value,
          },
        ];
      }
    });
  };

  const getWorkingHour = (dayOfWeek: number): WorkingHour => {
    return (
      workingHours.find((h) => h.dayOfWeek === dayOfWeek) || {
        id: '',
        dayOfWeek,
        startTime: '09:00',
        endTime: '20:00',
        breakStart: null,
        breakEnd: null,
        isActive: false,
      }
    );
  };

  const handleSaveWorkingHours = async () => {
  setIsSaving(true);
  try {
    // Guardar cada día
    for (const day of DAYS) {
      const hour = getWorkingHour(day.value);
      
      // ✅ MAPEO CORRECTO: Frontend → API
      const payload = {
        dayOfWeek: hour.dayOfWeek,
        isActive: hour.isActive,
        startTime: hour.startTime,
        endTime: hour.endTime,
        breakStart: hour.breakStart || null,
        breakEnd: hour.breakEnd || null,
      };

      await fetch('/api/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    // Guardar buffer
    await fetch('/api/contact-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bufferMinutes }),
    });

    toast.success('Horarios guardados correctamente');
    
    // ✅ Recargar datos para actualizar el formulario
    await fetchData();
  } catch (error) {
    toast.error('Error al guardar los horarios');
    console.error(error);
  } finally {
    setIsSaving(false);
  }
};

  const handleAddBlockedDate = async () => {
  if (!newBlockedDate.date) {
    toast.error('Selecciona una fecha');
    return;
  }

  try {
    const payload = {
      date: newBlockedDate.date,
      reason: newBlockedDate.reason || undefined, // ✅ undefined en lugar de string vacío
      allDay: newBlockedDate.allDay,
      startTime: newBlockedDate.allDay ? null : (newBlockedDate.startTime || null),
      endTime: newBlockedDate.allDay ? null : (newBlockedDate.endTime || null),
    };
    
    console.log('🔹 Sending blocked date:', payload);
    
    const response = await fetch('/api/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('🔹 Response status:', response.status);
    
    let data;
    try {
      data = await response.json();
      console.log('🔹 Response data:', data);
    } catch (e) {
      console.error('🔴 No se pudo parsear la respuesta JSON:', e);
      toast.error('Error del servidor');
      return;
    }
    
    if (!response.ok) {
      console.error('🔴 Error response:', data);
      
      // Mostrar detalles de validación si existen
      if (data.details) {
        console.error('🔴 Validation details:', data.details);
        toast.error(`Validación: ${data.details.map((d: any) => d.message).join(', ')}`);
      } else {
        toast.error(data.error || 'Error al crear fecha bloqueada');
      }
      return;
    }

    toast.success('Fecha bloqueada añadida');
    setNewBlockedDate({
      date: '',
      reason: '',
      allDay: true,
      startTime: '',
      endTime: '',
    });
    await fetchData();
  } catch (error) {
    console.error('🔴 Catch error:', error);
    toast.error('Error al añadir fecha bloqueada');
  }
};

  const handleDeleteBlockedDate = async (id: string) => {
    try {
      const response = await fetch(`/api/blocked-dates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      toast.success('Fecha bloqueada eliminada');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar fecha bloqueada');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* ✅ TÍTULO SIN DashboardHeader */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Horarios</h1>
          <p className="text-gray-600 mt-2">Gestiona tu disponibilidad y días bloqueados</p>
        </div>
        
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ TÍTULO SIN DashboardHeader */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Horarios</h1>
        <p className="text-gray-600 mt-2">Gestiona tu disponibilidad y días bloqueados</p>
      </div>

      <div className="space-y-8">
        {/* Horarios Semanales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-primary" />
              <h2 className="text-xl font-bold text-gray-900">
                Horarios Semanales
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {DAYS.map((day) => {
              const hour = getWorkingHour(day.value);
              return (
                <div
                  key={day.value}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg"
                >
                  {/* Día */}
                  <div className="lg:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hour.isActive}
                      onChange={(e) =>
                        handleWorkingHourChange(
                          day.value,
                          'isActive',
                          e.target.checked
                        )
                      }
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="font-medium text-gray-900">
                      {day.label}
                    </span>
                  </div>

                  {hour.isActive ? (
                    <>
                      {/* Horario */}
                      <div className="lg:col-span-4 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            Apertura
                          </label>
                          <input
                            type="time"
                            value={hour.startTime}
                            onChange={(e) =>
                              handleWorkingHourChange(
                                day.value,
                                'startTime',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            Cierre
                          </label>
                          <input
                            type="time"
                            value={hour.endTime}
                            onChange={(e) =>
                              handleWorkingHourChange(
                                day.value,
                                'endTime',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Descanso */}
                      <div className="lg:col-span-6 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            Descanso inicio
                          </label>
                          <input
                            type="time"
                            value={hour.breakStart || ''}
                            onChange={(e) =>
                              handleWorkingHourChange(
                                day.value,
                                'breakStart',
                                e.target.value || null
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            Descanso fin
                          </label>
                          <input
                            type="time"
                            value={hour.breakEnd || ''}
                            onChange={(e) =>
                              handleWorkingHourChange(
                                day.value,
                                'breakEnd',
                                e.target.value || null
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="lg:col-span-10">
                      <span className="text-gray-500 text-sm">Cerrado</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Buffer entre citas */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tiempo entre citas (minutos)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Tiempo de descanso/preparación entre cada cliente
            </p>
            <select
              value={bufferMinutes}
              onChange={(e) => setBufferMinutes(parseInt(e.target.value))}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={0}>Sin descanso</option>
              <option value={10}>10 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={20}>20 minutos</option>
              <option value={30}>30 minutos</option>
            </select>
          </div>

          {/* Botón Guardar */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveWorkingHours}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
            >
              <Save size={20} />
              {isSaving ? 'Guardando...' : 'Guardar Horarios'}
            </button>
          </div>
        </div>

        {/* Fechas Bloqueadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              Fechas Bloqueadas
            </h2>
          </div>

          {/* Añadir nueva fecha */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Añadir Fecha Bloqueada
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={newBlockedDate.date}
                  onChange={(e) =>
                    setNewBlockedDate((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Motivo
                </label>
                <input
                  type="text"
                  value={newBlockedDate.reason}
                  onChange={(e) =>
                    setNewBlockedDate((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Ej: Vacaciones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newBlockedDate.allDay}
                    onChange={(e) =>
                      setNewBlockedDate((prev) => ({
                        ...prev,
                        allDay: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Todo el día</span>
                </label>
              </div>
              <div className="lg:col-span-2 flex items-end">
                <button
                  onClick={handleAddBlockedDate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Plus size={20} />
                  Añadir
                </button>
              </div>
            </div>
          </div>

          {/* Lista de fechas bloqueadas */}
          {blockedDates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay fechas bloqueadas
            </div>
          ) : (
            <div className="space-y-3">
              {blockedDates.map((blocked) => (
                <div
                  key={blocked.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-red-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(blocked.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {blocked.reason && (
                        <p className="text-sm text-gray-600">
                          {blocked.reason}
                        </p>
                      )}
                      {!blocked.allDay && (
                        <p className="text-xs text-gray-500">
                          {blocked.startTime} - {blocked.endTime}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBlockedDate(blocked.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}