// app/contacto/page.tsx
import ContactForm from '@/components/ContactForm';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

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
  const workingHours = await getWorkingHours();
  const blockedDates = await getBlockedDates();

  const title = content?.title || 'Contáctanos';
  const subtitle = content?.subtitle || 'Estamos Aquí Para Ayudarte';
  const description =
    content?.content ||
    'Si tienes alguna pregunta o deseas agendar una cita, no dudes en ponerte en contacto con nosotros.';

  return (
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
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Dirección</p>
                      <p className="text-gray-600">
                        Calle Principal 123
                        <br />
                        20100 Errenteria, Gipuzkoa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Teléfono</p>
                      <p className="text-gray-600">+34 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">info@linforeductox.com</p>
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

              {/* Blocked Dates (if any) */}
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
  );
}