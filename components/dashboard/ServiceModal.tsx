'use client';

import { useState, useEffect } from 'react';
import { Service } from '@prisma/client';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ServiceModalProps {
  service?: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ServiceModal = ({ service, isOpen, onClose, onSave }: ServiceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    durationMinutes: 60,
    price: '',
    category: 'corporal' as 'corporal' | 'facial' | 'acupuntura',
    imageUrl: '',
    benefits: [] as string[],
    active: true,
  });

  const [newBenefit, setNewBenefit] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        slug: service.slug,
        description: service.description || '',
        shortDescription: service.shortDescription || '',
        durationMinutes: service.durationMinutes,
        price: service.price?.toString() || '',
        category: service.category as 'corporal' | 'facial' | 'acupuntura',
        imageUrl: service.imageUrl || '',
        benefits: (service.benefits as string[]) || [],
        active: service.active,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        durationMinutes: 60,
        price: '',
        category: 'corporal',
        imageUrl: '',
        benefits: [],
        active: true,
      });
    }
  }, [service]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !service ? generateSlug(name) : prev.slug,
    }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = service
        ? `/api/services/${service.id}`
        : '/api/services';
      const method = service ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      toast.success(service ? 'Servicio actualizado' : 'Servicio creado');
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el servicio');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL amigable) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: masaje-linforeductox
              </p>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as any,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="corporal">Corporal</option>
                <option value="facial">Facial</option>
                <option value="acupuntura">Acupuntura</option>
              </select>
            </div>

            {/* Duración y Precio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      durationMinutes: parseInt(e.target.value),
                    }))
                  }
                  min="15"
                  step="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (€)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>
            </div>

            {/* Descripción corta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Corta
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Resumen breve del servicio"
              />
            </div>

            {/* Descripción completa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Completa
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Descripción detallada del servicio"
              />
            </div>

            {/* URL de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            {/* Beneficios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficios
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Añade un beneficio"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              {formData.benefits.length > 0 && (
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="flex-1 text-sm">{benefit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activo */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, active: e.target.checked }))
                }
                className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Servicio activo (visible en la web)
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : service ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;