// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LINFOREDUCTOX - Estética y Medicina Ancestral Oriental en Errenteria",
  description:
    "Centro especializado en drenaje linfático, tratamientos corporales, faciales y acupuntura en Errenteria, Gipuzkoa. Descubre el método LINFOREDUCTOX de Aline Vidal.",
  keywords: "drenaje linfático, masaje corporal, tratamiento facial, acupuntura, medicina ancestral, estética avanzada, Errenteria, Gipuzkoa, País Vasco, Aline Vidal, LINFOREDUCTOX",
  authors: [{ name: "Luis Granero", url: "https://www.luisgranero.com" }],
  openGraph: {
    title: "LINFOREDUCTOX - Estética y Medicina Ancestral Oriental",
    description: "Centro especializado en drenaje linfático, tratamientos corporales, faciales y acupuntura en Errenteria, Gipuzkoa.",
    url: "https://linforeductox.com",
    siteName: "LINFOREDUCTOX",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://linforeductox.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LINFOREDUCTOX - Estética y Medicina Ancestral",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LINFOREDUCTOX - Estética y Medicina Ancestral Oriental",
    description: "Centro especializado en drenaje linfático y medicina ancestral en Errenteria",
    images: ["https://linforeductox.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://linforeductox.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ✅ Schema.org Organization - Para toda la web
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "LINFOREDUCTOX",
  description: "Centro especializado en estética avanzada y medicina ancestral oriental",
  url: "https://linforeductox.com",
  logo: "https://linforeductox.com/logo.png",
  image: "https://linforeductox.com/og-image.jpg",
  telephone: "+34-123-456-789", // ✅ Actualizar con número real
  email: "info@linforeductox.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Principal, 123", // ✅ Actualizar con dirección real
    addressLocality: "Madrid",
    addressRegion: "Madrid",
    postalCode: "28001",
    addressCountry: "ES",
  },
  geo: {
  "@type": "GeoCoordinates",
  latitude: "40.4168",
  longitude: "-3.7038"
}
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/linforeductox",
    // ✅ Añadir Facebook si tienen
  ],
  priceRange: "€€",
  areaServed: {
    "@type": "City",
    name: "Madrid",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* ✅ Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <SessionProvider>
          <Header />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#A27B5C",
                  secondary: "#fff",
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}