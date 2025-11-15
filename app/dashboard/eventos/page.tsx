// app/dashboard/eventos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, MapPin, Edit, Trash2, Loader2, Eye, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, isPast, isFuture, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate?: string;
  location: string;
  eventType: string;
  status: string;
  price?: number;
  isFree: boolean;
  heroImage?: string;
  active: boolean;
}

export default function EventosPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
      }
    } catch (error) {
      toast.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('¿Estás segura de eliminar este evento?')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Evento eliminado');
        fetchEvents();
      } else {
        toast.error('Error al eliminar evento');
      }
    } catch (error) {
      toast.error('Error al eliminar evento');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (event: Event) => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    const now = new Date();

    if (event.status === 'CANCELLED') {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Cancelado</span>;
    }
    if (event.status === 'DRAFT') {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Borrador</span>;
    }
    if (isPast(endDate)) {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Finalizado</span>;
    }
    if (isFuture(startDate)) {
      const days = differenceInDays(startDate, now);
      return (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          En {days} día{days !== 1 ? 's' : ''}
        </span>
      );
    }
    return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">En curso</span>;
  };

  const filteredEvents = events.filter((event) => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    if (filter === 'upcoming') {
      return isFuture(startDate) && event.status !== 'CANCELLED';
    }
    if (filter === 'past') {
      return isPast(endDate);
    }
    return true;
  });

  const upcomingEvents = filteredEvents.filter((e) => isFuture(new Date(e.startDate)) && e.status !== 'CANCELLED');
  const pastEvents = filteredEvents.filter((e) => isPast(new Date(e.endDate || e.startDate)));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona talleres, charlas y eventos especiales
          </p>
        </div>
        <Link
          href="/dashboard/eventos/nuevo"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Evento
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({events.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'upcoming' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Próximos ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'past' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pasados ({pastEvents.length})
        </button>
      </div>

      {/* Lista de eventos */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay eventos
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer evento para comenzar
          </p>
          <Link
            href="/dashboard/eventos/nuevo"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark"
          >
            <Plus size={20} />
            Crear Evento
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Próximos eventos */}
          {upcomingEvents.length > 0 && (filter === 'all' || filter === 'upcoming') && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={24} className="text-primary" />
                Próximos Eventos
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          {getStatusBadge(event)}
                          {!event.active && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              Inactivo
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              {format(new Date(event.startDate), "d 'de' MMMM, yyyy • HH:mm", { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{event.eventType}</span>
                            <span>•</span>
                            <span>{event.isFree ? 'Gratuito' : `${event.price}€`}</span>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/eventos/${event.slug}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Ver en la web"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/dashboard/eventos/${event.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          disabled={deletingId === event.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deletingId === event.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eventos pasados */}
          {pastEvents.length > 0 && (filter === 'all' || filter === 'past') && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={24} className="text-gray-500" />
                Eventos Pasados
              </h2>
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          {getStatusBadge(event)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                              {format(new Date(event.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/eventos/${event.slug}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/dashboard/eventos/${event.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          disabled={deletingId === event.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          {deletingId === event.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}