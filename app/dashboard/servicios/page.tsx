// app/dashboard/servicios/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Power, Loader2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  duration: number;
  price: number | null;
  active: boolean;
  order: number;
  parentServiceId: string | null; // ✅ NUEVO
  childServices?: Service[]; // ✅ NUEVO
  categoryRel?: {
    id: string;
    name: string;
  };
}

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      
      // ✅ Organizar servicios en jerarquía
      const parentServices = data.services.filter((s: Service) => !s.parentServiceId);
      const childServices = data.services.filter((s: Service) => s.parentServiceId);
      
      // Asignar hijos a sus padres
      const servicesWithChildren = parentServices.map((parent: Service) => ({
        ...parent,
        childServices: childServices.filter((child: Service) => 
          child.parentServiceId === parent.id
        ),
      }));
      
      // Expandir todos por defecto
      setExpandedParents(new Set(parentServices.map((s: Service) => s.id)));
      
      setServices(servicesWithChildren);
    } catch (error) {
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus }),
      });

      if (res.ok) {
        toast.success(
          !currentStatus ? 'Servicio activado' : 'Servicio desactivado'
        );
        fetchServices();
      } else {
        toast.error('Error al actualizar servicio');
      }
    } catch (error) {
      toast.error('Error al actualizar servicio');
    }
  };

  const deleteService = async (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toast.error('No puedes eliminar un servicio que tiene subtratamientos. Elimina primero los subtratamientos.');
      return;
    }

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

  const toggleParent = (parentId: string) => {
    const newExpanded = new Set(expandedParents);
    if (newExpanded.has(parentId)) {
      newExpanded.delete(parentId);
    } else {
      newExpanded.add(parentId);
    }
    setExpandedParents(newExpanded);
  };

  const getCategoryBadge = (service: Service) => {
    const categoryName = service.categoryRel?.name || service.category;
    
    const badges: Record<string, { bg: string; text: string }> = {
      corporal: { bg: 'bg-blue-100', text: 'text-blue-800' },
      facial: { bg: 'bg-pink-100', text: 'text-pink-800' },
      acupuntura: { bg: 'bg-purple-100', text: 'text-purple-800' },
    };

    const badge = badges[service.category?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-medium`}>
        {categoryName}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-12"></th>
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
                  <>
                    {/* ✅ SERVICIO PADRE */}
                    <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {service.childServices && service.childServices.length > 0 && (
                          <button
                            onClick={() => toggleParent(service.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ChevronRight
                              size={20}
                              className={`transition-transform ${
                                expandedParents.has(service.id) ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {service.name}
                              {service.childServices && service.childServices.length > 0 && (
                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                  {service.childServices.length} subtratamientos
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">/{service.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getCategoryBadge(service)}</td>
                      <td className="px-6 py-4 text-gray-700">{service.duration} min</td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        {service.price ? `${service.price}€` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(service.id, service.active)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            service.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <Power size={14} />
                          {service.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/servicios/${service.id}`}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteService(service.id, (service.childServices?.length || 0) > 0)}
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

                    {/* ✅ SUBTRATAMIENTOS (HIJOS) */}
                    {expandedParents.has(service.id) &&
                      service.childServices &&
                      service.childServices.map((child) => (
                        <tr
                          key={child.id}
                          className="hover:bg-gray-50 transition-colors bg-blue-50/30"
                        >
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 border-l-2 border-b-2 border-gray-300 h-8 -mb-4"></div>
                              <div>
                                <div className="font-medium text-gray-700 flex items-center gap-2">
                                  {child.name}
                                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                    Subtratamiento
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">/{child.slug}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getCategoryBadge(child)}</td>
                          <td className="px-6 py-4 text-gray-700">{child.duration} min</td>
                          <td className="px-6 py-4 text-gray-700 font-semibold">
                            {child.price ? `${child.price}€` : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleActive(child.id, child.active)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                child.active
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              <Power size={14} />
                              {child.active ? 'Activo' : 'Inactivo'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/dashboard/servicios/${child.id}`}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit size={18} />
                              </Link>
                              <button
                                onClick={() => deleteService(child.id, false)}
                                disabled={deletingId === child.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Eliminar"
                              >
                                {deletingId === child.id ? (
                                  <Loader2 className="animate-spin" size={18} />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}