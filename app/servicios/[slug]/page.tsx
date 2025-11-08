// app/servicios/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Calendar, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import FAQAccordion from '@/components/FAQAccordion';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

interface FAQ {
  question: string;
  answer: string;
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
    `Descubre los beneficios del ${service.name}. Tratamiento de ${service.duration} minutos en Errenteria.`;

  return {
    title,
    description,
    keywords: `${service.name}, ${service.category}, estética, medicina ancestral, Errenteria, Gipuzkoa, drenaje linfático, ${service.conditions?.join(', ')}`,
    openGraph: {
      title,
      description,
      url: `https://linforeductox.com/servicios/${slug}`,
      siteName: 'LINFOREDUCTOX',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: 'https://linforeductox.com/og-image.jpg',
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
      images: ['https://linforeductox.com/og-image.jpg'],
    },
    alternates: {
      canonical: `https://linforeductox.com/servicios/${slug}`,
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
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000',
    icon: '💆‍♀️',
  },
  facial: {
    gradient: 'from-pink-600/90 via-pink-500/80 to-pink-700/90',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2000',
    icon: '✨',
  },
  acupuntura: {
    gradient: 'from-green-600/90 via-green-500/80 to-green-700/90',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2000',
    icon: '🌿',
  },
  otro: {
    gradient: 'from-purple-600/90 via-purple-500/80 to-purple-700/90',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000',
    icon: '🧘‍♀️',
  },
};

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const config = categoryConfig[service.category] || categoryConfig.otro;
  
  // ✅ FIX: Parsear FAQs desde JSON de forma segura
  let faqs: FAQ[] = [];
  
  try {
    if (service.faqs) {
      // Convertir JsonValue a string y luego parsear
      const faqsData = JSON.parse(JSON.stringify(service.faqs));
      if (Array.isArray(faqsData)) {
        faqs = faqsData as FAQ[];
      }
    }
  } catch (error) {
    console.error('Error parsing FAQs:', error);
    faqs = [];
  }

  // ✅ Schema.org JSON-LD para SEO
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      {/* ✅ Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${config.image}')` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`} />
        </div>

        {/* Contenido */}
        <div className="relative z-10 container-custom text-center text-white">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-white font-semibold capitalize">
              {service.category}
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            {service.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Clock size={24} />
              <span>{service.duration} minutos</span>
            </div>
            {service.price && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{service.price}€</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Descripción Principal */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
            ¿En qué consiste este tratamiento?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-xl">{service.description}</p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
              Beneficios Principales
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Check size={16} className="text-primary" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Indicado para */}
      {service.conditions && service.conditions.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
              Indicado Para
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-cream p-4 rounded-xl"
                >
                  <div className="flex-shrink-0 text-2xl">{config.icon}</div>
                  <p className="text-gray-700 leading-relaxed">{condition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ✅ SECCIÓN FAQs */}
      {faqs.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-cream to-white">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-primary mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-gray-700">
                Resolvemos tus dudas sobre {service.name}
              </p>
            </div>
            
            <FAQAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* Información adicional */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Duración */}
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Duración
              </h3>
              <p className="text-gray-700 text-lg font-semibold">
                {service.duration} minutos
              </p>
            </div>

            {/* Precio */}
            {service.price && (
              <div className="bg-white rounded-xl p-8 text-center shadow-md">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  💰
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Precio
                </h3>
                <p className="text-gray-700 text-lg font-semibold">
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