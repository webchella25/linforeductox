// app/testimonios/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Testimonios - LINFOREDUCTOX | Opiniones de Nuestros Clientes",
  description: "Lee las experiencias reales de nuestros clientes con los tratamientos de drenaje linfático, medicina ancestral y acupuntura en Madrid.",
  keywords: "testimonios, opiniones, reseñas, clientes satisfechos, Madrid",
  alternates: {
    canonical: "https://linforeductox.com/testimonios",
  },
};

export default function TestimoniosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}