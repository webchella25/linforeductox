// app/tienda/page.tsx
import { prisma } from '@/lib/prisma';
import TiendaClient from './TiendaClient';
import type { Metadata } from 'next';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        category: true,
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
      ],
    });

    // ✅ Mapear y serializar correctamente
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { active: true },
            },
          },
        },
      },
    });

    // ✅ Serializar con JSON.parse(JSON.stringify())
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getColors() {
  try {
    let config = await prisma.siteConfig.findFirst();
    
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {},
      });
    }

    return {
      primaryColor: config.primaryColor,
      primaryDark: config.primaryDark,
      secondaryColor: config.secondaryColor,
      secondaryLight: config.secondaryLight,
      creamColor: config.creamColor,
      textColor: config.textColor,
    };
  } catch (error) {
    console.error('Error fetching colors:', error);
    return {
      primaryColor: '#2C5F2D',
      primaryDark: '#1e3d1f',
      secondaryColor: '#A27B5C',
      secondaryLight: '#b89171',
      creamColor: '#F5F1E8',
      textColor: '#1F2937',
    };
  }
}

export const metadata: Metadata = {
  title: 'Tienda de Productos de Bienestar | LINFOREDUCTOX',
  description: 'Descubre nuestros productos exclusivos de masaje, bienestar y cuidado corporal. Aceites esenciales, herramientas de masaje y más.',
  keywords: 'tienda, productos, aceites esenciales, masaje, bienestar, cuidado corporal, LINFOREDUCTOX',
  alternates: {
    canonical: 'https://linforeductox.com/tienda',
  },
  openGraph: {
    title: 'Tienda | LINFOREDUCTOX - Productos de Bienestar',
    description: 'Productos exclusivos de masaje, bienestar y cuidado corporal.',
    url: 'https://linforeductox.com/tienda',
    siteName: 'LINFOREDUCTOX',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://linforeductox.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tienda LINFOREDUCTOX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tienda | LINFOREDUCTOX',
    description: 'Productos exclusivos de masaje y bienestar.',
    images: ['https://linforeductox.com/og-image.jpg'],
  },
};

export default async function TiendaPage() {
  const [products, categories, colors] = await Promise.all([
    getProducts(),
    getCategories(),
    getColors(),
  ]);

  return <TiendaClient products={products} categories={categories} colors={colors} />;
}