// app/servicios/page.tsx
import Link from 'next/link';
import { ArrowRight, Clock, ChevronDown } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

// ✅ METADATA SEO
export const metadata: Metadata = {
  title: "Tratamientos de Estética y Medicina Ancestral | LINFOREDUCTOX",
  description: "Descubre todos nuestros tratamientos: drenaje linfático, masajes corporales, tratamientos faciales y acupuntura tradicional china en Madrid.",
  keywords: "tratamientos, servicios, drenaje linfático, masaje corporal, tratamiento facial, acupuntura, estética, Madrid",
  alternates: {
    canonical: "https://linforeductox.com/servicios",
  },
  openGraph: {
    title: "Nuestros Tratamientos | LINFOREDUCTOX",
    description: "Tratamientos corporales, faciales y acupuntura con técnicas ancestrales orientales en Madrid.",
    url: "https://linforeductox.com/servicios",
    siteName: "LINFOREDUCTOX",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://linforeductox.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tratamientos LINFOREDUCTOX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuestros Tratamientos | LINFOREDUCTOX",
    description: "Tratamientos corporales, faciales y acupuntura con técnicas ancestrales orientales.",
    images: ["https://linforeductox.com/og-image.jpg"],
  },
};

async function getServices() {
  try {
    const allServices = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    // Organizar en jerarquía
    const parents = allServices.filter(s => !s.parentServiceId);
    const children = allServices.filter(s => s.parentServiceId);

    return parents.map(parent => ({
      ...parent,
      childServices: children.filter(child => child.parentServiceId === parent.id),
    }));
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return [];
  }
}

// Función helper para limpiar HTML
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').substring(0, 200);
}

export default async function ServiciosPage() {
  const services = await getServices();

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
      {
        "@type": "ListItem",
        position: 2,
        name: "Tratamientos",
        item: "https://linforeductox.com/servicios",
      },
    ],
  };

  // ✅ Schema.org ItemList para servicios
  const servicesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tratamientos LINFOREDUCTOX",
    description: "Lista de tratamientos de estética y medicina ancestral",
    numberOfItems: services.length,
    itemListElement: services.map((parent: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: parent.name,
      url: `https://linforeductox.com/servicios/${parent.slug}`,
    })),
  };

  return (
    <>
      {/* ✅ Schema.org Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesListSchema) }}
      />

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
            Nuestros Tratamientos
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Experiencias personalizadas para tu bienestar
          </p>
        </div>
      </section>

      {/* Tratamientos Organizados por Jerarquía */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                No hay tratamientos disponibles en este momento
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {services.map((parent) => (
                <div key={parent.id} className="space-y-8">
                  {/* Servicio Padre */}
                  <div className="bg-gradient-to-br from-cream to-white rounded-3xl shadow-lg overflow-hidden border-2 border-primary/20">
                    <div className="p-8 md:p-12">
                      <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                        {parent.name}
                      </h2>
                      
                      <div 
                        className="prose prose-lg max-w-none text-gray-700 mb-6"
                        dangerouslySetInnerHTML={{ __html: parent.description }}
                      />

                      <div className="flex items-center gap-6 text-gray-600 mb-8">
                        <div className="flex items-center gap-2">
                          <Clock size={20} className="text-primary" />
                          <span>{parent.duration} minutos</span>
                        </div>
                        {parent.price && (
                          <div className="text-2xl font-bold text-secondary">
                            {parent.price}€
                          </div>
                        )}
                      </div>

                      {parent.childServices && parent.childServices.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-primary/5 px-4 py-2 rounded-lg inline-flex">
                          <ChevronDown size={18} className="text-primary" />
                          <span className="font-medium">
                            {parent.childServices.length} opciones disponibles
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subtratamientos (Hijos) */}
                  {parent.childServices && parent.childServices.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-0 md:pl-8">
                      {parent.childServices.map((child: any) => (
                        <Link
                          key={child.id}
                          href={`/servicios/${child.slug}`}
                          className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors flex-1">
                                {child.name}
                              </h3>
                              <ArrowRight 
                                className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" 
                                size={20} 
                              />
                            </div>

                            <div 
                              className="prose prose-sm max-w-none text-gray-600 mb-4 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: child.description }}
                            />

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={16} />
                                <span>{child.duration} min</span>
                              </div>
                              {child.price && (
                                <div className="text-lg font-bold text-secondary">
                                  {child.price}€
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
            Cada tratamiento es una fusión que combina Ciencia, Arte y Energía
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