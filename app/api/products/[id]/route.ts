// app/api/products/[id]/route.ts
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

// GET - Obtener producto por ID o slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Intentar buscar por ID primero, luego por slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        category: true,
        sales: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return NextResponse.json(
      { error: 'Error obteniendo producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Verificar que el producto exista
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el slug no esté en uso por otro producto
    if (validatedData.slug !== existing.slug) {
      const slugInUse = await prisma.product.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugInUse) {
        return NextResponse.json(
          { error: 'Ya existe un producto con ese slug' },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...validatedData,
        images: validatedData.images as any,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error actualizando producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error eliminando producto' },
      { status: 500 }
    );
  }
}