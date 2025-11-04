// app/servicios/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Calendar, Clock, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
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

// ✅ SEO dinámico para cada servicio
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: 'Servicio no encontrado | LINFOREDUCTOX',
      description: 'Este servicio no está disponible actualmente.',
    };
  }

  const title = `${service.name} | LINFOREDUCTOX - Estética y Medicina Ancestral`;
  const description = service.description?.slice(0, 160) || 
    `Descubre los beneficios del ${service.name}. Tratamiento de ${service.duration} minutos en Madrid.`;

  return {
    title,
    description,
    keywords: `${service.name}, ${service.category}, estética, medicina ancestral, Madrid, drenaje linfático, ${service.conditions?.join(', ')}`,
    openGraph: {
      title,
      description,
      url: `https://linforeductox.vercel.app/servicios/${slug}`,
      siteName: 'LINFOREDUCTOX',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: 'https://linforeductox.vercel.app/og-image.jpg', // ✅ Cambiar por tu imagen real
          width: 1200,
          height: 630,
          alt: `${service.name} - LINFOREDUCTOX`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://linforeductox.vercel.app/og-image.jpg'],
    },
    alternates: {
      canonical: `https://linforeductox.vercel.app/servicios/${slug}`,
    },
  };
}

// Mapeo de categorías a colores e imágenes
const categoryConfig: Record<string, {
  gradient: string;
  image: string;
  icon: string;
}> = {
  corporal: {
    gradient: 'from-blue-600/90 via-blue-500/80 to-blue-700/90',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070',
    icon: '💆‍♀️'
  },
  facial: {
    gradient: 'from-pink-600/90 via-pink-500/80 to-pink-700/90',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070',
    icon: '✨'
  },
  acupuntura: {
    gradient: 'from-purple-600/90 via-purple-500/80 to-purple-700/90',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070',
    icon: '🌿'
  },
  default: {
    gradient: 'from-primary/90 via-primary/70 to-primary-dark/90',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070',
    icon: '💫'
  }
};

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const config = categoryConfig[service.category || 'default'] || categoryConfig.default;

  return (
    <>
      {/* Hero Dinámico */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${config.image}')`,
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <div className="text-7xl mb-6 animate-bounce">{config.icon}</div>
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
              ¿Qué es {service.name}?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* CTA Reservar */}
          <div className="text-center mb-16">
            <Link
              href={`/contacto?servicio=${service.slug}`}
              className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar size={24} />
              Reservar {service.name}
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios - Solo si existen */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                Beneficios de {service.name}
              </h2>
              <p className="text-xl text-gray-700">
                Todo lo que obtendrás con este tratamiento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600" size={20} />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Condiciones que trata - Solo si existen */}
      {service.conditions && service.conditions.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                ¿Para qué es efectivo {service.name}?
              </h2>
              <p className="text-xl text-gray-700">
                Este tratamiento es especialmente recomendado para
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 text-center hover:border-primary/40 hover:bg-primary/10 transition-all"
                >
                  <p className="text-gray-800 font-medium">{condition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Información Adicional */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Duración */}
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary" size={32} />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Duración
              </h3>
              <p className="text-gray-700 text-2xl font-semibold">
                {service.duration} minutos
              </p>
            </div>

            {/* Precio */}
            {service.price && (
              <div className="bg-white rounded-xl p-8 text-center shadow-md">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-secondary" size={32} />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Precio
                </h3>
                <p className="text-gray-700 text-2xl font-semibold">
                  {service.price}€
                </p>
              </div>
            )}

            {/* Categoría */}
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                {config.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Tipo
              </h3>
              <p className="text-gray-700 text-lg font-medium capitalize">
                {service.category || 'Tratamiento'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para experimentar {service.name}?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Reserva tu cita ahora y descubre los beneficios de este tratamiento
          </p>
          <Link
            href={`/contacto?servicio=${service.slug}`}
            className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl"
          >
            <Calendar size={24} />
            Contactar Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Servicios Relacionados */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-primary mb-4">
              Otros Servicios
            </h2>
            <p className="text-lg text-gray-700">
              Descubre más tratamientos que pueden interesarte
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-lg transition-colors"
            >
              Ver todos los servicios
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}