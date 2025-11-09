// app/page.tsx
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

// ✅ METADATA PARA SEO
export const metadata: Metadata = {
  title: "LINFOREDUCTOX - Estética Avanzada y Medicina Ancestral Oriental",
  description: "Centro especializado en drenaje linfático, tratamientos corporales, faciales y acupuntura. Descubre el método LINFOREDUCTOX en Errenteria, Gipuzkoa.",
  keywords: "drenaje linfático, masaje linfático, tratamiento facial, acupuntura estética, medicina oriental, estética natural, Errenteria, Gipuzkoa",
  alternates: {
    canonical: "https://linforeductox.com",
  },
};

async function getHomeContent() {
  try {
    const heroQuote = await prisma.content.findUnique({ 
      where: { section: 'hero_quote' } 
    });
    return { heroQuote };
  } catch (error) {
    console.error('Error fetching home content:', error);
    return { heroQuote: null };
  }
}

async function getFeaturedServices() {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      take: 3,
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching featured services:', error);
    return [];
  }
}

// ✅ NUEVA FUNCIÓN: 3 Testimonios Aleatorios
async function getRandomTestimonials() {
  try {
    const allTestimonials = await prisma.testimonial.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        name: true,
        text: true,
        rating: true,
        service: true,
      },
    });

    // Mezclar array y tomar 3 aleatorios
    const shuffled = allTestimonials.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export default async function Home() {
  const { heroQuote } = await getHomeContent();
  const featuredServices = await getFeaturedServices();
  const testimonials = await getRandomTestimonials(); // ✅ NUEVO

  // ✅ Schema.org WebSite
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LINFOREDUCTOX",
    url: "https://linforeductox.com",
    description: "Centro de estética avanzada y medicina ancestral oriental en Errenteria",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://linforeductox.com/servicios?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // ✅ Schema.org BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://linforeductox.com",
      },
    ],
  };

  return (
    <>
      {/* ✅ Schema.org Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Frase Inspiradora */}
        <section className="section-padding bg-cream">
          <div className="container-custom text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              {heroQuote?.title || '"Cuando el Sistema Linfático fluye con libertad,'}
              <span className="block text-secondary mt-2">
                {heroQuote?.subtitle || 'Tu Belleza y Salud Florecen"'}
              </span>
            </h2>
            <div className="font-heading text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-secondary mt-2">LINFOREDUCTOX</span>
            </div>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {heroQuote?.content || 'Una gama de experiencias personalizadas, propuesta única en Estética Avanzada, inspirada en la sabiduría de Tradiciones Ancestrales Orientales.'}
            </p>
          </div>
        </section>

        {/* 3. Servicios */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                Nuestros Servicios
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                title="Tratamientos Corporales"
                description="Masajes especializados que combinan técnicas ancestrales para eliminar celulitis, grasa localizada y flacidez. Activa tu circulación y recupera la vitalidad de tu cuerpo."
                icon="💆‍♀️"
                link="/servicios/corporal"
              />
              <ServiceCard
                title="Tratamientos Faciales"
                description="Cuidado facial personalizado que fusiona acupuntura estética con técnicas naturales para rejuvenecer tu piel desde el interior."
                icon="✨"
                link="/servicios/facial"
              />
              <ServiceCard
                title="Acupuntura"
                description="Medicina ancestral china para equilibrar tu energía vital, aliviar dolores y mejorar tu bienestar general de forma natural."
                icon="🌿"
                link="/servicios/acupuntura"
              />
            </div>

            <div className="text-center mt-12">
              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
              >
                Ver Todos los Servicios
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Sobre Aline Vidal */}
        <section className="section-padding bg-gradient-to-br from-cream to-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Imagen */}
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070"
                  alt="Aline Vidal - Fundadora de LINFOREDUCTOX"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Contenido */}
              <div>
                <p className="text-secondary font-semibold mb-2">Creadora del Método</p>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                  Aline Vidal
                </h2>
                <p className="text-xl text-gray-700 mb-6 font-medium">
                  Coach Corporal y Facialista. Diplomada en Acupuntura Estética, Osteopatía y Sistema Linfático.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Mi pasión es ayudar a las mujeres a reconectar con su cuerpo, liberar bloqueos energéticos y descubrir su belleza más auténtica a través del poder sanador del toque consciente.
                </p>
                <blockquote className="border-l-4 border-secondary pl-6 italic text-lg text-gray-700 mb-8">
                  "Cuando el sistema linfático fluye con libertad, la belleza y la salud emergen naturalmente. Ese es el corazón del método LINFOREDUCTOX."
                </blockquote>
                <Link
                  href="/aline-vidal"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-lg transition-colors"
                >
                  Conoce mi historia
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ 5. TESTIMONIOS (NUEVO) */}
        {testimonials.length > 0 && (
          <section className="section-padding bg-white">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                  Lo Que Dicen Nuestros Clientes
                </h2>
                <p className="text-xl text-gray-700">
                  Experiencias reales de personas reales
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-cream p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                  >
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Texto */}
                    <p className="text-gray-700 mb-6 italic leading-relaxed">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* Autor */}
                    <div className="flex items-center gap-3">
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

              {/* Botón Ver Más */}
              <div className="text-center mt-12">
                <Link
                  href="/testimonios"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-lg transition-colors"
                >
                  Ver Todos los Testimonios
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 6. CTA Final */}
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
      </div>
    </>
  );
}