// app/page.tsx
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

async function getHomeContent() {
  try {
    const [heroContent, servicesIntro] = await Promise.all([
      prisma.content.findUnique({ where: { section: 'hero' } }),
      prisma.content.findUnique({ where: { section: 'services_intro' } }),
    ]);

    return { heroContent, servicesIntro };
  } catch (error) {
    console.error('Error fetching home content:', error);
    return { heroContent: null, servicesIntro: null };
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

export default async function Home() {
  const { heroContent, servicesIntro } = await getHomeContent();
  const featuredServices = await getFeaturedServices();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        title={heroContent?.title || 'Bienestar Natural y Armonía Interior'}
        subtitle={heroContent?.subtitle || 'Medicina Ancestral Oriental y Tratamientos de Belleza'}
        description={
          heroContent?.content ||
          'En Linforeductox, fusionamos la sabiduría milenaria de la medicina oriental con técnicas modernas de estética.'
        }
      />

      {/* Services Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {servicesIntro?.title || 'Nuestros Servicios'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {servicesIntro?.subtitle || 'Tratamientos Personalizados para Tu Bienestar'}
            </p>
            {servicesIntro?.content && (
              <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                {servicesIntro.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/servicios"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Ver Todos los Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comienza Tu Viaje Hacia el Bienestar
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Agenda tu primera consulta y descubre cómo podemos ayudarte a alcanzar tus objetivos de salud y belleza.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-cream transition-colors"
          >
            Contactar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}