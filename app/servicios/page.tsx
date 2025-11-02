// app/servicios/page.tsx

import Link from 'next/link';
import { Sparkles, Heart, Zap, ArrowRight, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Mapa de iconos por categoría
const iconMap = {
  corporal: Sparkles,
  facial: Heart,
  acupuntura: Zap,
  default: Sparkles,
};

// Mapa de imágenes por categoría
const imageMap: Record<string, string> = {
  corporal: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070',
  facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070',
  acupuntura: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070',
  default: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070',
};

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return services;
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return [];
  }
}

export default async function ServiciosPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary-dark/90" />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Experiencias personalizadas para tu bienestar
          </p>
        </div>
      </section>

      {/* Servicios Detallados */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                No hay servicios disponibles en este momento
              </p>
            </div>
          ) : (
            <div className="space-y-24">
              {services.map((servicio, index) => {
                const Icon = iconMap[servicio.category as keyof typeof iconMap] || iconMap.default;
                const image = imageMap[servicio.category] || imageMap.default;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={servicio.id}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                      isEven ? '' : 'lg:grid-flow-dense'
                    }`}
                  >
                    {/* Imagen */}
                    <div
                      className={`relative h-96 rounded-2xl overflow-hidden shadow-xl ${
                        isEven ? '' : 'lg:col-start-2'
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url('${image}')` }}
                      />
                    </div>

                    {/* Contenido */}
                    <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Icon size={32} className="text-primary" />
                      </div>

                      <h2 className="font-heading text-4xl font-bold text-primary mb-4">
                        {servicio.name}
                      </h2>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={20} />
                          <span>{servicio.duration} min</span>
                        </div>
                        {servicio.price && (
                          <div className="text-secondary font-bold text-xl">
                            {servicio.price}€
                          </div>
                        )}
                      </div>

                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {servicio.description.length > 200
                          ? servicio.description.substring(0, 200) + '...'
                          : servicio.description}
                      </p>

                      {servicio.benefits && servicio.benefits.length > 0 && (
                        <>
                          <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
                            Beneficios:
                          </h3>
                          <ul className="space-y-3 mb-8">
                            {servicio.benefits.slice(0, 5).map((benefit, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-gray-700"
                              >
                                <span className="text-secondary mt-1">✦</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      <Link
                        href={`/servicios/${servicio.slug}`}
                        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
                      >
                        Ver Detalles
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para tu transformación?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Cada masaje es una fusión que combina Ciencia, Arte y Energía
          </p>
          <Link
            href="/reservar"
            className="inline-flex items-center gap-2 bg-secondary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl"
          >
            Reservar Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}