// app/tienda/TiendaClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Filter, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  basePrice: number;
  featured: boolean;
  images: any;
  category: {
    id: string;
    name: string;
    icon: string;
    slug: string;
    description?: string | null;
    active: boolean;
    order: number;
    createdAt: string; // ✅ CAMBIAR A string (serializado)
    updatedAt: string; // ✅ CAMBIAR A string (serializado)
  };
  createdAt: string; // ✅ AGREGAR
  updatedAt: string; // ✅ AGREGAR
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string | null; // ✅ AGREGAR | null
  active: boolean;
  order: number;
  createdAt: string; // ✅ AGREGAR
  updatedAt: string; // ✅ AGREGAR
  _count: {
    products: number;
  };
}

interface Colors {
  primaryColor: string;
  primaryDark: string;
  secondaryColor: string;
  secondaryLight: string;
  creamColor: string;
  textColor: string;
}

interface TiendaClientProps {
  products: Product[];
  categories: Category[];
  colors: Colors;
}

export default function TiendaClient({ products, categories, colors }: TiendaClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category.id === selectedCategory)
    : products;

  const getMainImage = (images: any) => {
    if (!images) return null;
    const imageArray = Array.isArray(images) ? images : [];
    return imageArray[0]?.url || null;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.creamColor }}>
      {/* Hero Section */}
      <section
        className="relative py-20 text-white"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Nuestra Tienda
            </h1>
            <p className="text-xl opacity-90">
              Productos exclusivos para tu bienestar y cuidado personal
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filtros Mobile Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              style={{ color: colors.primaryColor }}
            >
              <Filter size={20} />
              {selectedCategory ? 'Filtrado' : 'Filtrar por categoría'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categorías */}
            <aside
              className={`lg:w-64 flex-shrink-0 ${
                showFilters ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.primaryColor }}
                  >
                    Categorías
                  </h2>
                  {showFilters && (
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Todas las categorías */}
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setShowFilters(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === null
                        ? 'text-white shadow-md'
                        : 'hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor:
                        selectedCategory === null ? colors.primaryColor : 'transparent',
                      color: selectedCategory === null ? 'white' : colors.textColor,
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">🛍️</span>
                      <span className="font-medium">Todos</span>
                    </span>
                    <span className="text-sm opacity-75">{products.length}</span>
                  </button>

                  {/* Lista de categorías */}
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFilters(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'text-white shadow-md'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor:
                          selectedCategory === category.id
                            ? colors.primaryColor
                            : 'transparent',
                        color:
                          selectedCategory === category.id ? 'white' : colors.textColor,
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </span>
                      <span className="text-sm opacity-75">
                        {category._count.products}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Grid de Productos */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textColor }}>
                    No hay productos disponibles
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {selectedCategory
                      ? 'No hay productos en esta categoría'
                      : 'Vuelve pronto para ver nuestros nuevos productos'}
                  </p>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="px-6 py-3 rounded-lg text-white hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: colors.primaryColor }}
                    >
                      Ver todos los productos
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const mainImage = getMainImage(product.images);

                    return (
                      <Link
                        key={product.id}
                        href={`/tienda/${product.slug}`}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                      >
                        {/* Imagen */}
                        <div className="relative h-64 bg-gray-100">
                          {mainImage ? (
                            <Image
                              src={mainImage}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingBag className="w-16 h-16 text-gray-300" />
                            </div>
                          )}

                          {/* Badge de destacado */}
                          {product.featured && (
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1"
                              style={{ backgroundColor: colors.secondaryColor }}
                            >
                              <Star size={14} fill="currentColor" />
                              Destacado
                            </div>
                          )}

                          {/* Categoría */}
                          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium shadow-sm">
                            {product.category.icon} {product.category.name}
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6">
                          <h3
                            className="text-xl font-bold mb-2 group-hover:underline line-clamp-2"
                            style={{ color: colors.primaryColor }}
                          >
                            {product.name}
                          </h3>

                          {product.shortDescription && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {product.shortDescription}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t">
                            <span
                              className="text-2xl font-bold"
                              style={{ color: colors.secondaryColor }}
                            >
                              {product.basePrice}€
                            </span>
                            <span
                              className="text-sm font-medium group-hover:translate-x-1 transition-transform"
                              style={{ color: colors.primaryColor }}
                            >
                              Ver detalles →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}