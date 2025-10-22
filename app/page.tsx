import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const services = [
    {
      title: "Tratamientos Corporales",
      description:
        "Masajes especializados que combinan técnicas ancestrales para eliminar celulitis, grasa localizada y flacidez. Activa tu circulación y recupera la vitalidad de tu cuerpo.",
      iconName: "sparkles" as const,
      href: "/servicios/corporal",
    },
    {
      title: "Tratamientos Faciales",
      description:
        "Rejuvenece tu rostro con técnicas naturales que restauran la luminosidad, elasticidad y juventud de tu piel. Belleza auténtica desde el interior.",
      iconName: "heart" as const,
      href: "/servicios/facial",
    },
    {
      title: "Acupuntura",
      description:
        "Medicina tradicional china para equilibrar tu energía vital, aliviar dolores y restaurar el bienestar integral. Sanación profunda y duradera.",
      iconName: "zap" as const,
      href: "/servicios/acupuntura",
    },
  ];

  return (
    <>
      <Hero />

      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Cuando el Sistema Linfático florece con libertad,
            <span className="block text-secondary mt-2">
              Belleza y Salud son un hecho
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Te ofrecemos una gama de experiencias personalizadas, propuesta única en Estética Avanzada, inspirada en la sabiduría de Tradiciones Ancestrales Orientales.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada masaje es una fusión que combina Ciencia, Arte y Energía
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                iconName={service.iconName}
                href={service.href}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                Sentir. Respirar. Renovar.
              </h2>
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                Esa es la esencia del método LINFOREDUCTOX.
              </p>
              <p className="text-white/80 mb-8 leading-relaxed">
                La música, los aceites, la respiración y el toque inteligente y
                consciente: todo está pensado para reconectar tu cuerpo con la
                calma, activar la circulación de los meridianos y elevar tu
                magnetismo.
              </p>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary-light transition-all"
              >
                Conoce Nuestra Filosofía
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070')",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Reserva tu experiencia LINFOREDUCTOX
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Redescubre la versión más pura, simple y elegante de tu belleza
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
          >
            Contactar Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}