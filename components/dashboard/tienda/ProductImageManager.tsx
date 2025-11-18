// components/dashboard/tienda/ProductImageManager.tsx
'use client';

import { useState } from 'react';
import { Plus, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ProductImage {
  url: string;
  alt?: string;
  publicId?: string;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export default function ProductImageManager({
  images = [],
  onChange,
  maxImages = 5,
}: ProductImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUpload = async (file: File, index?: number) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, sube solo imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe pesar menos de 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      
      const newImage: ProductImage = {
        url: data.url,
        publicId: data.publicId,
        alt: '',
      };

      if (index !== undefined) {
        // Reemplazar imagen existente
        const updatedImages = [...images];
        updatedImages[index] = newImage;
        onChange(updatedImages);
      } else {
        // Agregar nueva imagen
        onChange([...images, newImage]);
      }

      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file, index);
    }
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
    toast.success('Imagen eliminada');
  };

  const handleAltChange = (index: number, alt: string) => {
    const updatedImages = [...images];
    updatedImages[index].alt = alt;
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Imágenes del Producto (máximo {maxImages})
        </label>
        {images.length < maxImages && (
          <label className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
            <Plus size={18} />
            Agregar Imagen
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e)}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No hay imágenes</p>
          <p className="text-sm text-gray-500">
            Haz clic en "Agregar Imagen" para subir fotos del producto
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2 p-4 border border-gray-200 rounded-lg">
              {/* Imagen */}
              <div className="relative group">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image.url}
                    alt={image.alt || `Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Input de texto alternativo */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Descripción (para SEO)
                </label>
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  placeholder="Ej: Kit de masaje relajante"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Badge de posición */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                  Imagen {index + 1}
                </span>
                {index === 0 && (
                  <span className="text-xs text-gray-500">(Principal)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
          <Loader2 className="w-5 h-5 text-primary animate-spin mr-2" />
          <span className="text-sm text-gray-700">Subiendo imagen...</span>
        </div>
      )}

      {/* Info adicional */}
      {images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> La primera imagen se mostrará como imagen principal del producto.
            Las descripciones ayudan al SEO y accesibilidad.
          </p>
        </div>
      )}
    </div>
  );
}