import { Suspense } from 'react';
import ReservarClient from './reservarclient';
import type { Metadata } from 'next';

// ✅ METADATA SEO
export const metadata: Metadata = {
  title: "Reservar Cita | LINFOREDUCTOX - Pide tu Tratamiento",
  description: "Reserva tu cita online en LINFOREDUCTOX. Elige tu tratamiento de drenaje linfático, masaje corporal, facial o acupuntura y selecciona el horario que prefieras.",
  keywords: "reservar cita, pedir cita, reservar tratamiento, drenaje linfático, masaje, acupuntura, Madrid",
  alternates: {
    canonical: "https://linforeductox.com/reservar",
  },
  openGraph: {
    title: "Reservar Cita | LINFOREDUCTOX",
    description: "Reserva tu cita online para tratamientos de estética y medicina ancestral.",
    url: "https://linforeductox.com/reservar",
    siteName: "LINFOREDUCTOX",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://linforeductox.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Reservar Cita LINFOREDUCTOX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reservar Cita | LINFOREDUCTOX",
    description: "Reserva tu cita online para tratamientos de estética y medicina ancestral.",
    images: ["https://linforeductox.com/og-image.jpg"],
  },
};

export default function ReservarPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReservarClient />
    </Suspense>
  );
}
