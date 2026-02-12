// app/servicios/acupuntura/page.tsx
import Link from "next/link";
import { ArrowRight, Zap, Check, Calendar } from "lucide-react";
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

// ✅ Cargar servicio completo desde BD
async function getAcupunturaService() {
  try {
    return await prisma.service.findUnique({
      where: { slug: 'acupuntura-tradicional-china' }, // ✅ O el slug que uses
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
  const service = await getAcupunturaService();
  
  if (!service) {
    return {
      title: "Acupuntura - LINFOREDUCTOX",
      description: "Acupuntura tradicional china para equilibrar tu energía vital.",
    };
  }

  return {
    title: `${service.name} - LINFOREDUCTOX | Medicina Tradicional China`,
    description: service.description?.slice(0, 160) || "Descubre los beneficios de la acupuntura tradicional china.",
    keywords: `${service.name}, acupuntura, medicina china, dolor crónico, estrés, Madrid`,
    alternates: {
      canonical: "https://linforeductox.com/servicios/acupuntura",
    },
  };
}

export default async function AcupunturaPage() {
  const service = await getAcupunturaService();

  // ✅ Valores por defecto
  const serviceName = service?.name || 'Acupuntura';
  const serviceDescription = service?.description || 'Medicina milenaria que equilibra la energía del cuerpo mediante la inserción de agujas en puntos específicos. Trata dolor, estrés y diversas afecciones.';
  const faqs = service?.faqs || [];

  const tratamientos = [
    {
      nombre: "Acupuntura Tradicional",
      duracion: "60 min",
      descripcion: "Tratamiento clásico de medicina china que equilibra el flujo de energía vital (Qi) para sanar el cuerpo.",
    },
    {
      nombre: "Acupuntura para el Dolor",
      duracion: "45 min",
      descripcion: "Especializada en aliviar dolores crónicos, migrañas, dolores musculares y articulares.",
    },
    {
      nombre: "Acupuntura Estética",
      duracion: "60 min",
      descripcion: "Rejuvenecimiento facial natural mediante agujas que estimulan la producción de colágeno.",
    },
    {
      nombre: "Acupuntura para Estrés",
      duracion: "75 min",
      descripcion: "Sesión diseñada para equilibrar el sistema nervioso, reducir ansiedad y mejorar el sueño.",
    },
  ];

  const beneficios = [
    "Alivio natural del dolor crónico",
    "Reducción del estrés y ansiedad",
    "Mejora de la calidad del sueño",
    "Equilibrio del sistema nervioso",
    "Fortalecimiento del sistema inmune",
    "Tratamiento de migrañas",
    "Mejora de la digestión",
    "Regulación hormonal natural",
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
      { "@type": "ListItem", position: 3, name: serviceName, item: "https://linforeductox.com/servicios/acupuntura" },
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
              "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070')",
          }}
        >
          <div className="overlay-dark"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <div className="bg-secondary/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Zap size={40} className="text-secondary" />
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            {serviceName}
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Equilibra tu energía, restaura tu salud
          </p>
        </div>
      </section>

      {/* Descripción Principal - ✅ DESCRIPCIÓN DINÁMICA */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              Medicina Ancestral China
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {serviceDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070"
                alt="Acupuntura tradicional china"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                ¿Cómo funciona?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cada sesión comienza con una evaluación completa de tu estado energético, 
                pulsos y lengua para diseñar un tratamiento personalizado que aborde tus 
                necesidades específicas.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Las agujas utilizadas son ultrafinas, estériles y de un solo uso, haciendo que
                el procedimiento sea prácticamente indoloro. La mayoría de las personas experimentan
                una profunda sensación de relajación durante y después del tratamiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-6xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Beneficios de la Acupuntura
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
            Tipos de Acupuntura
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

      {/* Condiciones que tratamos */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12 text-center">
            Condiciones que tratamos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Dolor crónico y agudo',
              'Migrañas y cefaleas',
              'Estrés y ansiedad',
              'Insomnio',
              'Problemas digestivos',
              'Alergias',
              'Fibromialgia',
              'Dolor menstrual',
              'Lesiones deportivas',
              'Fatiga crónica',
              'Problemas hormonales',
              'Sistema inmune debilitado',
            ].map((condition, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg"
              >
                <Check size={20} className="text-secondary flex-shrink-0 mt-1" />
                <span className="text-white/90">{condition}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl font-bold text-primary text-center mb-12">
            ¿Cómo es una sesión?
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-heading text-2xl font-semibold text-primary mb-3">
                  Evaluación
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Analizamos tu estado general, pulso, lengua y puntos de dolor para 
                  crear un diagnóstico energético completo.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-heading text-2xl font-semibold text-primary mb-3">
                  Tratamiento
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Insertamos agujas ultrafinas en puntos estratégicos para equilibrar 
                  tu energía vital (Qi) y activar tu capacidad natural de sanación.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-heading text-2xl font-semibold text-primary mb-3">
                  Recuperación
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Los resultados suelen sentirse inmediatamente, con mejorías progresivas
                  en cada sesión subsecuente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FAQs - SECCIÓN DINÁMICA */}
      {faqs.length > 0 && (
        <section className="section-padding bg-white">
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
                  className="bg-cream rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow"
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

      {/* CTA - ✅ CON /reservar */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Equilibra tu energía vital
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre los beneficios de la medicina tradicional china
          </p>
          <Link
            href="/reservar?servicio=acupuntura"
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