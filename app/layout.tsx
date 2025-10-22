import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LINFOREDUCTOX - Estética Avanzada y Medicina Ancestral",
  description: "Centro de estética que fusiona medicina ancestral oriental con tecnología natural avanzada. Servicios de masajes corporales, faciales y acupuntura en Madrid.",
  keywords: "estética, medicina ancestral, masajes, acupuntura, drenaje linfático, Madrid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}