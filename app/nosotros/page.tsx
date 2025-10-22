import Link from "next/link";
import { Heart, Sparkles, Target, ArrowRight } from "lucide-react";

export default function NosotrosPage() {
  const valores = [
    {
      icon: Heart,
      title: "Bienestar Integral",
      description:
        "Creemos en el equilibrio entre cuerpo, mente y espíritu para alcanzar la verdadera belleza.",
    },
    {
      icon: Sparkles,
      title: "Técnicas Ancestrales",
      description:
        "Honramos la sabiduría milenaria de la medicina oriental combinada con tecnología moderna.",
    },
    {
      icon: Target,
      title: "Resultados Visibles",
      description:
        "Nuestro compromiso es ofrecerte transformaciones reales y duraderas desde la primera sesión.",
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
            Sobre Nosotros
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Nuestra filosofía y compromiso contigo
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                El Método LINFOREDUCTOX
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                LINFOREDUCTOX nace de la pasión por fusionar lo mejor de dos
                mundos: la sabiduría milenaria de las tradiciones orientales y
                la precisión de la tecnología natural avanzada.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Creemos que cuando el sistema linfático fluye con libertad, la
                belleza y la salud emergen naturalmente. Por eso, cada
                tratamiento está diseñado para depurar, activar y restaurar tu
                cuerpo de manera integral.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                La música, los aceites esenciales, la respiración consciente y
                el toque inteligente: cada elemento está cuidadosamente
                seleccionado para reconectar tu cuerpo con la calma y elevar tu
                magnetismo natural.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2070')",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada uno de nuestros tratamientos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valores.map((valor) => {
              const Icon = valor.icon;
              return (
                <div
                  key={valor.title}
                  className="bg-white rounded-2xl p-8 shadow-lg text-center"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
                    {valor.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {valor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filosofía */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Sentir. Respirar. Renovar.
          </h2>
          <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Esa es la esencia del método LINFOREDUCTOX. Un espacio donde la
            belleza y la salud se encuentran en perfecta armonía.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-secondary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-secondary-light transition-all"
          >
            Comienza tu Transformación
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}