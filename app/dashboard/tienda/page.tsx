// app/dashboard/tienda/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  basePrice: number;
  active: boolean;
  featured: boolean;
  images: any;
  stock?: number;
  trackStock: boolean;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  _count?: {
    sales: number;
  };
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          active: !product.active,
        }),
      });

      if (res.ok) {
        toast.success(
          product.active
            ? 'Producto desactivado'
            : 'Producto activado'
        );
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar producto');
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Producto eliminado correctamente');
        fetchProducts();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'active') return product.active;
    if (filter === 'inactive') return !product.active;
    return true;
  });

  const getMainImage = (images: any) => {
    if (!images) return null;
    const imageArray = Array.isArray(images) ? images : [];
    return imageArray[0]?.url || null;
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
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los productos de tu tienda
          </p>
        </div>
        <Link
          href="/dashboard/tienda/nuevo"
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-md"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filtrar:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activos ({products.filter((p) => p.active).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactivos ({products.filter((p) => !p.active).length})
            </button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay productos
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer producto para empezar a vender
          </p>
          <Link
            href="/dashboard/tienda/nuevo"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={20} />
            Crear Primer Producto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const mainImage = getMainImage(product.images);

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Imagen */}
                <div className="relative h-48 bg-gray-100">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {product.featured && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ Destacado
                    </span>
                  )}
                  {!product.active && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Inactivo
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl">{product.category.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.category.name}</p>
                    </div>
                  </div>

                  {product.shortDescription && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {product.basePrice}€
                    </span>
                    {product.trackStock && (
                      <span className="text-sm text-gray-600">
                        Stock: {product.stock || 0}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <Link
                      href={`/dashboard/tienda/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                    >
                      <Edit2 size={16} />
                      Editar
                    </Link>
                    <button
                      onClick={() => handleToggleActive(product)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={product.active ? 'Desactivar' : 'Activar'}
                    >
                      {product.active ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}