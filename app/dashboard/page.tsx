// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

// Usar el tipo generado automáticamente por Prisma
type BookingWithService = Prisma.BookingGetPayload<{
  include: { service: true };
}>;

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    todayBookings,
    approvedTestimonials,
    pendingTestimonials,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({
      where: {
        date: { gte: today, lt: tomorrow },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    }),
    prisma.testimonial.count({ where: { status: 'APPROVED' } }),
    prisma.testimonial.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    todayBookings,
    approvedTestimonials,
    pendingTestimonials,
  };
}

async function getRecentBookings(): Promise<BookingWithService[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    include: {
      service: true,
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: 5,
  });

  return bookings as BookingWithService[];
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const stats = await getDashboardStats();
  const recentBookings = await getRecentBookings();

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; icon: any }> = {
      PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      CONFIRMED: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      COMPLETED: { label: 'Completada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const { label, color, icon: Icon } = config[status] || config.PENDING;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon size={14} />
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenida, {session.user?.name || session.user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Reservas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="text-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pendingBookings}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Confirmadas</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.confirmedBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Hoy</p>
              <p className="text-3xl font-bold text-secondary mt-1">{stats.todayBookings}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-secondary" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Próximas Reservas */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-primary" size={20} />
            Próximas Reservas
          </h3>
          <Link href="/dashboard/reservas" className="text-primary hover:text-primary-dark text-sm">
            Ver todas →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay reservas próximas</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{booking.clientName}</p>
                    <p className="text-sm text-gray-600">{booking.service.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      - {booking.startTime}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(booking.status)}
                  <Link
                    href={`/dashboard/reservas/${booking.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen Rápido */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-secondary" size={20} />
              Testimonios
            </h3>
            <Link href="/dashboard/testimonios" className="text-primary hover:text-primary-dark text-sm">
              Gestionar →
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Aprobados</span>
              <span className="font-semibold text-green-600">{stats.approvedTestimonials}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pendientes</span>
              <span className="font-semibold text-yellow-600">{stats.pendingTestimonials}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/reservas"
              className="p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors text-center"
            >
              <Calendar className="mx-auto text-primary mb-2" size={24} />
              <p className="text-sm font-medium text-gray-900">Reservas</p>
            </Link>
            <Link
              href="/dashboard/servicios"
              className="p-4 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors text-center"
            >
              <Users className="mx-auto text-secondary mb-2" size={24} />
              <p className="text-sm font-medium text-gray-900">Servicios</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}