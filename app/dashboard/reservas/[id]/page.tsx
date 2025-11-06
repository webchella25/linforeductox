// app/dashboard/reservas/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Ban,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
    icon: Ban,
  },
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [resolvedParams.id]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
        setAdminNotes(data.adminNotes || '');
      } else {
        toast.error('Error al cargar la reserva');
        router.push('/dashboard/reservas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!booking) return;

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success('Estado actualizado');
        fetchBooking();
      } else {
        toast.error('Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar');
    }
  };

  const saveNotes = async () => {
    if (!booking) return;

    setSavingNotes(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });

      if (res.ok) {
        toast.success('Notas guardadas');
        fetchBooking();
      } else {
        toast.error('Error al guardar notas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar notas');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Reserva no encontrada</p>
        <Link
          href="/dashboard/reservas"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Volver a reservas
        </Link>
      </div>
    );
  }

  const StatusIcon =
    statusConfig[booking.status as keyof typeof statusConfig].icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/reservas"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Volver a reservas
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Detalle de Reserva</h1>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              statusConfig[booking.status as keyof typeof statusConfig].color
            }`}
          >
            <StatusIcon size={16} />
            {statusConfig[booking.status as keyof typeof statusConfig].label}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Información del Cliente */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="text-primary" size={24} />
            Información del Cliente
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="text-lg font-semibold text-gray-900">
                {booking.clientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <Link
                href={`mailto:${booking.clientEmail}`}
                className="text-primary hover:underline"
              >
                {booking.clientEmail}
              </Link>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <Link
                href={`tel:${booking.clientPhone}`}
                className="text-primary hover:underline"
              >
                {booking.clientPhone}
              </Link>
            </div>
          </div>
        </div>

        {/* Información del Servicio */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Servicio</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="text-lg font-semibold text-gray-900">
                {booking.service.name}
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-gray-500">Duración</p>
                <p className="text-gray-900">{booking.service.duration} min</p>
              </div>
              {booking.service.price && (
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="text-lg font-semibold text-primary">
                    {booking.service.price}€
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="text-primary" size={24} />
            Fecha y Hora
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(booking.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Horario</p>
              <p className="text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                {booking.startTime} - {booking.endTime}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Cambiar Estado
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateStatus('CONFIRMED')}
              disabled={booking.status === 'CONFIRMED'}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle size={18} />
              Confirmar
            </button>
            <button
              onClick={() => updateStatus('COMPLETED')}
              disabled={booking.status === 'COMPLETED'}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle size={18} />
              Completar
            </button>
            <button
              onClick={() => updateStatus('CANCELLED')}
              disabled={booking.status === 'CANCELLED'}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <XCircle size={18} />
              Cancelar
            </button>
            <button
              onClick={() => updateStatus('NO_SHOW')}
              disabled={booking.status === 'NO_SHOW'}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Ban size={18} />
              No Show
            </button>
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Notas del Cliente */}
        {booking.clientNotes && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="text-secondary" size={24} />
              Notas del Cliente
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {booking.clientNotes}
            </p>
          </div>
        )}

        {/* Notas del Admin */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="text-primary" size={24} />
            Notas Internas
          </h2>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Agregar notas internas (visibles solo para admin)"
            className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} />
            {savingNotes ? 'Guardando...' : 'Guardar Notas'}
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p>
          Reserva creada el{' '}
          {new Date(booking.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className="mt-1">ID: {booking.id}</p>
      </div>
    </div>
  );
}