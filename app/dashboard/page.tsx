// app/dashboard/page.tsx

/ app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    prisma.booking.count({
      where: {
        status: 'PENDING',
      },
    }),
    prisma.booking.count({
      where: {
        status: 'CONFIRMED',
      },
    }),
    prisma.booking.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    }),
    prisma.testimonial.count({
      where: {
        status: 'APPROVED',
      },
    }),
    prisma.testimonial.count({
      where: {
        status: 'PENDING',
      },
    }),
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

async function getRecentBookings() {
  return await prisma.booking.findMany({
    where: {
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
    include: {
      service: true,  // ← ASEGÚRATE DE QUE ESTO ESTÉ
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: 5,
  });
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const stats = await getDashboardStats();
  const recentBookings = await getRecentBookings();

  const statCards = [
    {
      title: 'Reservas Pendientes',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/dashboard/reservas?status=pending',
    },
    {
      title: 'Reservas Confirmadas',
      value: stats.confirmedBookings,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/dashboard/reservas?status=confirmed',
    },
    {
      title: 'Citas de Hoy',
      value: stats.todayBookings,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/dashboard/reservas?filter=today',
    },
    {
      title: 'Testimonios Pendientes',
      value: stats.pendingTestimonials,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/dashboard/testimonios?status=pending',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: {
        text: 'Pendiente',
        className: 'bg-orange-100 text-orange-800',
        icon: AlertCircle,
      },
      CONFIRMED: {
        text: 'Confirmada',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      CANCELLED: {
        text: 'Cancelada',
        className: 'bg-red-100 text-red-800',
        icon: XCircle,
      },
      COMPLETED: {
        text: 'Completada',
        className: 'bg-blue-100 text-blue-800',
        icon: CheckCircle,
      },
      NO_SHOW: {
        text: 'No asistió',
        className: 'bg-gray-100 text-gray-800',
        icon: XCircle,
      },
    };

    const badge = badges[status as keyof typeof badges] || badges.PENDING;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
      >
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenida, {session.user?.name || 'Aline'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-full`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Próximas Reservas */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-primary" size={24} />
            Próximas Reservas
          </h2>
          <Link
            href="/dashboard/reservas"
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            Ver todas →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay reservas próximas
          </p>
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
                    <p className="font-semibold text-gray-900">
                      {booking.clientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.service.name}
                    </p>
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
        {/* Testimonios */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="text-secondary" size={20} />
              Testimonios
            </h3>
            <Link
              href="/dashboard/testimonios"
              className="text-primary hover:text-primary-dark text-sm"
            >
              Gestionar →
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Aprobados</span>
              <span className="font-semibold text-green-600">
                {stats.approvedTestimonials}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pendientes</span>
              <span className="font-semibold text-orange-600">
                {stats.pendingTestimonials}
              </span>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Accesos Rápidos
          </h3>
          <div className="space-y-2">
            <Link
              href="/dashboard/reservas/calendario"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Calendar className="text-primary" size={20} />
              <span className="text-gray-700">Ver Calendario</span>
            </Link>
            <Link
              href="/dashboard/configuracion/horarios"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Clock className="text-primary" size={20} />
              <span className="text-gray-700">Configurar Horarios</span>
            </Link>
            <Link
              href="/dashboard/contenido"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <TrendingUp className="text-primary" size={20} />
              <span className="text-gray-700">Editar Contenido Web</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}