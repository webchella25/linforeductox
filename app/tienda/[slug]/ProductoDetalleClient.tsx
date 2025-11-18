// app/tienda/[slug]/ProductoDetalleClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  ArrowLeft,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import WhatsAppPurchaseModal from '@/components/tienda/WhatsAppPurchaseModal';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null; // ✅ AGREGAR | null
  basePrice: number;
  featured: boolean;
  images: any;
  stock?: number | null; // ✅ AGREGAR | null también aquí
  trackStock: boolean;
  category: {
    id: string;
    name: string;
    icon: string;
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

interface ProductoDetalleClientProps {
  product: Product;
  relatedProducts: Product[];
  colors: Colors;
  whatsappNumber: string | null;
}

export default function ProductoDetalleClient({
  product,
  relatedProducts,
  colors,
  whatsappNumber,
}: ProductoDetalleClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(product.images) ? product.images : [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getMainImage = (productImages: any) => {
    if (!productImages) return null;
    const imageArray = Array.isArray(productImages) ? productImages : [];
    return imageArray[0]?.url || null;
  };

  const isOutOfStock = product.trackStock && (product.stock ?? 0) <= 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.creamColor }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="hover:underline" style={{ color: colors.textColor }}>
              Inicio
            </Link>
            <span style={{ color: colors.textColor }}>/</span>
            <Link
              href="/tienda"
              className="hover:underline"
              style={{ color: colors.textColor }}
            >
              Tienda
            </Link>
            <span style={{ color: colors.textColor }}>/</span>
            <span style={{ color: colors.primaryColor }} className="font-medium">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-md transition-shadow bg-white"
          style={{ color: colors.primaryColor }}
        >
          <ArrowLeft size={20} />
          Volver a la tienda
        </Link>
      </div>

      {/* Product Details */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería de Imágenes */}
            <div>
              {images.length > 0 ? (
                <div className="space-y-4">
                  {/* Imagen principal */}
                  <div className="relative aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                    <Image
                      src={images[currentImageIndex].url}
                      alt={images[currentImageIndex].alt || product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    {/* Navegación de imágenes */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                          style={{ color: colors.primaryColor }}
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                          style={{ color: colors.primaryColor }}
                        >
                          <ChevronRight size={24} />
                        </button>

                        {/* Indicadores */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className="w-2 h-2 rounded-full transition-all"
                              style={{
                                backgroundColor:
                                  index === currentImageIndex
                                    ? colors.primaryColor
                                    : 'rgba(255,255,255,0.5)',
                                width: index === currentImageIndex ? '24px' : '8px',
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Badge de destacado */}
                    {product.featured && (
                      <div
                        className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-2"
                        style={{ backgroundColor: colors.secondaryColor }}
                      >
                        <Star size={16} fill="currentColor" />
                        Destacado
                      </div>
                    )}
                  </div>

                  {/* Miniaturas */}
                  {hasMultipleImages && (
                    <div className="grid grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex ? 'shadow-lg' : 'opacity-60 hover:opacity-100'
                          }`}
                          style={{
                            borderColor:
                              index === currentImageIndex
                                ? colors.primaryColor
                                : 'transparent',
                          }}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt || `${product.name} ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <ShoppingBag className="w-32 h-32 text-gray-300" />
                </div>
              )}
            </div>

            {/* Información del Producto */}
            <div className="space-y-6">
              {/* Categoría */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white shadow-sm"
                style={{ color: colors.primaryColor }}
              >
                <span className="text-xl">{product.category.icon}</span>
                {product.category.name}
              </div>

              {/* Título */}
              <h1
                className="text-4xl md:text-5xl font-heading font-bold"
                style={{ color: colors.primaryColor }}
              >
                {product.name}
              </h1>

              {/* Descripción corta */}
              {product.shortDescription && (
                <p className="text-xl" style={{ color: colors.textColor }}>
                  {product.shortDescription}
                </p>
              )}

              {/* Precio */}
              <div className="flex items-baseline gap-4">
                <span
                  className="text-5xl font-bold"
                  style={{ color: colors.secondaryColor }}
                >
                  {product.basePrice}€
                </span>
                <span className="text-gray-600">
                  Precio orientativo
                </span>
              </div>

              {/* Stock */}
              {product.trackStock && (
                <div className="flex items-center gap-2">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
                      Sin stock disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                      <Check size={18} />
                      {product.stock} unidades disponibles
                    </span>
                  )}
                </div>
              )}

              {/* Botón de compra */}
              <button
                onClick={() => setShowModal(true)}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.primaryColor,
                }}
              >
                <ShoppingBag size={24} />
                {isOutOfStock ? 'Producto agotado' : 'Comprar por WhatsApp'}
              </button>

              <p className="text-sm text-gray-600 text-center">
                💬 Te contactaremos por WhatsApp para confirmar tu pedido
              </p>

              {/* Descripción completa */}
              <div className="pt-6 border-t">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: colors.primaryColor }}
                >
                  Descripción
                </h2>
                <div
                  className="prose max-w-none"
                  style={{ color: colors.textColor }}
                  dangerouslySetInnerHTML={{
                    __html: product.description.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2
              className="text-3xl font-heading font-bold mb-8 text-center"
              style={{ color: colors.primaryColor }}
            >
              Productos Relacionados
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const mainImage = getMainImage(relatedProduct.images);

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/tienda/${relatedProduct.slug}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border"
                    style={{ borderColor: colors.creamColor }}
                  >
                    {/* Imagen */}
                    <div className="relative h-48 bg-gray-100">
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4">
                      <h3
                        className="font-bold mb-2 group-hover:underline line-clamp-2"
                        style={{ color: colors.primaryColor }}
                      >
                        {relatedProduct.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-xl font-bold"
                          style={{ color: colors.secondaryColor }}
                        >
                          {relatedProduct.basePrice}€
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.primaryColor }}
                        >
                          Ver →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Modal de Compra */}
      {showModal && (
        <WhatsAppPurchaseModal
          product={product}
          colors={colors}
          whatsappNumber={whatsappNumber}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}