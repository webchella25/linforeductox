// app/eventos/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ArrowRight, Euro } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { format, isPast, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Eventos y Talleres | LINFOREDUCTOX - Actividades de Bienestar',
  description: 'Descubre nuestros próximos talleres, charlas y eventos especiales sobre medicina ancestral, drenaje linfático y bienestar en Madrid.',
  keywords: 'eventos, talleres, charlas, retiros, medicina ancestral, drenaje linfático, bienestar, Madrid',
  alternates: {
    canonical: 'https://linforeductox.com/eventos',
  },
  openGraph: {
    title: 'Eventos y Talleres | LINFOREDUCTOX',
    description: 'Talleres, charlas y eventos especiales sobre bienestar y medicina ancestral en Madrid.',
    url: 'https://linforeductox.com/eventos',
    siteName: 'LINFOREDUCTOX',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://linforeductox.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Eventos LINFOREDUCTOX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventos y Talleres | LINFOREDUCTOX',
    description: 'Talleres, charlas y eventos sobre bienestar y medicina ancestral.',
    images: ['https://linforeductox.com/og-image.jpg'],
  },
};

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        active: true,
        status: {
          in: ['UPCOMING', 'ONGOING', 'FINISHED'],
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return events;
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return [];
  }
}

async function getEventsPageConfig() {
  try {
    const config = await prisma.eventsPageConfig.findFirst();
    return config || {
      heroImage: null,
      heroTitle: 'Eventos',
      heroSubtitle: 'Talleres, charlas y experiencias para tu bienestar',
    };
  } catch (error) {
    console.error('Error obteniendo config de página de eventos:', error);
    return {
      heroImage: null,
      heroTitle: 'Eventos',
      heroSubtitle: 'Talleres, charlas y experiencias para tu bienestar',
    };
  }
}

export default async function EventosPage() {
  const events = await getEvents();
  const eventsPageConfig = await getEventsPageConfig();
  const now = new Date();

  const upcomingEvents = events.filter((e) => {
    const endDate = e.endDate ? new Date(e.endDate) : new Date(e.startDate);
    return !isPast(endDate);
  });

  const pastEvents = events.filter((e) => {
    const endDate = e.endDate ? new Date(e.endDate) : new Date(e.startDate);
    return isPast(endDate);
  });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: eventsPageConfig.heroImage
              ? `url('${eventsPageConfig.heroImage}')`
              : "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070')",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            {eventsPageConfig.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            {eventsPageConfig.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Próximos Eventos */}
      {upcomingEvents.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-primary mb-4">
                Próximos Eventos
              </h2>
              <p className="text-lg text-gray-700">
                No te pierdas nuestras próximas actividades
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

              <div className="space-y-12">
                {upcomingEvents.map((event, index) => {
                  const startDate = new Date(event.startDate);
                  const daysUntil = differenceInDays(startDate, now);

                  return (
                    <div key={event.id} className="relative">
                      {/* Punto en timeline */}
                      <div className="absolute left-8 top-8 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg hidden md:block transform -translate-x-1/2" />

                      {/* Contenido */}
                      <div className="md:ml-20">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                          <div className="grid md:grid-cols-5 gap-6">
                            {/* Imagen */}
                            {event.heroImage && (
                              <div className="md:col-span-2 relative h-64 md:h-auto">
                                <Image
                                  src={event.heroImage}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 40vw"
                                  unoptimized
                                />
                                {daysUntil <= 7 && daysUntil > 0 && (
                                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    ¡Próximamente!
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Info */}
                            <div className={`p-6 md:p-8 ${event.heroImage ? 'md:col-span-3' : 'md:col-span-5'}`}>
                              {/* Fecha destacada */}
                              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg mb-4">
                                <p className="text-sm font-semibold">
                                  {format(startDate, "EEEE, d 'de' MMMM", { locale: es })}
                                </p>
                                <p className="text-lg font-bold">
                                  {format(startDate, 'HH:mm')}h
                                </p>
                              </div>

                              {/* Título */}
                              <h3 className="font-heading text-3xl font-bold text-gray-900 mb-3">
                                {event.title}
                              </h3>

                              {/* Descripción corta */}
                              <p className="text-gray-600 mb-4 line-clamp-2">
                                {event.shortDescription}
                              </p>

                              {/* Meta info */}
                              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-primary" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-primary" />
                                  <span>{event.eventType}</span>
                                </div>
                                {!event.isFree && event.price && (
                                  <div className="flex items-center gap-2">
                                    <Euro size={16} className="text-primary" />
                                    <span className="font-semibold">{event.price}€</span>
                                  </div>
                                )}
                                {event.isFree && (
                                  <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    GRATUITO
                                  </div>
                                )}
                              </div>

                              {/* Contador */}
                              {daysUntil >= 0 && (
                                <div className="bg-cream p-4 rounded-lg mb-6">
                                  <p className="text-sm text-gray-600 mb-1">Faltan</p>
                                  <p className="text-2xl font-bold text-primary">
                                    {daysUntil === 0 ? '¡Hoy!' : daysUntil === 1 ? 'Mañana' : `${daysUntil} días`}
                                  </p>
                                </div>
                              )}

                              {/* Plazas */}
                              {event.availablePlaces !== null && event.maxPlaces && (
                                <div className="mb-6">
                                  {event.availablePlaces > 0 ? (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-semibold text-primary">{event.availablePlaces}</span> plazas disponibles de {event.maxPlaces}
                                    </p>
                                  ) : (
                                    <p className="text-sm font-semibold text-red-600">
                                      ¡Plazas agotadas!
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Botón */}
                              <Link
                                href={`/eventos/${event.slug}`}
                                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition-all group"
                              >
                                Ver detalles
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Eventos Pasados */}
      {pastEvents.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-primary mb-4">
                Eventos Realizados
              </h2>
              <p className="text-lg text-gray-700">
                Mira lo que hemos compartido
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/eventos/${event.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  {/* Imagen */}
                  {event.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.heroImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {format(new Date(event.startDate), "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sin eventos */}
      {upcomingEvents.length === 0 && pastEvents.length === 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-3xl text-center">
            <Calendar className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Próximamente nuevos eventos
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Estamos preparando experiencias únicas para ti. Síguenos en redes sociales para estar al tanto de las novedades.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-dark transition-all"
            >
              Contáctanos
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}