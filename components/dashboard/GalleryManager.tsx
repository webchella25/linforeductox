// components/dashboard/GalleryManager.tsx
'use client';

import { useState } from 'react';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import ImageUploader from './ImageUploader';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface GalleryImage {
  url: string;
  position: number;
  alt: string;
  publicId?: string;
}

interface GalleryManagerProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  maxImages?: number;
}

export default function GalleryManager({
  images = [],
  onChange,
  maxImages = 3,
}: GalleryManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Agregar nueva imagen
  const handleAddImage = () => {
    if (images.length >= maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const newImage: GalleryImage = {
      url: '',
      position: images.length + 1,
      alt: '',
    };

    setEditingIndex(images.length);
    onChange([...images, newImage]);
  };

  // Actualizar URL de imagen
  const handleImageUpload = (index: number, url: string) => {
    const updatedImages = [...images];
    updatedImages[index].url = url;
    onChange(updatedImages);
  };

  // Actualizar texto alternativo
  const handleAltChange = (index: number, alt: string) => {
    const updatedImages = [...images];
    updatedImages[index].alt = alt;
    onChange(updatedImages);
  };

  // Eliminar imagen
  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Reordenar posiciones
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      position: i + 1,
    }));
    onChange(reorderedImages);
    toast.success('Imagen eliminada');
  };

  // Mover imagen arriba
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const updatedImages = [...images];
    [updatedImages[index - 1], updatedImages[index]] = [
      updatedImages[index],
      updatedImages[index - 1],
    ];

    // Actualizar posiciones
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      position: i + 1,
    }));

    onChange(reorderedImages);
  };

  // Mover imagen abajo
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;

    const updatedImages = [...images];
    [updatedImages[index], updatedImages[index + 1]] = [
      updatedImages[index + 1],
      updatedImages[index],
    ];

    // Actualizar posiciones
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      position: i + 1,
    }));

    onChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Imágenes de Contenido (máximo {maxImages})
        </label>
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleAddImage}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            Agregar Imagen
          </button>
        )}
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-3">
            No hay imágenes de contenido. Estas imágenes se mostrarán intercaladas con el texto en la página del servicio.
          </p>
          <button
            type="button"
            onClick={handleAddImage}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            Agregar Primera Imagen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-4 space-y-3 bg-white hover:border-primary transition-colors"
            >
              {/* Header con posición y controles */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Imagen {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  {/* Botones de orden */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <MoveUp size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === images.length - 1}
                    className="p-1 text-gray-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <MoveDown size={18} />
                  </button>
                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Vista previa o uploader */}
              {image.url ? (
                <div className="relative group">
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={image.url}
                      alt={image.alt || `Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageUpload(index, '')}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Cambiar imagen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <ImageUploader
                  value={image.url}
                  onChange={(url) => handleImageUpload(index, url)}
                  label=""
                  aspectRatio="4/3"
                  maxSizeMB={3}
                />
              )}

              {/* Input de texto alternativo */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Descripción (para SEO)
                </label>
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  placeholder="Ej: Tratamiento de drenaje linfático"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Badge de posición */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                  Posición: {image.position}
                </span>
                {index === 0 && (
                  <span className="text-xs text-gray-500">
                    (Aparecerá primero)
                  </span>
                )}
                {index === images.length - 1 && images.length > 1 && (
                  <span className="text-xs text-gray-500">
                    (Aparecerá al final)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info adicional */}
      {images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Las imágenes se mostrarán intercaladas con el contenido de texto en la página del servicio. 
            La posición determina el orden de aparición (1 = primero, 2 = segundo, 3 = tercero).
          </p>
        </div>
      )}
    </div>
  );
}