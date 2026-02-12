// app/servicios/corporal/page.tsx
import Link from 'next/link';
import { Sparkles, Heart, Droplets, Wind, ArrowRight, Calendar, Check } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

// ✅ Cargar servicio completo desde BD
async function getCorporalService() {
  try {
    return await prisma.service.findUnique({
      where: { slug: 'tratamientos-corporales' }, // ✅ O el slug que uses
      include: {
        faqs: {
          orderBy: { order: 'asc' }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

// ✅ METADATA dinámica
export async function generateMetadata(): Promise<Metadata> {
  const service = await getCorporalService();
  
  if (!service) {
    return {
      title: "Tratamientos Corporales - LINFOREDUCTOX",
      description: "Tratamientos corporales con drenaje linfático y masajes reductivos.",
    };
  }

  return {
    title: `${service.name} - LINFOREDUCTOX | Drenaje Linfático y Reductivos`,
    description: service.description?.slice(0, 160) || "Descubre nuestros tratamientos corporales con drenaje linfático.",
    keywords: `${service.name}, tratamiento corporal, drenaje linfático, celulitis, Madrid`,
    alternates: {
      canonical: "https://linforeductox.com/servicios/corporal",
    },
  };
}

export default async function CorporalPage() {
  const service = await getCorporalService();

  // ✅ Si no existe, mostrar valores por defecto
  const serviceName = service?.name || 'Tratamientos Corporales';
  const serviceDescription = service?.description || 'Nuestro método LINFOREDUCTOX combina técnicas ancestrales orientales con tecnología natural avanzada.';
  const faqs = service?.faqs || [];

  // ✅ Schema.org FAQPage
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  // ✅ Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://linforeductox.com" },
      { "@type": "ListItem", position: 2, name: "Servicios", item: "https://linforeductox.com/servicios" },
      { "@type": "ListItem", position: 3, name: serviceName, item: "https://linforeductox.com/servicios/corporal" },
    ],
  };

  return (
    <>
      {/* ✅ Schema.org Scripts */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section - ✅ TÍTULO DINÁMICO */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="container-custom relative z-10 text-center text-white py-20">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">
            {serviceName}
          </h1>
          <p className="text-2xl md:text-3xl font-light max-w-3xl mx-auto">
            LINFOREDUCTOX
          </p>
        </div>
      </section>

      {/* Descripción Principal - ✅ DESCRIPCIÓN DINÁMICA */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              El Arte del Masaje Reductivo
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-line">
              {serviceDescription}
            </p>
          </div>

          {/* CTA Reservar */}
          <div className="text-center mb-16">
            <Link
              href="/contacto?servicio=corporal"
              className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar size={24} />
              Reservar {serviceName}
              <ArrowRight size={24} />
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Recibirás confirmación en 24 horas
            </p>
          </div>

          {/* Beneficios */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Reducción visible
                  </h3>
                  <p className="text-gray-700">
                    Resultados notables desde la primera sesión en reducción de
                    medidas y mejora de la textura de la piel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Droplets className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Drenaje linfático
                  </h3>
                  <p className="text-gray-700">
                    Activación natural del sistema linfático para eliminar toxinas
                    y reducir la retención de líquidos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Bienestar integral
                  </h3>
                  <p className="text-gray-700">
                    Más que un tratamiento estético, es una experiencia de
                    relajación profunda y reconexión con tu cuerpo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wind className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Técnica personalizada
                  </h3>
                  <p className="text-gray-700">
                    Cada sesión se adapta a tus necesidades específicas y tipo de
                    piel para resultados óptimos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Condiciones que trata */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-10 rounded-2xl">
            <h3 className="text-3xl font-heading font-bold text-primary mb-6 text-center">
              ¿Qué condiciones trata?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Celulitis y piel de naranja',
                'Grasa localizada',
                'Flacidez corporal',
                'Retención de líquidos',
                'Circulación linfática',
                'Toxinas acumuladas',
                'Estrés y tensión muscular',
                'Falta de tonicidad',
              ].map((condition, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg"
                >
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span className="text-gray-700">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FAQs - SECCIÓN DINÁMICA */}
      {faqs.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-xl text-gray-700">
                Resolvemos tus dudas sobre {serviceName.toLowerCase()}
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-start gap-3">
                    <span className="text-secondary flex-shrink-0">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Transforma tu cuerpo, eleva tu energía
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experimenta el poder del método LINFOREDUCTOX
          </p>
        <Link
            href="/reservar?servicio=corporal"
            className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl"
          >
            <Calendar size={24} />
            Reservar {serviceName}
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}