// app/testimonios/page.tsx
'use client';

import { Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  service: string | null;
  status: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Metadatos para SEO (en layout o mediante Head)
export const metadata = {
  title: "Testimonios - LINFOREDUCTOX | Opiniones de Nuestros Clientes",
  description: "Lee las experiencias reales de nuestros clientes con los tratamientos de drenaje linfático, medicina ancestral y acupuntura en Errenteria.",
  keywords: "testimonios, opiniones, reseñas, clientes satisfechos, Errenteria",
};

// Componente del carrusel destacado
function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });

  useEffect(() => {
    if (!emblaApi) return;

    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [emblaApi]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="overflow-hidden rounded-3xl shadow-2xl" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial) => (
            <div
              key={`carousel-${testimonial.id}`}
              className="flex-[0_0_100%] min-w-0 px-6 py-12 md:px-12 bg-gradient-to-br from-primary/90 to-secondary/90 text-white"
            >
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-yellow-300 text-yellow-300 drop-shadow"
                    />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed mb-8">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="font-semibold text-lg">{testimonial.name}</p>
                  {testimonial.service && (
                    <p className="text-yellow-100 mt-1">{testimonial.service}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicadores de navegación */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="w-3 h-3 rounded-full bg-primary/30 hover:bg-primary transition-colors"
            aria-label={`Ir al testimonio ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch('/api/testimonials?status=APPROVED');
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            setTestimonials(data);
          } else if (data.testimonials && Array.isArray(data.testimonials)) {
            setTestimonials(data.testimonials);
          } else {
            console.error('Data is not an array:', data);
            setTestimonials([]);
          }
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // ✅ Schema.org Review Aggregate (solo cuando haya testimonials)
  const reviewSchema = testimonials.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "LINFOREDUCTOX",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials.slice(0, 10).map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
      },
      reviewBody: t.text,
      ...(t.service && { itemReviewed: { "@type": "Service", name: t.service } }),
    })),
  } : null;

  // ✅ Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://linforeductox.com" },
      { "@type": "ListItem", position: 2, name: "Testimonios", item: "https://linforeductox.com/testimonios" },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando testimonios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Schema.org Scripts */}
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      
      <div className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative py-20 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h1>
              <p className="text-2xl opacity-90 mb-6">Experiencias Reales de Personas Reales</p>
              <p className="text-lg opacity-80 max-w-3xl mx-auto">
                La satisfacción de nuestros clientes es nuestra mayor recompensa.
              </p>
            </div>
          </div>
        </section>

        {/* Carrusel WOW */}
        <TestimonialCarousel testimonials={testimonials} />

        {/* Testimonials Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!testimonials || testimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  Aún no hay testimonios disponibles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-6 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        {testimonial.service && (
                          <p className="text-sm text-gray-600">
                            {testimonial.service}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              ¿Quieres Vivir Tu Propia Experiencia?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a nuestros clientes satisfechos y comienza tu camino hacia el
              bienestar.
            </p>
            <Link
              href="/reservar"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Reservar Ahora
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}