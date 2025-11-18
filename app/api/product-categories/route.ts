// app/api/product-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const productCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional().nullable(),
  icon: z.string().default('📦'),
  active: z.boolean().default(true),
  order: z.number().default(0),
});

// GET - Listar categorías (público para la tienda)
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return NextResponse.json(
      { error: 'Error obteniendo categorías' },
      { status: 500 }
    );
  }
}

// POST - Crear categoría (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productCategorySchema.parse(body);

    // Verificar que el slug no exista
    const existing = await prisma.productCategory.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese slug' },
        { status: 400 }
      );
    }

    const category = await prisma.productCategory.create({
      data: validatedData,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creando categoría:', error);
    return NextResponse.json(
      { error: 'Error creando categoría' },
      { status: 500 }
    );
  }
}