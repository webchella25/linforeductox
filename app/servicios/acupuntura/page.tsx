import Link from "next/link";
import { ArrowRight, Zap, Check } from "lucide-react";

export default function AcupunturaPage() {
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
    "Alivio del dolor crónico sin medicamentos",
    "Reducción del estrés y la ansiedad",
    "Mejora de la calidad del sueño",
    "Fortalecimiento del sistema inmunológico",
    "Equilibrio hormonal natural",
    "Aumento de energía y vitalidad",
    "Tratamiento de migrañas y cefaleas",
    "Regulación digestiva",
  ];

  const condiciones = [
    "Dolores musculares y articulares",
    "Migrañas y cefaleas tensionales",
    "Estrés, ansiedad y depresión",
    "Insomnio y problemas del sueño",
    "Problemas digestivos",
    "Alergias y problemas respiratorios",
    "Fatiga crónica",
    "Desequilibrios hormonales",
  ];

  return (
    <>
      {/* Hero */}
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
            Acupuntura
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Equilibra tu energía, sana tu cuerpo
          </p>
        </div>
      </section>

      {/* Descripción Principal */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              Medicina ancestral china con más de 3000 años
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              La acupuntura es una de las prácticas más antiguas y efectivas de la medicina
              tradicional china. Mediante la inserción de finas agujas en puntos específicos
              del cuerpo, restauramos el equilibrio del Qi (energía vital), activamos la
              capacidad natural de sanación del organismo y tratamos la raíz de los problemas
              de salud, no solo los síntomas.
            </p>
          </div>

          {/* Imagen */}
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070')",
              }}
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              En LINFOREDUCTOX practicamos acupuntura tradicional auténtica, respetando los
              principios milenarios de la medicina china. Cada sesión comienza con una evaluación
              completa de tu estado energético, pulsos y lengua para diseñar un tratamiento
              personalizado que aborde tus necesidades específicas.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Las agujas utilizadas son ultrafinas, estériles y de un solo uso, haciendo que
              el procedimiento sea prácticamente indoloro. La mayoría de las personas experimentan
              una profunda sensación de relajación durante y después del tratamiento.
            </p>
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
            {condiciones.map((condicion) => (
              <div
                key={condicion}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl"
              >
                <div className="bg-secondary/30 p-2 rounded-full flex-shrink-0">
                  <Zap size={20} className="text-white" />
                </div>
                <p className="text-white/90 font-medium">{condicion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-5xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            ¿Cómo funciona la Acupuntura?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 mx-auto">
                1
              </div>
              <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
                Diagnóstico
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Evaluamos tu estado energético mediante el análisis de pulsos, lengua y
                síntomas para identificar desequilibrios.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 mx-auto">
                2
              </div>
              <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
                Tratamiento
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Insertamos agujas ultrafinas en puntos específicos para restaurar el flujo
                de energía y activar la sanación natural.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 mx-auto">
                3
              </div>
              <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
                Recuperación
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Los resultados suelen sentirse inmediatamente, con mejorías progresivas
                en cada sesión subsecuente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Recupera tu equilibrio natural
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Experimenta el poder sanador de la medicina tradicional china
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
          >
            Agendar Sesión
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}