// app/tienda/page.tsx
import { prisma } from '@/lib/prisma';
import TiendaClient from './TiendaClient';

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

    // ✅ Serializar para evitar problemas con Date
    return products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      category: {
        ...product.category,
        createdAt: product.category.createdAt.toISOString(),
        updatedAt: product.category.updatedAt.toISOString(),
      },
    }));
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

    // ✅ Serializar para evitar problemas con Date
    return categories.map(category => ({
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));
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

export const metadata = {
  title: 'Tienda - LINFOREDUCTOX',
  description: 'Descubre nuestros productos exclusivos de masaje y bienestar',
};

export default async function TiendaPage() {
  const [products, categories, colors] = await Promise.all([
    getProducts(),
    getCategories(),
    getColors(),
  ]);

  return <TiendaClient products={products as any} categories={categories as any} colors={colors} />;
}