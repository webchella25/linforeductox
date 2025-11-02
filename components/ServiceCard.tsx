// components/ServiceCard.tsx
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration?: number | null;
  price?: number | null;
  category?: string | null;
  active: boolean;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Generar href basado en el slug, con fallback a categoría o id
  const href = service.slug 
    ? `/servicios/${service.slug}` 
    : service.category 
    ? `/servicios/${service.category}` 
    : `/servicios/${service.id}`;

  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-secondary group cursor-pointer">
        {/* Icon */}
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
          <Sparkles size={32} className="text-primary group-hover:text-secondary transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-secondary transition-colors">
            {service.name}
          </h3>
          
          <p className="text-gray-600 mb-6 line-clamp-3">
            {service.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {service.duration && (
            <span className="text-sm text-gray-500">
              ⏱️ {service.duration} min
            </span>
          )}
          
          {service.price && (
            <span className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors">
              {service.price}€
            </span>
          )}
          
          {!service.duration && !service.price && (
            <span className="text-sm text-secondary font-medium">
              Ver más →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}