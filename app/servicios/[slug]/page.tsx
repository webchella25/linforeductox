// app/servicios/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

interface ServiceImage {
  url: string;
  position: number;
  alt: string;
  publicId?: string;
}

async function getService(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { 
        slug,
        active: true,
      },
      include: {
        faqs: {
          orderBy: { order: 'asc' }
        },
        childServices: {  // ✅ NUEVO
          where: { active: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    return service;
  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    return null;
  }
}

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

  const ogImage = service.heroImage || 'https://linforeductox.com/og-image.jpg';

  return {
    title,
    description,
    keywords: `${service.name}, ${service.category}, estética, medicina ancestral, Errenteria, drenaje linfático, ${service.conditions?.join(', ')}`,
    openGraph: {
      title,
      description,
      url: `https://linforeductox.com/servicios/${slug}`,
      siteName: 'LINFOREDUCTOX',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
    },
    alternates: {
      canonical: `https://linforeductox.com/servicios/${slug}`,
    },
  };
}

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
  
  let faqs: FAQ[] = [];
  
  try {
    if (service.faqs) {
      const faqsData = JSON.parse(JSON.stringify(service.faqs));
      if (Array.isArray(faqsData)) {
        faqs = faqsData as FAQ[];
      }
    }
  } catch (error) {
    console.error('Error parsing FAQs:', error);
    faqs = [];
  }

  let contentImages: ServiceImage[] = [];
  try {
    if (service.images) {
      const imagesData = typeof service.images === 'string' 
        ? JSON.parse(service.images) 
        : service.images;
      
      if (Array.isArray(imagesData)) {
        contentImages = imagesData.sort((a, b) => a.position - b.position);
      }
    }
  } catch (error) {
    console.error('Error parsing images:', error);
    contentImages = [];
  }

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

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image: service.heroImage || config.image,
    provider: {
      '@type': 'LocalBusiness',
      name: 'LINFOREDUCTOX',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Errenteria',
        addressRegion: 'Gipuzkoa',
        addressCountry: 'ES',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Errenteria',
    },
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'EUR',
      },
    }),
  };

  const heroImageUrl = service.heroImage || config.image;

  return (
    <>
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

      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImageUrl}
            alt={service.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient}`} />
        </div>

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

      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
          <h2 className="font-heading text-4xl font-bold text-primary mb-12 text-center">
            ¿En qué consiste este tratamiento?
          </h2>
          
          {contentImages.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
              
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={contentImages[0].url}
                  alt={contentImages[0].alt || service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-4xl mx-auto text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          )}
        </div>
      </section>

      {/* ✅ Subtratamientos con IMÁGENES */}
      {service.childServices && service.childServices.length > 0 && (
        <section className="section-padding bg-gradient-to-br from-cream/30 to-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Opciones de {service.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Elige el tratamiento que mejor se adapte a tus necesidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.childServices.map((child: any) => {
                // Obtener la primera imagen o usar heroImage
                const childImage = child.heroImage || 
                  (Array.isArray(child.images) && child.images.length > 0 
                    ? child.images[0].url || child.images[0]
                    : null);

                return (
                  <Link
                    key={child.id}
                    href={`/servicios/${child.slug}`}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary transform hover:-translate-y-2"
                  >
                    {/* Imagen */}
                    {childImage && (
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={childImage}
                          alt={child.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Badge de precio sobre la imagen */}
                        {child.price && (
                          <div className="absolute top-4 right-4 bg-secondary text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                            {child.price}€
                          </div>
                        )}
                      </div>
                    )}

                    {/* Header con gradiente (si no hay imagen) */}
                    {!childImage && (
                      <div className="bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading text-2xl font-bold">
                            {child.name}
                          </h3>
                          {child.price && (
                            <div className="text-2xl font-bold text-secondary-light">
                              {child.price}€
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contenido */}
                    <div className="p-6">
                      {/* Título (solo si hay imagen) */}
                      {childImage && (
                        <h3 className="font-heading text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                          {child.name}
                        </h3>
                      )}

                      {/* Duración */}
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Clock size={18} className="text-primary" />
                        <span className="font-medium">{child.duration} minutos</span>
                      </div>

                      {/* Descripción */}
                      <div 
                        className="prose prose-sm max-w-none text-gray-600 mb-6 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: child.description }}
                      />

                      {/* Botón de acción */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors">
                          Ver detalles completos
                        </span>
                        <ArrowRight 
                          className="text-primary group-hover:translate-x-2 group-hover:text-secondary transition-all" 
                          size={20} 
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {service.benefits && service.benefits.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-6xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-12 text-center">
              Beneficios Principales
            </h2>
            
            {contentImages.length > 1 ? (
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl order-2 md:order-1">
                  <Image
                    src={contentImages[1].url}
                    alt={contentImages[1].alt || `${service.name} - Beneficios`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                </div>

                <div className="space-y-4 order-1 md:order-2">
                  {service.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <Check size={16} className="text-primary" />
                      </div>
                      <p className="text-gray-700 leading-relaxed text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
            )}
          </div>
        </section>
      )}

      {service.conditions && service.conditions.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-6xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-12 text-center">
              Indicado Para
            </h2>
            
            {contentImages.length > 2 ? (
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                  {service.conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-cream p-5 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 text-2xl">{config.icon}</div>
                      <p className="text-gray-700 leading-relaxed text-lg">{condition}</p>
                    </div>
                  ))}
                </div>

                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={contentImages[2].url}
                    alt={contentImages[2].alt || `${service.name} - Indicaciones`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
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
            )}
          </div>
        </section>
      )}

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

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
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

      <section className="section-padding bg-primary text-white">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para experimentar {service.name}?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Reserva tu cita ahora y descubre los beneficios de este tratamiento
          </p>
          <Link
            href={`/reservar?servicio=${service.slug}`}
            className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl"
          >
            <Calendar size={24} />
            Reservar Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

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