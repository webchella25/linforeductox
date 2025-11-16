// components/dashboard/SubTreatmentsManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUploader from './ImageUploader';

interface SubTreatment {
  id: string;
  name: string;
  description: string;
  duration: number | null;
  imageUrl: string | null;
  active: boolean;
  order: number;
}

interface SubTreatmentsManagerProps {
  serviceId: string;
}

export default function SubTreatmentsManager({ serviceId }: SubTreatmentsManagerProps) {
  const [subTreatments, setSubTreatments] = useState<SubTreatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    imageUrl: '',
    active: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSubTreatments();
  }, [serviceId]);

  const fetchSubTreatments = async () => {
    try {
      const res = await fetch(`/api/services/${serviceId}/sub-treatments`);
      const data = await res.json();
      setSubTreatments(data.subTreatments || []);
    } catch (error) {
      toast.error('Error al cargar subtratamientos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    const url = editingId
      ? `/api/services/${serviceId}/sub-treatments/${editingId}`
      : `/api/services/${serviceId}/sub-treatments`;
    
    const method = editingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
      }),
    });

    if (res.ok) {
      toast.success(editingId ? 'Subtratamiento actualizado' : 'Subtratamiento creado');
      await fetchSubTreatments(); // ✅ ESPERAR a que se recargue
      resetForm();
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || 'Error al guardar');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al guardar subtratamiento');
  } finally {
    setSaving(false);
  }
};

  const handleEdit = (subTreatment: SubTreatment) => {
    setEditingId(subTreatment.id);
    setFormData({
      name: subTreatment.name,
      description: subTreatment.description,
      duration: subTreatment.duration?.toString() || '',
      imageUrl: subTreatment.imageUrl || '',
      active: subTreatment.active,
      order: subTreatment.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este subtratamiento?')) return;

    try {
      const res = await fetch(`/api/services/${serviceId}/sub-treatments/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Subtratamiento eliminado');
        fetchSubTreatments();
      }
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      duration: '',
      imageUrl: '',
      active: true,
      order: 0,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Subtratamientos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tipos específicos o variantes de este servicio
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            Añadir Subtratamiento
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editingId ? 'Editar Subtratamiento' : 'Nuevo Subtratamiento'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del subtratamiento *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Masaje Madero"
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Descripción breve del subtratamiento..."
              />
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (minutos) - Opcional
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío para usar la duración del servicio principal
              </p>
            </div>

            {/* Orden */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Imagen */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Imagen (opcional)
  </label>
  <ImageUploader
    value={formData.imageUrl}
    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
    onRemove={() => setFormData({ ...formData, imageUrl: '' })}
    label=""
    aspectRatio="4/3"
    maxSizeMB={3}
  />
</div>

            {/* Activo */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary rounded"
                />
                <span className="text-sm text-gray-700">Subtratamiento activo (visible en la web)</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editingId ? 'Actualizar' : 'Crear'}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lista de subtratamientos */}
      {subTreatments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay subtratamientos creados</p>
          <p className="text-sm mt-2">Haz clic en "Añadir Subtratamiento" para crear uno</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subTreatments.map((sub) => (
            <div
              key={sub.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {sub.imageUrl && (
                <img
                  src={sub.imageUrl}
                  alt={sub.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{sub.name}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{sub.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {sub.duration && <span>⏱️ {sub.duration} min</span>}
                <span className={`px-2 py-1 rounded ${sub.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {sub.active ? 'Activo' : 'Inactivo'}
                </span>
                <span>Orden: {sub.order}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}