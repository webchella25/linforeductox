// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  shortDescription: z.string().optional().nullable(),
  basePrice: z.number().positive('El precio debe ser mayor a 0'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    publicId: z.string().optional(),
  })).min(1, 'Se requiere al menos una imagen'),
  stock: z.number().nullable().optional(),
  trackStock: z.boolean().default(false),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

// GET - Listar productos (público para la tienda)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (active === 'true') {
      where.active = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { sales: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error obteniendo productos' },
      { status: 500 }
    );
  }
}

// POST - Crear producto (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Verificar que el slug no exista
    const existing = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese slug' },
        { status: 400 }
      );
    }

    // Verificar que la categoría exista
    const category = await prisma.productCategory.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        images: validatedData.images as any, // Prisma Json type
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error creando producto' },
      { status: 500 }
    );
  }
}