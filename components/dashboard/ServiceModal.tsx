// components/dashboard/ServiceModal.tsx
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
    duration: 60, // ✅ duration en lugar de durationMinutes
    price: '',
    category: 'corporal' as 'corporal' | 'facial' | 'acupuntura',
    benefits: [] as string[],
    conditions: [] as string[], // ✅ Agregado conditions
    active: true,
  });

  const [newBenefit, setNewBenefit] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        slug: service.slug,
        description: service.description || '',
        duration: service.duration, // ✅ duration
        price: service.price?.toString() || '',
        category: service.category as 'corporal' | 'facial' | 'acupuntura',
        benefits: service.benefits || [],
        conditions: service.conditions || [],
        active: service.active,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        duration: 60,
        price: '',
        category: 'corporal',
        benefits: [],
        conditions: [],
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

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()],
      }));
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = service
        ? `/api/services/${service.id}`
        : '/api/services';
      const method = service ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
        }),
      });

      if (response.ok) {
        toast.success(service ? 'Servicio actualizado' : 'Servicio creado');
        onSave();
        onClose();
      } else {
        toast.error('Error al guardar el servicio');
      }
    } catch (error) {
      toast.error('Error al guardar el servicio');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold mb-6">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Duración y Precio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (min) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="15"
                  className="w-full px-4 py-2 border rounded-lg"
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
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;