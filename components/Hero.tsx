// components/Hero.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getHeroConfig() {
  try {
    let config = await prisma.heroConfig.findFirst();
    
    if (!config) {
      // Valores por defecto si no existe configuración
      config = await prisma.heroConfig.create({
        data: {
          greeting: "Bienvenid@",
          mainTitle: "LINFOREDUCTOX",
          description: "Regenera y depura tu sistema linfático.\nActiva tu metabolismo.\nEsculpe tu belleza facial y corporal.",
          primaryButtonText: "Ver Servicios",
          primaryButtonLink: "/servicios",
          secondaryButtonText: "Reserva tu Experiencia",
          secondaryButtonLink: "/reservar",
        },
      });
    }
    
    return config;
  } catch (error) {
    console.error('Error obteniendo hero config:', error);
    // Retornar valores por defecto en caso de error
    return {
      backgroundImage: null,
      greeting: "Bienvenid@",
      mainTitle: "LINFOREDUCTOX",
      description: "Regenera y depura tu sistema linfático.\nActiva tu metabolismo.\nEsculpe tu belleza facial y corporal.",
      primaryButtonText: "Ver Servicios",
      primaryButtonLink: "/servicios",
      secondaryButtonText: "Reserva tu Experiencia",
      secondaryButtonLink: "/reservar",
    };
  }
}

export default async function Hero() {
  const config = await getHeroConfig();
  
  // Dividir descripción por saltos de línea
  const descriptionLines = config.description.split('\n').filter(line => line.trim());
  
  // Imagen por defecto si no hay configurada
  const backgroundImage = config.backgroundImage || 
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070";

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="overlay-dark"></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-5xl">
        {config.greeting && (
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">
            {config.greeting}
            <span className="block text-secondary mt-2">{config.mainTitle}</span>
          </h1>
        )}
        
        {descriptionLines.length > 0 && (
          <div className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            {descriptionLines.map((line, index) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={config.primaryButtonLink}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-primary transition-all"
          >
            {config.primaryButtonText}
          </Link>
          <Link
            href={config.secondaryButtonLink}
            className="bg-secondary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {config.secondaryButtonText}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}