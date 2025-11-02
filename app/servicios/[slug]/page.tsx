// app/servicios/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Calendar, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

async function getService(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { 
        slug,
        active: true,
      },
    });

    return service;
  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    return null;
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary-dark/90" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <div className="bg-secondary/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Calendar size={40} className="text-secondary" />
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            {service.name}
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/90 text-lg">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{service.duration} min</span>
            </div>
            {service.price && (
              <div className="text-secondary font-bold text-2xl">
                {service.price}€
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Descripción Principal */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              {service.name}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* CTA Reservar */}
          <div className="text-center mb-16">
            <Link
              href={`/reservar?servicio=${service.slug}`}
              className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar size={24} />
              Reservar {service.name}
              <ArrowRight size={24} />
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Recibirás confirmación en 24 horas
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-6xl">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
              Beneficios
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {service.benefits.map((beneficio, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm"
                >
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <Check size={24} className="text-primary" />
                  </div>
                  <p className="text-gray-700 font-medium">{beneficio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Condiciones que trata */}
      {service.conditions && service.conditions.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-6xl">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
              ¿Qué condiciones trata?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.conditions.map((condicion, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-cream p-4 rounded-lg"
                >
                  <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
                  <span className="text-gray-700">{condicion}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Información adicional */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Detalles del Tratamiento
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <h3 className="font-heading text-2xl font-semibold mb-4 flex items-center gap-3">
                <Clock size={28} className="text-secondary" />
                Duración
              </h3>
              <p className="text-3xl font-bold text-secondary mb-2">
                {service.duration} minutos
              </p>
              <p className="text-white/80">
                Tiempo dedicado exclusivamente a tu bienestar
              </p>
            </div>

            {service.price && (
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <h3 className="font-heading text-2xl font-semibold mb-4">
                  Inversión
                </h3>
                <p className="text-3xl font-bold text-secondary mb-2">
                  {service.price}€
                </p>
                <p className="text-white/80">
                  Por sesión individual
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h3 className="font-heading text-2xl font-semibold mb-4">
              ¿Qué incluye?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="text-secondary flex-shrink-0 mt-1" size={20} />
                <span>Consulta personalizada inicial</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-secondary flex-shrink-0 mt-1" size={20} />
                <span>Tratamiento completo de {service.duration} minutos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-secondary flex-shrink-0 mt-1" size={20} />
                <span>Productos naturales y ecológicos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-secondary flex-shrink-0 mt-1" size={20} />
                <span>Ambiente relajante con aromaterapia y música</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-secondary flex-shrink-0 mt-1" size={20} />
                <span>Recomendaciones personalizadas post-tratamiento</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center max-w-3xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            ¿Lista para transformarte?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Reserva tu sesión de {service.name} y comienza tu viaje hacia el bienestar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/reservar?servicio=${service.slug}`}
              className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
            >
              <Calendar size={24} />
              Reservar Ahora
              <ArrowRight size={24} />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-10 py-5 rounded-full font-medium text-lg hover:bg-cream transition-all"
            >
              Consultar Dudas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: ServicePageProps) {
  const service = await getService(params.slug);

  if (!service) {
    return {
      title: 'Servicio no encontrado - LINFOREDUCTOX',
    };
  }

  return {
    title: `${service.name} - LINFOREDUCTOX`,
    description: service.description.substring(0, 160),
  };
}