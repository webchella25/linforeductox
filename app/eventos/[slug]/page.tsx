// app/eventos/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Euro, 
  Check, 
  MessageCircle,
  ArrowLeft,
  Users,
  Share2,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        slug,
        active: true,
      },
    });
    return event;
  } catch (error) {
    console.error('Error obteniendo evento:', error);
    return null;
  }
}

// ✅ SEO DINÁMICO
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: 'Evento no encontrado | LINFOREDUCTOX',
      description: 'Este evento no está disponible.',
    };
  }

  const title = `${event.title} | Eventos LINFOREDUCTOX`;
  const description = event.shortDescription || event.description?.slice(0, 160) || 
    `Participa en ${event.title}. ${event.eventType} en ${event.location}.`;

  const ogImage = event.heroImage || 'https://linforeductox.com/og-image.jpg';

  return {
    title,
    description,
    keywords: `${event.title}, ${event.eventType}, eventos, talleres, ${event.location}, medicina ancestral, bienestar`,
    authors: [{ name: 'LINFOREDUCTOX' }],
    openGraph: {
      title,
      description,
      url: `https://linforeductox.com/eventos/${slug}`,
      siteName: 'LINFOREDUCTOX',
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: event.title,
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
      canonical: `https://linforeductox.com/eventos/${slug}`,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const now = new Date();
  const daysUntil = differenceInDays(startDate, now);

  // Parsear imágenes
  let galleryImages: any[] = [];
  try {
    if (event.images) {
      const imagesData = typeof event.images === 'string' 
        ? JSON.parse(event.images) 
        : event.images;
      if (Array.isArray(imagesData)) {
        galleryImages = imagesData.sort((a, b) => a.position - b.position);
      }
    }
  } catch (error) {
    console.error('Error parsing images:', error);
  }

  // WhatsApp link
  const whatsappLink = event.whatsappNumber 
    ? `https://wa.me/${event.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        event.whatsappMessage || `Hola, me gustaría inscribirme al evento: ${event.title}`
      )}`
    : null;

  // ✅ Schema.org JSON-LD para Evento
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.shortDescription || event.description,
    startDate: event.startDate,
    ...(endDate && { endDate: event.endDate }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.location === 'Online' 
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.location === 'Online' 
      ? {
          '@type': 'VirtualLocation',
          url: 'https://linforeductox.com',
        }
      : {
          '@type': 'Place',
          name: event.location === 'Centro' ? 'LINFOREDUCTOX' : event.locationDetails,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Oliva',
            addressRegion: 'Valencia',
            addressCountry: 'ES',
          },
        },
    image: event.heroImage || 'https://linforeductox.com/og-image.jpg',
    organizer: {
      '@type': 'Organization',
      name: 'LINFOREDUCTOX',
      url: 'https://linforeductox.com',
    },
    ...(event.price && !event.isFree && {
      offers: {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'EUR',
        availability: event.availablePlaces && event.availablePlaces > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
        url: `https://linforeductox.com/eventos/${slug}`,
      },
    }),
    ...(event.isFree && {
      isAccessibleForFree: true,
    }),
  };

  return (
    <>
      {/* ✅ Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {event.heroImage && (
          <div className="absolute inset-0">
            <Image
              src={event.heroImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
        )}

        <div className="relative z-10 container-custom text-center text-white px-6 max-w-4xl">
          {/* Tipo de evento */}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <span className="text-white font-semibold">{event.eventType}</span>
          </div>

          {/* Título */}
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            {event.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-lg mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <span>{format(startDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={24} />
              <span>{format(startDate, 'HH:mm')}h</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={24} />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Precio */}
          {event.isFree ? (
            <div className="inline-block bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold">
              EVENTO GRATUITO
            </div>
          ) : event.price && (
            <div className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full text-2xl font-bold">
              <Euro size={28} />
              {event.price}€
            </div>
          )}
        </div>
      </section>

      {/* Contador y CTA */}
      {daysUntil >= 0 && (
        <section className="bg-primary text-white py-8">
          <div className="container-custom max-w-4xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Contador */}
              <div className="text-center md:text-left">
                <p className="text-white/80 mb-1">El evento comienza en:</p>
                <p className="text-4xl font-bold">
                  {daysUntil === 0 ? '¡HOY!' : daysUntil === 1 ? 'MAÑANA' : `${daysUntil} DÍAS`}
                </p>
              </div>

              {/* Plazas */}
              {event.maxPlaces && event.availablePlaces !== null && (
                <div className="text-center">
                  <p className="text-white/80 mb-1">Plazas disponibles:</p>
                  <p className="text-3xl font-bold">
                    {event.availablePlaces} / {event.maxPlaces}
                  </p>
                </div>
              )}

              {/* Botón WhatsApp */}
              {whatsappLink && event.availablePlaces !== 0 && (
                
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <MessageCircle size={24} />
                  Inscribirme por WhatsApp
                </a>
              )}

              {event.availablePlaces === 0 && (
                <div className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg">
                  ¡Plazas Agotadas!
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Descripción */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl font-bold text-primary mb-8">
            Acerca del Evento
          </h2>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>
      </section>

      {/* ¿Qué incluye? */}
      {event.includes && event.includes.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
              ¿Qué Incluye?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {event.includes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Check size={16} className="text-primary" />
                  </div>
                  <p className="text-gray-700 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ¿Qué llevar? */}
      {event.whatToBring && event.whatToBring.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
              ¿Qué Debes Llevar?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {event.whatToBring.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-cream p-5 rounded-xl"
                >
                  <div className="flex-shrink-0 text-2xl">📦</div>
                  <p className="text-gray-700 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Requisitos */}
      {event.requirements && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
              Requisitos
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <p className="text-gray-700 text-lg leading-relaxed">
                {event.requirements}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Galería */}
      {galleryImages.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-6xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
              Galería
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-64 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video */}
      {event.videoUrl && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8 text-center">
              Video
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={event.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      {daysUntil >= 0 && whatsappLink && event.availablePlaces !== 0 && (
        <section className="section-padding bg-primary text-white">
          <div className="container-custom max-w-4xl text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              ¿Te Apuntas?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              No te pierdas esta oportunidad única de participar en {event.title}
            </p>
            
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={28} />
              Inscribirme por WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Volver */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl text-center">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Ver todos los eventos
          </Link>
        </div>
      </section>
    </>
  );
}