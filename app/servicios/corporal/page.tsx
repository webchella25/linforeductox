// app/servicios/corporal/page.tsx

import Link from 'next/link';
import { Sparkles, Heart, Droplets, Wind, ArrowRight, Calendar } from 'lucide-react';

export default function CorporalPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        <div className="container-custom relative z-10 text-center text-white py-20">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">
            Tratamientos Corporales
          </h1>
          <p className="text-2xl md:text-3xl font-light max-w-3xl mx-auto">
            LINFOREDUCTOX
          </p>
        </div>
      </section>

      {/* Descripción Principal */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              El Arte del Masaje Reductivo
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Nuestro método LINFOREDUCTOX combina técnicas ancestrales orientales
              con tecnología natural avanzada para tratar celulitis, grasa
              localizada, flacidez y retención de líquidos.
            </p>
          </div>

          {/* CTA Reservar */}
          <div className="text-center mb-16">
            <Link
              href="/reservar?servicio=corporal"
              className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Calendar size={24} />
              Reservar Tratamiento Corporal
              <ArrowRight size={24} />
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Recibirás confirmación en 24 horas
            </p>
          </div>

          {/* Beneficios */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Reducción visible
                  </h3>
                  <p className="text-gray-700">
                    Resultados notables desde la primera sesión en reducción de
                    medidas y mejora de la textura de la piel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Droplets className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Drenaje linfático
                  </h3>
                  <p className="text-gray-700">
                    Activación natural del sistema linfático para eliminar toxinas
                    y reducir la retención de líquidos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Bienestar integral
                  </h3>
                  <p className="text-gray-700">
                    Más que un tratamiento estético, es una experiencia de
                    relajación profunda y reconexión con tu cuerpo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream/50 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wind className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Técnica personalizada
                  </h3>
                  <p className="text-gray-700">
                    Cada sesión se adapta a tus necesidades específicas y tipo de
                    piel para resultados óptimos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Condiciones que trata */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-10 rounded-2xl">
            <h3 className="text-3xl font-heading font-bold text-primary mb-6 text-center">
              ¿Qué condiciones trata?
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Celulitis y piel de naranja',
                'Grasa localizada',
                'Flacidez corporal',
                'Retención de líquidos',
                'Circulación linfática',
                'Toxinas acumuladas',
                'Estrés y tensión muscular',
                'Falta de tonicidad',
              ].map((condition, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg"
                >
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span className="text-gray-700">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proceso del Tratamiento */}
      <section className="section-padding bg-cream/30">
        <div className="container-custom max-w-4xl">
          <h2 className="font-heading text-4xl font-bold text-primary text-center mb-12">
            El Proceso
          </h2>
          <div className="space-y-8">
            {[
              {
                num: '01',
                title: 'Valoración inicial',
                desc: 'Evaluamos tu situación específica y establecemos objetivos personalizados.',
              },
              {
                num: '02',
                title: 'Preparación',
                desc: 'Ambiente relajante con música, aromaterapia y temperatura ideal.',
              },
              {
                num: '03',
                title: 'Tratamiento',
                desc: 'Aplicación del método LINFOREDUCTOX con técnicas manuales especializadas.',
              },
              {
                num: '04',
                title: 'Finalización',
                desc: 'Recomendaciones personalizadas y plan de seguimiento.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex gap-6 bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl font-heading font-bold text-secondary/20">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-700">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            ¿Lista para transformar tu cuerpo?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Reserva tu primera sesión de LINFOREDUCTOX y descubre la diferencia
          </p>
          <Link
            href="/reservar?servicio=corporal"
            className="inline-flex items-center gap-3 bg-white text-primary px-10 py-5 rounded-full font-semibold text-lg hover:bg-cream transition-all shadow-lg hover:shadow-xl"
          >
            <Calendar size={24} />
            Reservar Ahora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}