"use client";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-heading text-3xl font-bold mb-4">
              LINFOREDUCTOX
            </h2>
            <p className="text-white/80 mb-6 max-w-md">
              Fusionamos medicina ancestral oriental con tecnología natural
              avanzada para tu bienestar integral.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.open('https://instagram.com', '_blank')}
                className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors cursor-pointer"
              >
                <Instagram size={20} />
              </button>
              <button
                onClick={() => window.open('https://facebook.com', '_blank')}
                className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors cursor-pointer"
              >
                <Facebook size={20} />
              </button>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">
              Enlaces
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/servicios"
                  className="text-white/80 hover:text-secondary transition-colors"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-white/80 hover:text-secondary transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-white/80 hover:text-secondary transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>Madrid, España</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="flex-shrink-0" />
                <span className="hover:text-secondary transition-colors">
                  +34 123 456 789
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0" />
                <span className="hover:text-secondary transition-colors">
                  info@linforeductox.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/60">
          <p>
            © {new Date().getFullYear()} LINFOREDUCTOX. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;