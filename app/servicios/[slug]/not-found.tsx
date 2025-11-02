// app/servicios/[slug]/not-found.tsx

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-white px-6">
      <div className="text-center max-w-2xl">
        <h1 className="font-heading text-6xl md:text-8xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Servicio no encontrado
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Lo sentimos, el servicio que buscas no existe o ha sido desactivado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary-dark transition-all"
          >
            Ver todos los servicios
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-full font-medium hover:bg-cream transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}