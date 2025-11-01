import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Heart, Sparkles } from "lucide-react";

export default function AlinVidalPage() {
  const formacion = [
    "Terapeuta en Medicina Tradicional China",
    "Especialista en Drenaje Linfático Manual",
    "Certificada en Kobido (Masaje Facial Japonés)",
    "Experta en Acupuntura Tradicional",
    "Formación en Aromaterapia Clínica",
    "Especialización en Gua Sha y Moxibustión",
  ];

  const experiencia = [
    {
      icon: Award,
      titulo: "Más de 10 años",
      descripcion: "Dedicada a la medicina ancestral oriental",
    },
    {
      icon: Heart,
      titulo: "+500 clientas",
      descripcion: "Transformadas con el método LINFOREDUCTOX",
    },
    {
      icon: Sparkles,
      titulo: "Método único",
      descripcion: "Fusión de técnicas milenarias y ciencia moderna",
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
          className="object-contain"
          priority
        />
      </div>

      {/* Contenido */}
      <div>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
          Mi historia
        </h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Coach corporal y facialista, diplomada en Acupuntura Estética, 
          Osteopatía y Sistema Linfático.
        </p>
        <p className="text-lg font-semibold text-primary mb-6">
          Creadora del método LINFOREDUCTOX.
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Más de 15 años dedicada a practicar métodos relacionados con el 
          bienestar y la estética corporal y facial.
        </p>
        
        <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
          Formación y Experiencia Técnica:
        </h3>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-3">
            <span className="text-secondary mt-1">✦</span>
            <span className="text-gray-700">Osteopatía y Sistema Linfático</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-secondary mt-1">✦</span>
            <span className="text-gray-700">Masajes reductores y modeladores</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-secondary mt-1">✦</span>
            <span className="text-gray-700">Acupuntura Estética (con y sin agujas)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-secondary mt-1">✦</span>
            <span className="text-gray-700">Aromaterapia y Cosmética Natural y Biológica</span>
          </li>
        </ul>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Con todo ello ha nacido <span className="font-semibold text-primary">LINFOREDUCTOX</span>, 
          un método que no solo embellece el cuerpo, sino que libera bloqueos, 
          armoniza los sistemas internos y conecta con el poder de la belleza 
          del Sagrado Femenino.
        </p>
        
        <p className="text-2xl text-center font-heading text-secondary italic">
          «Un Arte hecho Masaje»
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Foto trabajando */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido */}
            <div className="order-2 lg:order-1">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                Mi filosofía
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Creo profundamente en el poder sanador del cuerpo cuando le damos
                las herramientas correctas. No creo en soluciones rápidas ni
                invasivas. Creo en el toque consciente, en los aceites esenciales
                puros, en la respiración como puente entre cuerpo y mente.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Cada tratamiento que ofrezco está diseñado para ir más allá de lo
                estético. Es una experiencia integral donde la música, los aromas,
                el ambiente y cada movimiento están pensados para que tu cuerpo
                recuerde su capacidad natural de sanarse y renovarse.
              </p>
              <p className="text-gray-700 leading-relaxed">
                El método LINFOREDUCTOX es el resultado de años de estudio,
                práctica y la combinación perfecta entre tradición y ciencia.
                Es mi manera de honrar las enseñanzas ancestrales mientras
                abrazo la innovación.
              </p>
            </div>

            {/* Foto trabajando */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image
                src="/alin-vidal.jpg"
                alt="Alin Vidal trabajando"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Formación */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-12 text-center">
            Formación y Certificaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formacion.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 bg-cream p-6 rounded-xl"
              >
                <span className="text-secondary text-2xl">✦</span>
                <p className="text-gray-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiencia */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12 text-center">
            Mi experiencia en números
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiencia.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.titulo} className="text-center">
                  <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Icon size={40} className="text-secondary" />
                  </div>
                  <h3 className="font-heading text-3xl font-bold mb-3">
                    {item.titulo}
                  </h3>
                  <p className="text-white/90 text-lg">{item.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            ¿Lista para transformar tu cuerpo?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Reserva tu sesión y experimenta el poder del método LINFOREDUCTOX
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