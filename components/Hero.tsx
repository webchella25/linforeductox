import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070')",
        }}
      >
        <div className="overlay-dark"></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-5xl">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">
          Bienvenid@
          <span className="block text-secondary mt-2">LINFOREDUCTOX</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
          Regenera y depura tu sistema	linfático.
		  Activa tu metabolismo.
		  Esculpe tu belleza facial y corpotal
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
			<Link
            href="/servicios"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-primary transition-all"
          >
            Ver Servicios
          </Link>
		  <Link
            href="/contacto"
            className="bg-secondary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary-light transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Reserva tu Experiencia
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;