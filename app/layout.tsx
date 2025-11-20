// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';
import { prisma } from '@/lib/prisma';

// ✅ Lazy load de componentes no críticos
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,
});

const SeoAnalyticsScripts = dynamic(() => import('@/components/SeoAnalyticsScripts'), {
  ssr: false,
});

// ✅ OPTIMIZADO: Fuentes con preload y pesos específicos
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LINFOREDUCTOX - Estética y Medicina Ancestral Oriental en Madrid",
  description:
    "Centro especializado en drenaje linfático, tratamientos corporales, faciales y acupuntura en Madrid. Descubre el método LINFOREDUCTOX de Aline Vidal.",
  keywords: "drenaje linfático, masaje corporal, tratamiento facial, acupuntura, medicina ancestral, estética avanzada, Madrid, Aline Vidal, LINFOREDUCTOX",
  authors: [{ name: "Luis Granero", url: "https://www.luisgranero.com" }],
  openGraph: {
    title: "LINFOREDUCTOX - Estética y Medicina Ancestral Oriental",
    description: "Centro especializado en drenaje linfático, tratamientos corporales, faciales y acupuntura en Madrid.",
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
    description: "Centro especializado en drenaje linfático y medicina ancestral en Madrid",
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
  // ✅ NUEVO: Iconos optimizados
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

// ✅ Schema.org Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "LINFOREDUCTOX",
  description: "Centro especializado en estética avanzada y medicina ancestral oriental",
  url: "https://linforeductox.com",
  logo: "https://linforeductox.com/logo.png",
  image: "https://linforeductox.com/og-image.jpg",
  telephone: "+34-123-456-789",
  email: "info@linforeductox.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Principal, 123",
    addressLocality: "Madrid",
    addressRegion: "Madrid",
    postalCode: "28001",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "40.4168",
    longitude: "-3.7038"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "14:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/linforeductox",
    "https://www.facebook.com/linforeductox",
  ],
  priceRange: "€€",
  areaServed: {
    "@type": "City",
    name: "Madrid",
  },
};

async function getSeoConfig() {
  try {
    const config = await prisma.seoAnalytics.findFirst();
    return config;
  } catch (error) {
    console.error('Error loading SEO config:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoConfig = await getSeoConfig();

  return (
    <html lang="es">
      <head>
        {/* ✅ OPTIMIZACIÓN: Preconnect a Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Search Console */}
        {seoConfig?.googleSearchConsole && (
          <meta name="google-site-verification" content={seoConfig.googleSearchConsole} />
        )}

        {/* Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* CSS Dinámico de Colores */}
        <link rel="stylesheet" href="/api/config/colors/css" />
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
        <CookieBanner />
        <SeoAnalyticsScripts />
      </body>
    </html>
  );
}