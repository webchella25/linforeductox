// app/dashboard/tienda/categorias/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Tag, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  active: boolean;
  order: number;
  _count?: {
    products: number;
  };
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📦',
    active: true,
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/product-categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `/api/product-categories/${editingCategory.id}`
        : '/api/product-categories';

      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          editingCategory
            ? 'Categoría actualizada correctamente'
            : 'Categoría creada correctamente'
        );
        setShowModal(false);
        resetForm();
        fetchCategories();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al guardar categoría');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar categoría');
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon,
      active: category.active,
      order: category.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (category: ProductCategory) => {
    if (category._count && category._count.products > 0) {
      toast.error(
        `No se puede eliminar una categoría con ${category._count.products} productos asociados`
      );
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/product-categories/${category.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Categoría eliminada correctamente');
        fetchCategories();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al eliminar categoría');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar categoría');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '📦',
      active: true,
      order: 0,
    });
    setEditingCategory(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías de Productos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las categorías de tu tienda
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-md"
        >
          <Plus size={20} />
          Nueva Categoría
        </button>
      </div>

      {/* Lista de categorías */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay categorías
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primera categoría para organizar tus productos
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={20} />
            Crear Primera Categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {category._count?.products || 0} productos
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="Ej: Kits de Masaje"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Slug (auto-generado) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="kits-de-masaje"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Se genera automáticamente al escribir el nombre
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Descripción corta de la categoría"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Icono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📦"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-2xl"
                  maxLength={2}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Usa un emoji para representar la categoría
                </p>
              </div>

              {/* Orden */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden de visualización
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                  min={0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Menor número = aparece primero
                </p>
              </div>

              {/* Activa */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Categoría activa (visible en la tienda)
                </label>
              </div>

              {/* Botones */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Save size={20} />
                  {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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