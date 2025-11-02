// components/Footer.tsx

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
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </Link>
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
                  href="/aline-vidal"
                  className="text-white/80 hover:text-secondary transition-colors"
                >
                  Alin Vidal
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonios"
                  className="text-white/80 hover:text-secondary transition-colors"
                >
                  Testimonios
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
                <Link 
                  href="tel:+34123456789"
                  className="hover:text-secondary transition-colors"
                >
                  +34 123 456 789
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="flex-shrink-0" />
                <Link 
                  href="mailto:info@linforeductox.com"
                  className="hover:text-secondary transition-colors"
                >
                  info@linforeductox.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <p>
              © {new Date().getFullYear()} LINFOREDUCTOX. Todos los derechos reservados.
            </p>
            <p>
              Diseñado y desarrollado por{' '}
              <Link
                href="https://www.luisgranero.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary-light transition-colors font-medium underline"
              >
                Luis Granero
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;