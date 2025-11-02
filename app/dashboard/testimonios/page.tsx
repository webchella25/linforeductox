// app/dashboard/testimonios/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  MessageSquare,
  Star,
  User,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Filter,
  Search,
  ExternalLink,
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  email?: string;
  service?: string;
  rating: number;
  text: string;
  image?: string;
  status: string;
  order: number;
  createdAt: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: MessageSquare,
  },
  APPROVED: {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800',
    icon: Check,
  },
  REJECTED: {
    label: 'Rechazado',
    color: 'bg-red-100 text-red-800',
    icon: X,
  },
};

export default function TestimoniosPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    rating: 5,
    text: '',
  });

  useEffect(() => {
    fetchTestimonials();
  }, [filterStatus]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const res = await fetch(`/api/testimonials?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(Array.isArray(data) ? data : data.testimonials || []);
      }
    } catch (error) {
      console.error('Error al cargar testimonios:', error);
      toast.error('Error al cargar testimonios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = isEditing ? `/api/testimonials/${selectedTestimonial?.id}` : '/api/testimonials';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isEditing ? 'Testimonio actualizado' : 'Testimonio creado');
        fetchTestimonials();
        handleCloseModal();
      } else {
        toast.error('Error al guardar el testimonio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el testimonio');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success('Estado actualizado');
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás segura de eliminar este testimonio?')) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Testimonio eliminado');
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditing(true);
    setFormData({
      name: testimonial.name,
      email: testimonial.email || '',
      service: testimonial.service || '',
      rating: testimonial.rating,
      text: testimonial.text,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedTestimonial(null);
    setFormData({
      name: '',
      email: '',
      service: '',
      rating: 5,
      text: '',
    });
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter((t) => t.status === 'PENDING').length,
    approved: testimonials.filter((t) => t.status === 'APPROVED').length,
    rejected: testimonials.filter((t) => t.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonios</h1>
          <p className="text-gray-600 mt-2">Gestiona los testimonios de tus clientes</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/testimonios"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={18} />
            Ver página pública
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            Nuevo Testimonio
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <MessageSquare className="text-yellow-400" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <Check className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rechazados</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <X className="text-red-400" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o texto..."
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
              <option value="APPROVED">Aprobados</option>
              <option value="REJECTED">Rechazados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-500">
            Cargando testimonios...
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="col-span-full p-12 text-center">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 mb-4">No se encontraron testimonios</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Plus size={16} />
              Crear primer testimonio
            </button>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => {
            const StatusIcon = statusConfig[testimonial.status as keyof typeof statusConfig].icon;

            return (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header con status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      {testimonial.service && (
                        <p className="text-sm text-gray-600">{testimonial.service}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      statusConfig[testimonial.status as keyof typeof statusConfig].color
                    }`}
                  >
                    <StatusIcon size={12} />
                    {statusConfig[testimonial.status as keyof typeof statusConfig].label}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>

                {/* Texto */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {testimonial.text}
                </p>

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {testimonial.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateStatus(testimonial.id, 'APPROVED')}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        <Check size={16} />
                        Aprobar
                      </button>
                      <button
                        onClick={() => updateStatus(testimonial.id, 'REJECTED')}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <X size={16} />
                        Rechazar
                      </button>
                    </>
                  )}
                  {testimonial.status === 'APPROVED' && (
                    <button
                      onClick={() => updateStatus(testimonial.id, 'REJECTED')}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <X size={16} />
                      Rechazar
                    </button>
                  )}
                  {testimonial.status === 'REJECTED' && (
                    <button
                      onClick={() => updateStatus(testimonial.id, 'APPROVED')}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <Check size={16} />
                      Aprobar
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Testimonio' : 'Nuevo Testimonio'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicio (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="Ej: Tratamiento Corporal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="p-2"
                    >
                      <Star
                        size={32}
                        className={
                          rating <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonio
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  {isEditing ? 'Actualizar' : 'Crear'} Testimonio
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}