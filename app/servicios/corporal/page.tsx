import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export default function CorporalPage() {
  const tratamientos = [
    {
      nombre: "Drenaje Linfático Manual",
      duracion: "60 min",
      descripcion: "Técnica suave que activa la circulación linfática, elimina toxinas y reduce la retención de líquidos.",
    },
    {
      nombre: "Masaje Reductivo",
      duracion: "75 min",
      descripcion: "Combinación de técnicas profundas para eliminar grasa localizada y remodelar la figura.",
    },
    {
      nombre: "Tratamiento Anti-Celulitis",
      duracion: "90 min",
      descripcion: "Protocolo intensivo que combina ventosas, masaje profundo y aceites esenciales para eliminar la celulitis.",
    },
    {
      nombre: "Masaje Tonificante",
      duracion: "60 min",
      descripcion: "Activa la circulación, tonifica los músculos y mejora la firmeza de la piel.",
    },
  ];

  const beneficios = [
    "Eliminación de celulitis visible",
    "Reducción de medidas corporales",
    "Mejora de la circulación sanguínea",
    "Drenaje de toxinas acumuladas",
    "Tonificación y firmeza de la piel",
    "Activación del metabolismo",
    "Relajación muscular profunda",
    "Resultados visibles desde la primera sesión",
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070')",
          }}
        >
          <div className="overlay-dark"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <div className="bg-secondary/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Sparkles size={40} className="text-secondary" />
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            Tratamientos Corporales
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Esculpe tu cuerpo, activa tu vitalidad
          </p>
        </div>
      </section>

      {/* Descripción Principal */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              Recupera tu figura con técnicas ancestrales
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nuestros tratamientos corporales combinan la sabiduría de la medicina oriental
              con tecnología natural avanzada. Cada sesión está diseñada para atacar la celulitis,
              grasa localizada, flacidez y retención de líquidos, mientras liberas tensiones
              y reconectas con tu cuerpo.
            </p>
          </div>

          {/* Imagen */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070')",
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              La música envolvente, los aceites esenciales seleccionados, la respiración consciente
              y el toque inteligente de nuestras terapeutas crean una experiencia única que va más
              allá de lo estético: es un ritual de reconexión con tu esencia.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cada movimiento está pensado para activar los meridianos energéticos, drenar el
              sistema linfático y elevar tu magnetismo natural. No es solo un masaje, es una
              transformación integral.
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-6xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Beneficios que sentirás
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
            Nuestros Tratamientos
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

      {/* Proceso */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                Consulta Inicial
              </h3>
              <p className="text-white/80">
                Evaluamos tu cuerpo y diseñamos un plan personalizado según tus objetivos.
              </p>
            </div>
            <div>
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                Tratamiento
              </h3>
              <p className="text-white/80">
                Sesiones donde aplicamos técnicas manuales profundas con aceites esenciales.
              </p>
            </div>
            <div>
              <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">
                Resultados
              </h3>
              <p className="text-white/80">
                Cambios visibles desde la primera sesión. Transformación completa en 8-12 sesiones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Comienza tu transformación hoy
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Reserva tu primera sesión y descubre el poder de la medicina ancestral
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
          >
            Reservar Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}