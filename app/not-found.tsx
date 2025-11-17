// app/not-found.tsx
import Link from 'next/link';
import { Home, Search, ArrowLeft, Sparkles, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página No Encontrada | LINFOREDUCTOX',
  description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-cream flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center">
        {/* Número 404 */}
        <div className="mb-8">
          <h1 className="font-heading text-[150px] md:text-[200px] font-bold text-primary/20 leading-none select-none">
            404
          </h1>
        </div>

        {/* Mensaje */}
        <div className="mb-8">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            Página No Encontrada
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <p className="text-gray-500">
            Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            <Home size={24} />
            Volver al Inicio
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg font-semibold text-lg"
          >
            <Sparkles size={24} />
            Ver Servicios
          </Link>
        </div>

        {/* Enlaces útiles */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="font-heading text-2xl font-bold text-gray-900 mb-6">
            ¿Qué estás buscando?
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <Link
              href="/servicios"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Nuestros Servicios</p>
                <p className="text-sm text-gray-600">Descubre todos nuestros tratamientos</p>
              </div>
            </Link>

            <Link
              href="/eventos"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Calendar size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Eventos</p>
                <p className="text-sm text-gray-600">Talleres y charlas próximas</p>
              </div>
            </Link>

            <Link
              href="/aline-vidal"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Search size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sobre Aline Vidal</p>
                <p className="text-sm text-gray-600">Conoce a nuestra fundadora</p>
              </div>
            </Link>

            <Link
              href="/contacto"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Home size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Contacto</p>
                <p className="text-sm text-gray-600">Reserva tu cita ahora</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Mensaje adicional */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Si crees que esto es un error, por favor</p>
          <Link href="/contacto" className="text-primary hover:underline font-semibold">
            contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}