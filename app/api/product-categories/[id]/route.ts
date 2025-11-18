// app/api/product-categories/[id]/route.ts
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

// GET - Obtener categoría por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
          where: { active: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    return NextResponse.json(
      { error: 'Error obteniendo categoría' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar categoría (solo admin)
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
    const validatedData = productCategorySchema.parse(body);

    // Verificar que la categoría exista
    const existing = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el slug no esté en uso por otra categoría
    if (validatedData.slug !== existing.slug) {
      const slugInUse = await prisma.productCategory.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugInUse) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese slug' },
          { status: 400 }
        );
      }
    }

    const category = await prisma.productCategory.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error actualizando categoría:', error);
    return NextResponse.json(
      { error: 'Error actualizando categoría' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar categoría (solo admin)
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

    // Verificar que no tenga productos asociados
    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría con productos asociados' },
        { status: 400 }
      );
    }

    await prisma.productCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return NextResponse.json(
      { error: 'Error eliminando categoría' },
      { status: 500 }
    );
  }
}