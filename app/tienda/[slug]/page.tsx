// app/tienda/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductoDetalleClient from './ProductoDetalleClient';

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        category: true,
      },
    });

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        active: true,
        id: { not: currentProductId },
      },
      include: {
        category: true,
      },
      take: 3,
      orderBy: { order: 'asc' },
    });

    return products;
  } catch (error) {
    console.error('Error fetching related products:', error);
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

async function getContactInfo() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    return contactInfo?.whatsapp || null;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Producto no encontrado - LINFOREDUCTOX',
    };
  }

  return {
    title: product.metaTitle || `${product.name} - LINFOREDUCTOX`,
    description: product.metaDescription || product.shortDescription || product.description,
  };
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, colors, whatsappNumber] = await Promise.all([
    getProduct(slug),
    getColors(),
    getContactInfo(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  return (
    <ProductoDetalleClient
      product={product}
      relatedProducts={relatedProducts}
      colors={colors}
      whatsappNumber={whatsappNumber}
    />
  );
}