import Link from "next/link";
import { Sparkles, Heart, Zap, ArrowRight } from "lucide-react";

export default function ServiciosPage() {
  const servicios = [
    {
      title: "Tratamientos Corporales",
      description:
        "Masajes especializados que actúan sobre celulitis, grasa localizada, flacidez y retención de líquidos. Combinamos técnicas ancestrales orientales con tecnología natural avanzada.",
      benefits: [
        "Eliminación de celulitis",
        "Reducción de grasa localizada",
        "Mejora de la flacidez",
        "Drenaje linfático profundo",
        "Activación del metabolismo",
      ],
      icon: Sparkles,
      href: "/servicios/corporal",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070",
    },
    {
      title: "Tratamientos Faciales",
      description:
        "Rejuvenecimiento facial mediante técnicas naturales que restauran la luminosidad, elasticidad y juventud de tu piel. Belleza auténtica desde el interior.",
      benefits: [
        "Rejuvenecimiento natural",
        "Hidratación profunda",
        "Reducción de líneas de expresión",
        "Lifting facial no invasivo",
        "Luminosidad y vitalidad",
      ],
      icon: Heart,
      href: "/servicios/facial",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070",
    },
    {
      title: "Acupuntura",
      description:
        "Medicina tradicional china para equilibrar tu energía vital, aliviar dolores crónicos y restaurar el bienestar integral. Sanación profunda y duradera.",
      benefits: [
        "Equilibrio energético",
        "Alivio del dolor",
        "Reducción del estrés",
        "Mejora del sueño",
        "Fortalecimiento del sistema inmune",
      ],
      icon: Zap,
      href: "/servicios/acupuntura",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070",
    },
  ];

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
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Experiencias personalizadas para tu bienestar
          </p>
        </div>
      </section>

      {/* Servicios Detallados */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {servicios.map((servicio, index) => {
              const Icon = servicio.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={servicio.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  {/* Imagen */}
                  <div
                    className={`relative h-96 rounded-2xl overflow-hidden shadow-xl ${
                      isEven ? "" : "lg:col-start-2"
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${servicio.image}')` }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className={isEven ? "" : "lg:col-start-1 lg:row-start-1"}>
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <Icon size={32} className="text-primary" />
                    </div>
                    
                    <h2 className="font-heading text-4xl font-bold text-primary mb-4">
                      {servicio.title}
                    </h2>
                    
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {servicio.description}
                    </p>

                    <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
                      Beneficios:
                    </h3>
                    <ul className="space-y-3 mb-8">
                      {servicio.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <span className="text-secondary mt-1">✦</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={servicio.href}
                      className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary-dark transition-all"
                    >
                      Ver Detalles
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para tu transformación?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Cada masaje es una fusión que combina Ciencia, Arte y Energía
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-secondary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-secondary-light transition-all"
          >
            Reservar Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}