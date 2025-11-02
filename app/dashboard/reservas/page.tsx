// app/dashboard/reservas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  Ban,
  UserX,
} from 'lucide-react';

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  clientNotes?: string;
  adminNotes?: string;
  service: {
    name: string;
    duration: number;
    price?: number;
  };
  createdAt: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  CONFIRMED: {
    label: 'Confirmada',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
  },
  COMPLETED: {
    label: 'Completada',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
  NO_SHOW: {
    label: 'No se presentó',
    color: 'bg-gray-100 text-gray-800',
    icon: UserX,
  },
};

export default function ReservasPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus, filterDate]);

const fetchBookings = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    if (filterStatus !== 'all') params.append('status', filterStatus);
    if (filterDate) params.append('date', filterDate);

    const res = await fetch(`/api/bookings?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      // ✅ AÑADIR ESTA VALIDACIÓN
      setBookings(Array.isArray(data) ? data : []);
    } else {
      setBookings([]);
    }
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    toast.error('Error al cargar reservas');
    setBookings([]); // ✅ IMPORTANTE: Establecer array vacío en caso de error
  } finally {
    setLoading(false);
  }
};

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success('Estado actualizado');
        fetchBookings();
        setShowModal(false);
      } else {
        toast.error('Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar');
    }
  };

  const saveAdminNotes = async (id: string, adminNotes: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });

      if (res.ok) {
        toast.success('Notas guardadas');
        fetchBookings();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar notas');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.clientPhone.includes(searchTerm);
    return matchesSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-2">Gestiona las reservas de tus clientes</p>
        </div>
        <Link
          href="/reservar"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <ExternalLink size={18} />
          Ver página pública
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="text-yellow-400" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmadas</p>
              <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <CheckCircle className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="text-green-400" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="CONFIRMED">Confirmadas</option>
              <option value="COMPLETED">Completadas</option>
              <option value="CANCELLED">Canceladas</option>
              <option value="NO_SHOW">No se presentó</option>
            </select>
          </div>

          {/* Date filter */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando reservas...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 mb-4">No se encontraron reservas</p>
            <Link
              href="/reservar"
              target="_blank"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink size={16} />
              Ir a la página de reservas
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Servicio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const StatusIcon = statusConfig[booking.status as keyof typeof statusConfig].icon;
                  
                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <p className="font-medium text-gray-900">
                              {booking.clientName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail size={14} className="text-gray-400" />
                            <Link
                              href={`mailto:${booking.clientEmail}`}
                              className="text-sm text-gray-600 hover:text-primary hover:underline"
                            >
                              {booking.clientEmail}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone size={14} className="text-gray-400" />
                            <Link
                              href={`tel:${booking.clientPhone}`}
                              className="text-sm text-gray-600 hover:text-primary hover:underline"
                            >
                              {booking.clientPhone}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {booking.service.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.service.duration} min
                          {booking.service.price && ` • ${booking.service.price}€`}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <p className="text-gray-900">
                            {new Date(booking.date).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={16} className="text-gray-400" />
                          <p className="text-gray-600">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            statusConfig[booking.status as keyof typeof statusConfig]
                              .color
                          }`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig[booking.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Ver detalles"
                        >
                          <MoreVertical size={20} className="text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Detalles de la Reserva
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <XCircle size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Cliente */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Información del Cliente
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{selectedBooking.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <Link
                      href={`mailto:${selectedBooking.clientEmail}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedBooking.clientEmail}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-600">Teléfono:</span>
                    <Link
                      href={`tel:${selectedBooking.clientPhone}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedBooking.clientPhone}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Servicio */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Servicio</h3>
                <div className="bg-cream p-4 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {selectedBooking.service.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{selectedBooking.service.duration} minutos</span>
                    {selectedBooking.service.price && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-primary">
                          {selectedBooking.service.price}€
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Fecha y hora */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Fecha y Hora
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span>
                      {new Date(selectedBooking.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gray-400" />
                    <span>
                      {selectedBooking.startTime} - {selectedBooking.endTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notas del cliente */}
              {selectedBooking.clientNotes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Notas del Cliente
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                    {selectedBooking.clientNotes}
                  </div>
                </div>
              )}

              {/* Notas admin */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Notas Internas
                </h3>
                <textarea
                  defaultValue={selectedBooking.adminNotes || ''}
                  onBlur={(e) => saveAdminNotes(selectedBooking.id, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Añade notas internas sobre esta reserva..."
                />
              </div>

              {/* Cambiar estado */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Cambiar Estado
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const isCurrentStatus = selectedBooking.status === key;

                    return (
                      <button
                        key={key}
                        onClick={() =>
                          !isCurrentStatus &&
                          updateBookingStatus(selectedBooking.id, key)
                        }
                        disabled={isCurrentStatus}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                          isCurrentStatus
                            ? `${config.color} cursor-default`
                            : 'border-2 border-gray-300 hover:border-primary text-gray-700'
                        }`}
                      >
                        <Icon size={18} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Creada */}
              <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                Reserva creada el{' '}
                {new Date(selectedBooking.createdAt).toLocaleString('es-ES')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}