// components/Footer.tsx
import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock } from 'lucide-react';
import { prisma } from '@/lib/prisma';

async function getContactInfo() {
  try {
    return await prisma.contactInfo.findFirst();
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      take: 6,
      orderBy: { order: 'asc' },
      select: {
        name: true,
        slug: true,
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function Footer() {
  const contactInfo = await getContactInfo();
  const services = await getServices();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary to-primary-dark text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Columna 1: Sobre Nosotros */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-6">LINFOREDUCTOX</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Centro especializado en estética avanzada y medicina ancestral oriental. 
              Descubre el equilibrio perfecto entre tradición y ciencia.
            </p>
            <div className="flex gap-4">
              {contactInfo?.whatsapp && (
                <Link
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </Link>
              )}
              <Link
                href="https://www.instagram.com/linforeductox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://www.facebook.com/linforeductox"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </Link>
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6">Servicios</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/servicios/${service.slug}`}
                    className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 transition-all"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/servicios"
                  className="text-secondary hover:text-secondary-light transition-colors font-medium inline-flex items-center gap-2"
                >
                  Ver todos los servicios →
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Enlaces Rápidos */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6">Enlaces</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/aline-vidal"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 transition-all"></span>
                  Sobre Aline Vidal
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonios"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 transition-all"></span>
                  Testimonios
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 transition-all"></span>
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/reservar"
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-secondary rounded-full group-hover:w-2 transition-all"></span>
                  Reservar Cita
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-6">Contacto</h3>
            <ul className="space-y-4">
              {contactInfo?.address && (
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-secondary flex-shrink-0 mt-1" />
                  <div className="text-white/80 text-sm leading-relaxed">
                    {contactInfo.address}<br />
                    {contactInfo.zipCode} {contactInfo.city}
                  </div>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-start gap-3">
                  <Phone size={20} className="text-secondary flex-shrink-0 mt-1" />
                  <Link
                    href={`tel:${contactInfo.phone}`}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {contactInfo.phone}
                  </Link>
                </li>
              )}
              {contactInfo?.email && (
                <li className="flex items-start gap-3">
                  <Mail size={20} className="text-secondary flex-shrink-0 mt-1" />
                  <Link
                    href={`mailto:${contactInfo.email}`}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {contactInfo.email}
                  </Link>
                </li>
              )}
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-secondary flex-shrink-0 mt-1" />
                <div className="text-white/80 text-sm">
                  Lun - Vie: 9:00 - 19:00<br />
                  Sábado: 10:00 - 14:00
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p>
                © {currentYear} LINFOREDUCTOX. Todos los derechos reservados.
              </p>
              {/* ✅ ENLACES LEGALES */}
              <div className="flex items-center gap-3 md:gap-4">
                <span className="hidden md:inline text-white/20">|</span>
                <Link
                  href="/privacidad"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Privacidad
                </Link>
                <span className="text-white/20">·</span>
                <Link
                  href="/aviso-legal"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Aviso Legal
                </Link>
                <span className="text-white/20">·</span>
                <Link
                  href="/cookies"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
            <p>
              Diseñado y desarrollado por{' '}
              <Link
                href="https://www.luisgranero.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary-light transition-colors font-medium"
              >
                Luis Granero
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}