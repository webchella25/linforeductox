import Link from "next/link";
import { ArrowRight, Heart, Check } from "lucide-react";

export default function FacialPage() {
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

  return (
    <>
      {/* Hero */}
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
            Tratamientos Faciales
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Rejuvenece tu rostro, eleva tu belleza
          </p>
        </div>
      </section>

      {/* Descripción Principal */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              Belleza auténtica desde el interior
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nuestros tratamientos faciales van más allá de la superficie. Utilizamos técnicas
              ancestrales japonesas y chinas como el Kobido y el masaje facial de meridianos,
              combinadas con productos naturales de alta calidad para rejuvenecer tu piel
              de forma profunda y duradera.
            </p>
          </div>

          {/* Imagen */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070')",
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Cada tratamiento facial es un ritual diseñado para estimular la producción natural
              de colágeno, mejorar la circulación sanguínea y linfática del rostro, y liberar
              las tensiones acumuladas en los músculos faciales.
            </p>
            <p className="text-gray-700 leading-relaxed">
              No usamos máquinas invasivas ni productos químicos agresivos. Creemos en el poder
              del toque consciente, los aceites esenciales puros y las técnicas milenarias que
              han demostrado su eficacia durante siglos.
            </p>
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
                Masaje facial ancestral japonés con más de 500 años de historia. Combina
                movimientos rápidos y lentos para tonificar, rejuvenecer y esculpir el rostro.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">
                Meridianos Faciales
              </h3>
              <p className="text-white/90 leading-relaxed">
                Estimulación de puntos energéticos del rostro según la medicina tradicional
                china para equilibrar el chi y promover la regeneración celular.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">
                Gua Sha
              </h3>
              <p className="text-white/90 leading-relaxed">
                Técnica china milenaria con piedras de jade o cuarzo rosa que drena toxinas,
                reduce inflamación y esculpe el óvalo facial.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <h3 className="font-heading text-2xl font-semibold mb-4">
                Aromaterapia Facial
              </h3>
              <p className="text-white/90 leading-relaxed">
                Aceites esenciales puros seleccionados según tu tipo de piel para nutrir,
                regenerar y equilibrar mientras disfrutas de un momento de paz profunda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Recupera la juventud de tu rostro
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Experimenta el poder transformador de las técnicas ancestrales orientales
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
          >
            Reservar Tratamiento
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}