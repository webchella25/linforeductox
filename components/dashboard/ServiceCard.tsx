'use client';

import { Service } from '@prisma/client';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const ServiceCard = ({
  service,
  onEdit,
  onDelete,
  onToggleActive,
}: ServiceCardProps) => {
  const categoryColors = {
    corporal: 'bg-blue-100 text-blue-700',
    facial: 'bg-pink-100 text-pink-700',
    acupuntura: 'bg-purple-100 text-purple-700',
  };

  const categoryNames = {
    corporal: 'Corporal',
    facial: 'Facial',
    acupuntura: 'Acupuntura',
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
        service.active ? 'border-gray-200' : 'border-gray-300 opacity-60'
      }`}
    >
      {/* Imagen */}
      {service.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover rounded-t-xl"
          />
          {!service.active && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-xl">
              <span className="text-white font-semibold">INACTIVO</span>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
              {service.name}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                categoryColors[service.category as keyof typeof categoryColors]
              }`}
            >
              {categoryNames[service.category as keyof typeof categoryNames]}
            </span>
          </div>
        </div>

        {/* Descripción */}
        {service.shortDescription && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.shortDescription}
          </p>
        )}

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span>⏱️ {service.durationMinutes} min</span>
          {service.price && <span>💰 {service.price}€</span>}
        </div>

        {/* Beneficios */}
        {service.benefits && (service.benefits as string[]).length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              BENEFICIOS:
            </p>
            <div className="flex flex-wrap gap-2">
              {(service.benefits as string[]).slice(0, 3).map((benefit, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {benefit}
                </span>
              ))}
              {(service.benefits as string[]).length > 3 && (
                <span className="text-xs text-gray-500">
                  +{(service.benefits as string[]).length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleActive(service.id, !service.active)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors ${
              service.active
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {service.active ? (
              <>
                <EyeOff size={16} />
                Desactivar
              </>
            ) : (
              <>
                <Eye size={16} />
                Activar
              </>
            )}
          </button>
          <button
            onClick={() => onEdit(service)}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => {
              if (confirm('¿Estás segura de eliminar este servicio?')) {
                onDelete(service.id);
              }
            }}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;