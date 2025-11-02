// app/dashboard/servicios/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: number | null;
  category: string;
  active: boolean;
  order: number;
}

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (res.ok) {
        toast.success(
          !currentActive ? 'Servicio activado' : 'Servicio desactivado'
        );
        fetchServices();
      } else {
        toast.error('Error al actualizar servicio');
      }
    } catch (error) {
      toast.error('Error al actualizar servicio');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('¿Estás segura de eliminar este servicio? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Servicio eliminado correctamente');
        fetchServices();
      } else {
        toast.error('Error al eliminar servicio');
      }
    } catch (error) {
      toast.error('Error al eliminar servicio');
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      corporal: { bg: 'bg-blue-100', text: 'text-blue-800' },
      facial: { bg: 'bg-pink-100', text: 'text-pink-800' },
      acupuntura: { bg: 'bg-purple-100', text: 'text-purple-800' },
    };

    const badge = badges[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-medium`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los servicios que aparecen en la web
          </p>
        </div>
        <Link
          href="/dashboard/servicios/nuevo"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Servicio
        </Link>
      </div>

      {/* Tabla de servicios */}
      {services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-6">
            No hay servicios creados todavía
          </p>
          <Link
            href="/dashboard/servicios/nuevo"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={20} />
            Crear primer servicio
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown size={16} />
                      Orden
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Servicio
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Duración
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">
                        {service.order}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-500">/{service.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getCategoryBadge(service.category)}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {service.duration} min
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {service.price ? `${service.price}€` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(service.id, service.active)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          service.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.active ? (
                          <>
                            <Eye size={14} />
                            Activo
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/servicios/${service.slug}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver en la web"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/dashboard/servicios/${service.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteService(service.id)}
                          disabled={deletingId === service.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deletingId === service.id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Los servicios inactivos no aparecerán en la web ni en el menú.
          El orden determina cómo se muestran en la página de servicios.
        </p>
      </div>
    </div>
  );
}