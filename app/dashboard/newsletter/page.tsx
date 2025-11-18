// app/dashboard/newsletter/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Mail, Search, UserX, UserCheck, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  active: boolean;
  createdAt: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar suscriptores');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscriber: Subscriber) => {
    if (
      !confirm(
        `¿Estás seguro de desuscribir a ${subscriber.email}?\n\nEsta acción marcará al suscriptor como inactivo.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/newsletter/${subscriber.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Suscriptor desactivado correctamente');
        fetchSubscribers();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al desuscribir');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al desuscribir');
    }
  };

  const handleExportCSV = () => {
    const activeSubscribers = subscribers.filter((s) => s.active);

    if (activeSubscribers.length === 0) {
      toast.error('No hay suscriptores activos para exportar');
      return;
    }

    // Crear CSV
    const headers = ['Email', 'Nombre', 'Origen', 'Fecha de Suscripción'];
    const rows = activeSubscribers.map((sub) => [
      sub.email,
      sub.name || '',
      getSourceLabel(sub.source),
      new Date(sub.createdAt).toLocaleDateString('es-ES'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `newsletter-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV exportado correctamente');
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      sale: 'Compra',
      contact_form: 'Formulario de Contacto',
      footer: 'Footer',
      manual: 'Manual',
    };
    return labels[source] || source;
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && sub.active) ||
      (filter === 'inactive' && !sub.active);

    const matchesSearch =
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.active).length,
    inactive: subscribers.filter((s) => !s.active).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los suscriptores de tu newsletter
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={stats.active === 0}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={20} />
          Exportar CSV
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Suscriptores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por email o nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activos ({stats.active})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactivos ({stats.inactive})
            </button>
          </div>
        </div>
      </div>

      {/* Lista de suscriptores */}
      {filteredSubscribers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay suscriptores
          </h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all'
              ? 'No se encontraron suscriptores con los filtros aplicados'
              : 'Aún no tienes suscriptores en tu newsletter'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Suscripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {subscriber.name || '-'}
                    </td>

                    {/* Origen */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getSourceLabel(subscriber.source)}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      {subscriber.active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <UserCheck size={14} />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <UserX size={14} />
                          Inactivo
                        </span>
                      )}
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(subscriber.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      {subscriber.active && (
                        <button
                          onClick={() => handleUnsubscribe(subscriber)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Desuscribir"
                        >
                          <Trash2 size={16} />
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 Sobre la gestión de Newsletter
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Los suscriptores pueden venir de diferentes fuentes: compras, formularios, footer, etc.
          </li>
          <li>
            • Al desactivar un suscriptor, se mantiene en la base de datos pero se marca como inactivo
          </li>
          <li>
            • Puedes exportar todos los suscriptores activos en formato CSV para usar en otras herramientas
          </li>
          <li>
            • El CSV incluye: email, nombre, origen y fecha de suscripción
          </li>
        </ul>
      </div>
    </div>
  );
}