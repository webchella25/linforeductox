// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, Award } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import NewsletterForm from './NewsletterForm';
import WhatsAppButton from './WhatsAppButton'; // ✅ NUEVO IMPORT

async function getContactInfo() {
  try {
    return await prisma.contactInfo.findFirst();
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

async function getSocialMedia() {
  try {
    return await prisma.socialMediaConfig.findFirst();
  } catch (error) {
    console.error('Error fetching social media:', error);
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

async function getWorkingHours() {
  try {
    return await prisma.workingHours.findMany({
      where: { isOpen: true },
      orderBy: { dayOfWeek: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching working hours:', error);
    return [];
  }
}

async function getCertifications() {
  try {
    return await prisma.certification.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      take: 4, // Mostrar solo 4 en el footer
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}

// Función para validar URLs de redes sociales
function isValidUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default async function Footer() {
  const contactInfo = await getContactInfo();
  const socialMedia = await getSocialMedia();
  const services = await getServices();
  const workingHours = await getWorkingHours();
  const certifications = await getCertifications();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary via-primary-dark to-[#1a2f1b] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cream rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Columna 1: Logo, Descripción y Redes - 4 cols */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14">
                  <Image
                    src="/logo.png"
                    alt="LINFOREDUCTOX Logo"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                    priority
                  />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold tracking-tight">
                    LINFOREDUCTOX
                  </h3>
                  <p className="text-white/60 text-xs">Taller Linfático</p>
                </div>
              </div>
            </Link>
            
            <p className="text-white/80 leading-relaxed mb-6 text-sm">
              Especialistas en estética avanzada y medicina ancestral oriental. 
              Tu camino hacia el equilibrio perfecto entre tradición y ciencia.
            </p>

            {/* Redes Sociales */}
            {socialMedia && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-white/90">Síguenos</p>
                <div className="flex items-center gap-3">
                  {socialMedia.showInstagram && isValidUrl(socialMedia.instagram) && (
                    <Link
                      href={socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all group"
                      aria-label="Instagram"
                    >
                      <Instagram size={18} className="text-white group-hover:text-pink-300" />
                    </Link>
                  )}
                  {socialMedia.showFacebook && isValidUrl(socialMedia.facebook) && (
                    <Link
                      href={socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all group"
                      aria-label="Facebook"
                    >
                      <Facebook size={18} className="text-white group-hover:text-blue-300" />
                    </Link>
                  )}
                  {socialMedia.showTiktok && isValidUrl(socialMedia.tiktok) && (
                    <Link
                      href={socialMedia.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all group"
                      aria-label="TikTok"
                    >
                      <svg className="w-4 h-4 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </Link>
                  )}
                  {socialMedia.showYoutube && isValidUrl(socialMedia.youtube) && (
                    <Link
                      href={socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all group"
                      aria-label="YouTube"
                    >
                      <svg className="w-5 h-5 text-white group-hover:text-red-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </Link>
                  )}
                  {socialMedia.showLinkedin && isValidUrl(socialMedia.linkedin) && (
                    <Link
                      href={socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all group"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} className="text-white group-hover:text-blue-400" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Columna 2: Enlaces Rápidos - 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-xl font-bold mb-6 relative inline-block">
              Enlaces
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-secondary"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/aline-vidal"
                  className="text-white/80 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:w-2.5 transition-all"></span>
                  Sobre Aline
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="text-white/80 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:w-2.5 transition-all"></span>
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonios"
                  className="text-white/80 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:w-2.5 transition-all"></span>
                  Testimonios
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-white/80 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:w-2.5 transition-all"></span>
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/reservar"
                  className="text-white/80 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:w-2.5 transition-all"></span>
                  Reservar
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Horarios Dinámicos - 3 cols */}
          <div className="lg:col-span-3">
            <h3 className="font-heading text-xl font-bold mb-6 relative inline-block">
              Horarios
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-secondary"></span>
            </h3>
            {workingHours.length > 0 ? (
              <div className="space-y-2">
                {workingHours.map((wh) => (
                  <div key={wh.dayOfWeek} className="flex justify-between items-center text-sm">
                    <span className="text-white/70 font-medium">{daysOfWeek[wh.dayOfWeek]}</span>
                    <span className="text-white/90">
                      {wh.openTime} - {wh.closeTime}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-sm">
                Lun - Vie: 9:00 - 19:00<br />
                Sábado: 10:00 - 14:00
              </p>
            )}

            {contactInfo?.phone && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="text-xs text-white/70 mb-2">Reservas</p>
                <Link
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="text-lg font-semibold text-white hover:text-secondary transition-colors"
                >
                  {contactInfo.phone}
                </Link>
              </div>
            )}
          </div>

          {/* Columna 4: Newsletter - 3 cols */}
          <div className="lg:col-span-3">
            <h3 className="font-heading text-xl font-bold mb-6 relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-secondary"></span>
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Recibe consejos de bienestar, ofertas exclusivas y novedades.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Certificaciones */}
        {certifications.length > 0 && (
          <div className="mt-12 pt-12 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Award className="text-secondary" size={24} />
              <h3 className="font-heading text-lg font-semibold text-center">
                Certificaciones y Acreditaciones
              </h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all group"
                  title={cert.description || cert.name}
                >
                  {cert.imageUrl ? (
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <Image
                        src={cert.imageUrl}
                        alt={cert.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                      <Award size={32} className="text-secondary" />
                    </div>
                  )}
                  <p className="text-xs text-center text-white/90 font-medium">{cert.name}</p>
                  {cert.year && (
                    <p className="text-xs text-center text-white/60">{cert.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white/60">
              <p>
                © {currentYear} LINFOREDUCTOX. Todos los derechos reservados.
              </p>
              <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full"></div>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacidad"
                  className="hover:text-white transition-colors"
                >
                  Privacidad
                </Link>
                <Link
                  href="/aviso-legal"
                  className="hover:text-white transition-colors"
                >
                  Aviso Legal
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-white transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>

            {/* Developer Credit */}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>Diseñado y desarrollado por</span>
              <Link
                href="https://www.luisgranero.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary-light transition-colors font-semibold flex items-center gap-1 group"
              >
                Luis Granero
                <svg 
                  className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      {contactInfo?.whatsapp && (
        <WhatsAppButton phoneNumber={contactInfo.whatsapp} />
      )}
    </footer>
  );
}