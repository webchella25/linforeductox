// app/servicios/facial/page.tsx
import Link from "next/link";
import { ArrowRight, Heart, Check, Calendar } from "lucide-react";
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

// ✅ Cargar servicio completo desde BD
async function getFacialService() {
  try {
    return await prisma.service.findUnique({
      where: { slug: 'tratamientos-faciales' }, // ✅ O el slug que uses
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
  const service = await getFacialService();
  
  if (!service) {
    return {
      title: "Tratamientos Faciales - LINFOREDUCTOX",
      description: "Tratamientos faciales con técnicas ancestrales y naturales.",
    };
  }

  return {
    title: `${service.name} - LINFOREDUCTOX | Rejuvenecimiento Natural`,
    description: service.description?.slice(0, 160) || "Descubre nuestros tratamientos faciales con técnicas ancestrales.",
    keywords: `${service.name}, tratamiento facial, rejuvenecimiento, kobido, Errenteria`,
    alternates: {
      canonical: "https://linforeductox.com/servicios/facial",
    },
  };
}

export default async function FacialPage() {
  const service = await getFacialService();

  // ✅ Valores por defecto
  const serviceName = service?.name || 'Tratamientos Faciales';
  const serviceDescription = service?.description || 'Nuestros tratamientos faciales van más allá de la superficie. Combinamos técnicas ancestrales con el poder de los aceites esenciales para rejuvenecer tu piel desde el interior.';
  const faqs = service?.faqs || [];

  const tratamientos = [
    {
      nombre: "Lifting Facial Natural",
      duracion: "60 min",
      descripcion: "Técnica manual que tonifica los músculos faciales, reduce arrugas y redefine el óvalo facial sin cirugía.",
    },
    {
      nombre: "Rejuvenecimiento Profundo",
      duracion: "75 min",
      descripcion: "Protocolo intensivo con aceites esenciales y masaje kobido para restaurar la juventud de tu piel.",
    },
    {
      nombre: "Hidratación Luminosa",
      duracion: "60 min",
      descripcion: "Tratamiento que nutre profundamente la piel deshidratada y devuelve el brillo natural del rostro.",
    },
    {
      nombre: "Anti-Edad Integral",
      duracion: "90 min",
      descripcion: "Combina técnicas orientales con productos naturales para combatir los signos de envejecimiento.",
    },
  ];

  const beneficios = [
    "Reducción visible de líneas de expresión",
    "Lifting facial natural sin cirugía",
    "Hidratación profunda de la piel",
    "Mejora de la elasticidad cutánea",
    "Luminosidad y brillo natural",
    "Estimulación de colágeno",
    "Tonificación muscular facial",
    "Relajación y bienestar emocional",
  ];

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
      { "@type": "ListItem", position: 3, name: serviceName, item: "https://linforeductox.com/servicios/facial" },
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

      {/* Hero - ✅ TÍTULO DINÁMICO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070')",
          }}
        >
          <div className="overlay-dark"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <div className="bg-secondary/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Heart size={40} className="text-secondary" />
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            {serviceName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Rejuvenece tu rostro, eleva tu belleza
          </p>
        </div>
      </section>

      {/* Descripción Principal - ✅ DESCRIPCIÓN DINÁMICA */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              Belleza auténtica desde el interior
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {serviceDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Filosofía natural
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Creemos en el poder del toque consciente y las técnicas milenarias
                que han demostrado su eficacia durante siglos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                No usamos máquinas invasivas ni productos químicos agresivos. Nuestro método
                combina aceites esenciales puros con técnicas orientales ancestrales.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070"
                alt="Tratamiento facial natural"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-6xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Beneficios transformadores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beneficios.map((beneficio) => (
              <div
                key={beneficio}
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

      {/* Tratamientos */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Nuestros Tratamientos Faciales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tratamientos.map((tratamiento) => (
              <div
                key={tratamiento.nombre}
                className="bg-cream p-8 rounded-2xl border-2 border-gray-100 hover:border-secondary transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-heading text-2xl font-semibold text-primary">
                    {tratamiento.nombre}
                  </h3>
                  <span className="bg-secondary/20 text-secondary px-4 py-1 rounded-full text-sm font-medium">
                    {tratamiento.duracion}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {tratamiento.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Técnicas */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12 text-center">
            Técnicas ancestrales que usamos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">
                Kobido Japonés
              </h3>
              <p className="text-white/90 leading-relaxed">
                Masaje facial ancestral japonés con más de 500 años de historia.
                Tonifica, esculpe y rejuvenece el rostro de forma natural.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">
                Gua Sha
              </h3>
              <p className="text-white/90 leading-relaxed">
                Técnica china milenaria que mejora la circulación, reduce inflamación
                y potencia la absorción de productos naturales.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">
                Acupuntura Facial
              </h3>
              <p className="text-white/90 leading-relaxed">
                Estimulación de puntos energéticos faciales para rejuvenecer,
                equilibrar y revitalizar la piel desde el interior.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">
                Aromaterapia
              </h3>
              <p className="text-white/90 leading-relaxed">
                Aceites esenciales puros que nutren, regeneran y aportan
                propiedades terapéuticas a cada tratamiento.
              </p>
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

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Descubre tu belleza más auténtica
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Cada tratamiento facial es una experiencia única de rejuvenecimiento
          </p>
          <Link
            href="/reservar?servicio=facial"
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