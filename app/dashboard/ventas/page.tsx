// app/dashboard/ventas/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShoppingCart, Search, Filter, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link'; // ✅ AGREGAR ESTE IMPORT
import toast from 'react-hot-toast';
import SaleStatusBadge from '@/components/dashboard/tienda/SaleStatusBadge';
import Image from 'next/image';

interface Sale {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientNotes?: string;
  status: 'PENDING' | 'IN_PROCESS' | 'COMPLETED' | 'CANCELLED';
  finalPrice?: number;
  adminNotes?: string;
  acceptsNewsletter: boolean;
  createdAt: string;
  completedAt?: string;
  product: {
    id: string;
    name: string;
    basePrice: number;
    images: any;
    category: {
      name: string;
      icon: string;
    };
  };
}

export default function VentasPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'IN_PROCESS' | 'COMPLETED' | 'CANCELLED'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales');
      if (res.ok) {
        const data = await res.json();
        setSales(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (saleId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success('Estado actualizado correctamente');
        fetchSales();
        setSelectedSale(null);
      } else {
        toast.error('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const handleUpdateNotes = async (saleId: string, adminNotes: string, finalPrice?: number) => {
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes, finalPrice }),
      });

      if (res.ok) {
        toast.success('Notas actualizadas correctamente');
        fetchSales();
      } else {
        toast.error('Error al actualizar notas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar notas');
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesFilter = filter === 'all' || sale.status === filter;
    const matchesSearch =
      sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getMainImage = (images: any) => {
    if (!images) return null;
    const imageArray = Array.isArray(images) ? images : [];
    return imageArray[0]?.url || null;
  };

  const stats = {
    total: sales.length,
    pending: sales.filter((s) => s.status === 'PENDING').length,
    inProcess: sales.filter((s) => s.status === 'IN_PROCESS').length,
    completed: sales.filter((s) => s.status === 'COMPLETED').length,
    cancelled: sales.filter((s) => s.status === 'CANCELLED').length,
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
        <p className="text-gray-600 mt-2">
          Administra las solicitudes de compra de tus productos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm p-4">
          <p className="text-sm text-yellow-800">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm p-4">
          <p className="text-sm text-blue-800">En Proceso</p>
          <p className="text-2xl font-bold text-blue-900">{stats.inProcess}</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm p-4">
          <p className="text-sm text-green-800">Completadas</p>
          <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm p-4">
          <p className="text-sm text-red-800">Canceladas</p>
          <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, email o producto..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="IN_PROCESS">En Proceso</option>
              <option value="COMPLETED">Completadas</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      {filteredSales.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay ventas
          </h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all'
              ? 'No se encontraron ventas con los filtros aplicados'
              : 'Aún no has recibido solicitudes de compra'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => {
                  const mainImage = getMainImage(sale.product.images);

                  return (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      {/* Producto */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {mainImage ? (
                              <Image
                                src={mainImage}
                                alt={sale.product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <ShoppingCart className="w-6 h-6 text-gray-300 m-auto" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {sale.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {sale.product.category.icon} {sale.product.category.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cliente */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{sale.clientName}</p>
                          <p className="text-sm text-gray-500">{sale.clientEmail}</p>
                          <p className="text-sm text-gray-500">{sale.clientPhone}</p>
                        </div>
                      </td>

                      {/* Precio */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-900">
                            {sale.finalPrice || sale.product.basePrice}€
                          </p>
                          {sale.finalPrice && sale.finalPrice !== sale.product.basePrice && (
                            <p className="text-xs text-gray-500 line-through">
                              {sale.product.basePrice}€
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <SaleStatusBadge status={sale.status} size="sm" />
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSale(sale)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Detalle de Venta</h2>
              <button
                onClick={() => setSelectedSale(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ExternalLink size={20} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Producto */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Producto</h3>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {getMainImage(selectedSale.product.images) ? (
                      <Image
                        src={getMainImage(selectedSale.product.images)!}
                        alt={selectedSale.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <ShoppingCart className="w-12 h-12 text-gray-400 m-auto" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">
                      {selectedSale.product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedSale.product.category.icon}{' '}
                      {selectedSale.product.category.name}
                    </p>
                    <p className="text-lg font-bold text-primary mt-2">
                      Precio base: {selectedSale.product.basePrice}€
                    </p>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900">{selectedSale.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedSale.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-medium text-gray-900">{selectedSale.clientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Newsletter</p>
                    <p className="font-medium text-gray-900">
                      {selectedSale.acceptsNewsletter ? '✅ Suscrito' : '❌ No suscrito'}
                    </p>
                  </div>
                </div>

                {selectedSale.clientNotes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">Notas del cliente</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedSale.clientNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Estado */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Estado de la Venta</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado actual:</span>
                    <SaleStatusBadge status={selectedSale.status} size="md" />
                  </div>

                  <div className="flex gap-2">
                    {selectedSale.status !== 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedSale.id, 'PENDING')}
                        className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                      >
                        Marcar Pendiente
                      </button>
                    )}
                    {selectedSale.status !== 'IN_PROCESS' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedSale.id, 'IN_PROCESS')}
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        En Proceso
                      </button>
                    )}
                    {selectedSale.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedSale.id, 'COMPLETED')}
                        className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        Completar
                      </button>
                    )}
                    {selectedSale.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedSale.id, 'CANCELLED')}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Precio final y notas admin */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Gestión Interna</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Final Acordado
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        defaultValue={selectedSale.finalPrice || selectedSale.product.basePrice}
                        onBlur={(e) =>
                          handleUpdateNotes(
                            selectedSale.id,
                            selectedSale.adminNotes || '',
                            parseFloat(e.target.value)
                          )
                        }
                        step="0.01"
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        €
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Internas
                    </label>
                    <textarea
                      defaultValue={selectedSale.adminNotes || ''}
                      onBlur={(e) =>
                        handleUpdateNotes(
                          selectedSale.id,
                          e.target.value,
                          selectedSale.finalPrice
                        )
                      }
                      rows={4}
                      placeholder="Añade notas internas sobre esta venta..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Fechas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Fecha de solicitud</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedSale.createdAt).toLocaleString('es-ES')}
                    </p>
                  </div>
                  {selectedSale.completedAt && (
                    <div>
                      <p className="text-gray-600">Fecha de completado</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedSale.completedAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón WhatsApp */}
<div className="pt-4 border-t border-gray-200">
  <button
    onClick={() => {
      const whatsappUrl = `https://wa.me/${selectedSale.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola ${selectedSale.clientName}! Te escribo sobre tu solicitud del producto "${selectedSale.product.name}".`
      )}`;
      window.open(whatsappUrl, '_blank');
    }}
    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
    Contactar por WhatsApp
  </button>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}