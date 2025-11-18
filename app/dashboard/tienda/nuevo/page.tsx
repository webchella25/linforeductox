// app/dashboard/tienda/nuevo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ProductImageManager from '@/components/dashboard/tienda/ProductImageManager';

interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  active: boolean; // ✅ AGREGAR ESTA LÍNEA
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    basePrice: 0,
    categoryId: '',
    images: [] as any[],
    stock: null as number | null,
    trackStock: false,
    active: true,
    featured: false,
    order: 0,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/product-categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.filter((c: ProductCategory) => c.active));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar categorías');
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

    if (formData.images.length === 0) {
      toast.error('Debes agregar al menos una imagen');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Debes seleccionar una categoría');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Producto creado correctamente');
        router.push('/dashboard/tienda');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al crear producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/tienda"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
          <p className="text-gray-600 mt-2">
            Completa la información del producto
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Información Básica</h2>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Ej: Kit de Masaje Relajante"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL (Slug) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="kit-masaje-relajante"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
            />
            <p className="text-sm text-gray-500 mt-1">
              Se genera automáticamente. URL: /tienda/{formData.slug || 'producto'}
            </p>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠️ No hay categorías activas.{' '}
                <Link
                  href="/dashboard/tienda/categorias"
                  className="underline hover:text-amber-700"
                >
                  Crear categoría
                </Link>
              </p>
            )}
          </div>

          {/* Descripción corta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Corta
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              placeholder="Resumen breve para las tarjetas de producto"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Máximo 100 caracteres ({formData.shortDescription.length}/100)
            </p>
          </div>

          {/* Descripción completa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Completa *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={6}
              placeholder="Describe el producto en detalle..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Base *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: parseFloat(e.target.value) })
                }
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                €
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Este precio puede ser negociado con cada cliente
            </p>
          </div>
        </div>

        {/* Imágenes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Imágenes</h2>
          <ProductImageManager
            images={formData.images}
            onChange={(images) => setFormData({ ...formData, images })}
            maxImages={5}
          />
        </div>

        {/* Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Inventario</h2>

          {/* Controlar stock */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="trackStock"
              checked={formData.trackStock}
              onChange={(e) =>
                setFormData({ ...formData, trackStock: e.target.checked })
              }
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="trackStock" className="text-sm font-medium text-gray-700">
              Controlar stock de este producto
            </label>
          </div>

          {/* Cantidad en stock */}
          {formData.trackStock && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad en Stock
              </label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                min="0"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Configuración */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Configuración</h2>

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

          {/* Checkboxes */}
          <div className="space-y-3">
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
                Producto activo (visible en la tienda)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Producto destacado (aparece en portada)
              </label>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">SEO (Opcional)</h2>

          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({ ...formData, metaTitle: e.target.value })
              }
              placeholder="Título para motores de búsqueda"
              maxLength={60}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recomendado: 50-60 caracteres ({formData.metaTitle.length}/60)
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              rows={3}
              placeholder="Descripción para motores de búsqueda"
              maxLength={160}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recomendado: 150-160 caracteres ({formData.metaDescription.length}/160)
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creando...
              </>
            ) : (
              <>
                <Save size={20} />
                Crear Producto
              </>
            )}
          </button>
          <Link
            href="/dashboard/tienda"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}