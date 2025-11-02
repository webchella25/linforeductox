// app/aline-vidal/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Heart, Sparkles } from "lucide-react";
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

async function getAlineContent() {
  try {
    const [bio, philosophy] = await Promise.all([
      prisma.content.findUnique({ where: { section: 'aline_bio' } }),
      prisma.content.findUnique({ where: { section: 'aline_philosophy' } }),
    ]);

    return { bio, philosophy };
  } catch (error) {
    console.error('Error fetching Aline content:', error);
    return { bio: null, philosophy: null };
  }
}

export default async function AlineVidalPage() {
  const { bio, philosophy } = await getAlineContent();

  const formacion = [
    "Terapeuta en Medicina Tradicional China",
    "Especialista en Drenaje Linfático Manual",
    "Certificada en Kobido (Masaje Facial Japonés)",
    "Experta en Acupuntura Tradicional",
    "Formación en Aromaterapia Clínica",
    "Especialización en Gua Sha y Moxibustión",
  ];

  // Dividir el contenido de biografía en párrafos
  const bioParagraphs = bio?.content?.split('\n\n').filter(p => p.trim()) || [];
  const philosophyParagraphs = philosophy?.content?.split('\n\n').filter(p => p.trim()) || [];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070')",
          }}
        >
          <div className="overlay-dark"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-secondary text-xl font-medium mb-4">
            Fundadora de LINFOREDUCTOX
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            Aline Vidal
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Terapeuta especializada en medicina ancestral oriental
          </p>
        </div>
      </section>

      {/* Presentación con foto profesional */}
      <section className="section-padding bg-white">
  <div className="container-custom">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Foto profesional */}
      <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-cream">
        <Image
          src="/alin-vidal-profesional.jpg"
          alt="Aline Vidal - Fundadora LINFOREDUCTOX"
          fill
          className="object-cover object-top" // ← ✅ Cambio clave
          priority
        />
      </div>

      {/* Contenido dinámico desde BD */}
      <div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
          {bio?.title || 'Mi historia'}
        </h2>
        
        {bio?.subtitle && (
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {bio.subtitle}
          </p>
        )}

        {bioParagraphs.map((paragraph, index) => (
          <p 
            key={index} 
            className={`text-gray-700 leading-relaxed ${
              index === 0 ? 'text-lg font-semibold text-primary mb-6' : 'mb-4'
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Experiencia */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <Award size={48} className="text-secondary mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                Más de 10 años
              </h3>
              <p className="text-gray-600">
                Dedicada a la medicina ancestral oriental
              </p>
            </div>

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
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
            {philosophy?.title || 'Mi Filosofía'}
          </h2>
          
          {philosophyParagraphs.map((paragraph, index) => (
            <div key={index} className="mb-8">
              {index === 0 && paragraph.startsWith('"') ? (
                <blockquote className="text-2xl md:text-3xl text-center text-gray-800 italic leading-relaxed">
                  {paragraph}
                </blockquote>
              ) : (
                <p className="text-lg text-gray-700 text-center leading-relaxed">
                  {paragraph}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Formación */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Formación y Certificaciones
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {formacion.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="bg-secondary/10 p-2 rounded-full flex-shrink-0">
                  <Sparkles size={24} className="text-secondary" />
                </div>
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom text-center max-w-3xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para comenzar tu transformación?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Descubre el poder del método LINFOREDUCTOX y experimenta una transformación que va más allá de lo físico.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-secondary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-secondary-light transition-all"
          >
            Reservar Consulta
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}