// app/aline-vidal/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Heart, Sparkles, Check } from "lucide-react";
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getAboutConfig() {
  try {
    let config = await prisma.aboutConfig.findFirst();
    
    if (!config) {
      config = await prisma.aboutConfig.create({
        data: {
          heroTitle: 'Aline Vidal',
          heroSubtitle: 'Terapeuta especializada en medicina ancestral oriental',
          biography: '<p>Biografía profesional...</p>',
          yearsExperience: 10,
          certifications: [
            "Terapeuta en Medicina Tradicional China",
            "Especialista en Drenaje Linfático Manual",
            "Certificada en Kobido (Masaje Facial Japonés)",
          ],
        },
      });
    }
    
    return config;
  } catch (error) {
    console.error('Error obteniendo about config:', error);
    return null;
  }
}

// ✅ METADATA DINÁMICA PARA SEO
export async function generateMetadata(): Promise<Metadata> {
  const config = await getAboutConfig();
  
  const title = config?.heroTitle 
    ? `${config.heroTitle} - Fundadora de LINFOREDUCTOX | Terapeuta y Coach`
    : "Aline Vidal - Fundadora de LINFOREDUCTOX | Terapeuta y Coach";
  
  const description = config?.heroSubtitle || 
    "Conoce a Aline Vidal, fundadora de LINFOREDUCTOX. Especialista en drenaje linfático, medicina ancestral china y acupuntura estética en Madrid.";

  return {
    title,
    description,
    keywords: "Aline Vidal, terapeuta, coach corporal, acupuntura, medicina china, Madrid",
    alternates: {
      canonical: "https://linforeductox.com/aline-vidal",
    },
    openGraph: {
      title,
      description,
      url: 'https://linforeductox.com/aline-vidal',
      type: 'profile',
      images: config?.heroImage ? [config.heroImage] : [],
    },
  };
}

export default async function AlineVidalPage() {
  const config = await getAboutConfig();

  if (!config) {
    return <div>Error al cargar la página</div>;
  }

  // Imágenes con fallback
  const heroImage = config.heroImage || 
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070';
  
  const secondaryImage = config.secondaryImage || 
    '/alin-vidal-profesional.jpg';

  // ✅ Schema.org Person
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.heroTitle,
    jobTitle: config.heroSubtitle,
    description: config.heroSubtitle,
    url: "https://linforeductox.com/aline-vidal",
    image: config.heroImage || undefined,
    worksFor: {
      "@type": "MedicalBusiness",
      name: "LINFOREDUCTOX",
    },
    knowsAbout: config.certifications.slice(0, 5),
  };

  // ✅ Breadcrumb
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
        name: config.heroTitle,
        item: "https://linforeductox.com/aline-vidal",
      },
    ],
  };

  return (
    <>
      {/* ✅ Schema.org Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Dinámico */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={config.heroTitle}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <p className="text-secondary text-xl font-medium mb-4">
            Fundadora de LINFOREDUCTOX
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
            {config.heroTitle}
          </h1>
          <p className="text-2xl md:text-3xl text-white/90">
            {config.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Presentación con biografía dinámica */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Foto profesional dinámica */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={secondaryImage}
                alt={`${config.heroTitle} - Fundadora LINFOREDUCTOX`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            </div>

            {/* Biografía dinámica */}
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                Mi Historia
              </h2>
              
              {config.biography ? (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: config.biography }}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Especialista en medicina ancestral oriental con años de dedicación 
                    al bienestar integral de mis pacientes.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Mi enfoque combina técnicas milenarias con conocimientos modernos 
                    para ofrecer tratamientos personalizados y efectivos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia con datos dinámicos */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {config.yearsExperience > 0 && (
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <Award size={48} className="text-secondary mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                  {config.yearsExperience}+ años
                </h3>
                <p className="text-gray-600">
                  Dedicada a la medicina ancestral oriental
                </p>
              </div>
            )}

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <Heart size={48} className="text-secondary mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                +500 clientas
              </h3>
              <p className="text-gray-600">
                Transformadas con el método LINFOREDUCTOX
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <Sparkles size={48} className="text-secondary mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                Método único
              </h3>
              <p className="text-gray-600">
                Fusión de técnicas milenarias y ciencia moderna
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofía - Contenido dinámico */}
{config.philosophy && (
  <section className="section-padding bg-white">
    <div className="container-custom max-w-4xl">
      <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
        Mi Filosofía
      </h2>
      
      <div 
        className="prose prose-lg max-w-none text-center"
        dangerouslySetInnerHTML={{ __html: config.philosophy }}
      />
    </div>
  </section>
)}

{/* Si no hay filosofía, mostrar texto por defecto */}
{!config.philosophy && (
  <section className="section-padding bg-white">
    <div className="container-custom max-w-4xl">
      <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
        Mi Filosofía
      </h2>
      
      <blockquote className="text-2xl md:text-3xl text-center text-gray-800 italic leading-relaxed mb-8">
        "Creo en un enfoque holístico que considera cuerpo, mente y espíritu. 
        Cada persona es única y merece un tratamiento personalizado."
      </blockquote>
      
      <p className="text-lg text-gray-700 text-center leading-relaxed">
        Mi compromiso es acompañarte en tu camino hacia el bienestar integral, 
        combinando sabiduría ancestral con técnicas modernas para lograr resultados 
        duraderos y transformadores.
      </p>
    </div>
  </section>
)}

      {/* Formación y Certificaciones dinámicas */}
      {config.certifications.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom max-w-4xl">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
              Formación y Certificaciones
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {config.certifications.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Check size={16} className="text-primary" />
                  </div>
                  <p className="text-gray-700 font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video (si existe) */}
      {config.videoUrl && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-primary mb-4">
                Conóceme Mejor
              </h2>
              <p className="text-lg text-gray-700">
                Un mensaje personal para ti
              </p>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={config.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom text-center max-w-3xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para comenzar tu transformación?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Descubre el poder del método LINFOREDUCTOX y experimenta una transformación 
            que va más allá de lo físico.
          </p>
          <Link
            href="/reservar"
            className="inline-flex items-center gap-2 bg-secondary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl"
          >
            Reservar Consulta
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}