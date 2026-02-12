// app/contacto/page.tsx
import ContactForm from '@/components/ContactForm';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const revalidate = 60;

// ✅ METADATA PARA SEO
export const metadata: Metadata = {
  title: "Contacto - LINFOREDUCTOX | Reserva tu Cita en Madrid",
  description: "Contacta con LINFOREDUCTOX para reservar tu tratamiento de estética y medicina ancestral en Madrid.",
  keywords: "contacto, reservar cita, Madrid, teléfono, email, horarios",
  alternates: {
    canonical: "https://linforeductox.com/contacto",
  },
};

async function getContactContent() {
  try {
    const content = await prisma.content.findUnique({
      where: { section: 'contact_intro' },
    });
    return content;
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return null;
  }
}

// ✅ NUEVA: Obtener info de contacto desde BD
async function getContactInfo() {
  try {
    return await prisma.contactInfo.findFirst();
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

async function getWorkingHours() {
  try {
    return await prisma.workingHours.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching working hours:', error);
    return [];
  }
}

async function getBlockedDates() {
  try {
    const today = new Date();
    return await prisma.blockedDate.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: { date: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }
}

const daysOfWeek = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export default async function ContactPage() {
  const content = await getContactContent();
  const contactInfo = await getContactInfo(); // ✅ NUEVO
  const workingHours = await getWorkingHours();
  const blockedDates = await getBlockedDates();

  const title = content?.title || 'Contáctanos';
  const subtitle = content?.subtitle || 'Estamos Aquí Para Ayudarte';
  const description =
    content?.content ||
    'Si tienes alguna pregunta o deseas agendar una cita, no dudes en ponerte en contacto con nosotros.';

  // ✅ Schema.org ContactPage
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto - LINFOREDUCTOX",
    description: "Página de contacto para reservar citas y consultas",
    url: "https://linforeductox.com/contacto",
    mainEntity: {
      "@type": "MedicalBusiness",
      name: "LINFOREDUCTOX",
      telephone: contactInfo?.phone || "+34603058818",
      email: contactInfo?.email || "aline@linforeductox.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: contactInfo?.address || "Calle Viriato, 65, Chamberí",
        addressLocality: contactInfo?.city || "Madrid",
        addressRegion: "Madrid",
        postalCode: contactInfo?.zipCode || "28010",
        addressCountry: "ES",
      },
    },
  };

  // ✅ Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://linforeductox.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contacto",
        item: "https://linforeductox.com/contacto",
      },
    ],
  };

  return (
    <>
      {/* ✅ Schema.org Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="relative py-20 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">{title}</h1>
              <p className="text-2xl opacity-90 mb-6">{subtitle}</p>
              <p className="text-lg opacity-80 max-w-3xl mx-auto">{description}</p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Information */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Información de Contacto
                  </h2>
                  <div className="space-y-4">
                    {/* ✅ Dirección dinámica */}
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold">Dirección</p>
                        <p className="text-gray-600">
                          {contactInfo?.address || 'Calle Viriato, 65, Chamberí'}
                          <br />
                          {contactInfo?.zipCode || '28010'} {contactInfo?.city || 'Madrid'},
                        </p>
                      </div>
                    </div>

                    {/* ✅ Teléfono dinámico */}
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold">Teléfono</p>
                        <a 
                          href={`tel:${contactInfo?.phone || '+34603058818'}`}
                          className="text-gray-600 hover:text-primary transition-colors"
                        >
                          {contactInfo?.phone || '+34 603 058 818'}
                        </a>
                      </div>
                    </div>

                    {/* ✅ Email dinámico */}
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <a 
                          href={`mailto:${contactInfo?.email || 'aline@linforeductox.com'}`}
                          className="text-gray-600 hover:text-primary transition-colors"
                        >
                          {contactInfo?.email || 'aline@linforeductox.com'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Horario de Atención</h2>
                  </div>
                  <div className="space-y-2">
                    {workingHours.length === 0 ? (
                      <p className="text-gray-600">
                        Horarios no disponibles. Contáctanos para más información.
                      </p>
                    ) : (
                      workingHours.map((hours) => (
                        <div
                          key={hours.id}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="font-medium">
                            {daysOfWeek[hours.dayOfWeek]}
                          </span>
                          {!hours.isOpen ? (
                            <span className="text-gray-500">Cerrado</span>
                          ) : (
                            <span className="text-gray-700">
                              {hours.openTime} - {hours.closeTime}
                              {hours.breakStart && hours.breakEnd && (
                                <span className="text-sm text-gray-500 block">
                                  (Descanso: {hours.breakStart} - {hours.breakEnd})
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Blocked Dates */}
                {blockedDates.length > 0 && (
                  <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                      📅 Fechas No Disponibles
                    </h3>
                    <ul className="space-y-2">
                      {blockedDates.map((blocked) => (
                        <li key={blocked.id} className="text-yellow-800">
                          <strong>
                            {new Date(blocked.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </strong>
                          {blocked.reason && (
                            <span className="text-sm"> - {blocked.reason}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}