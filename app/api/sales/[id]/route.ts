// app/api/sales/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSaleSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROCESS', 'COMPLETED', 'CANCELLED']).optional(),
  finalPrice: z.number().positive().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});

// GET - Obtener venta por ID (solo admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!sale) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error obteniendo venta:', error);
    return NextResponse.json(
      { error: 'Error obteniendo venta' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar venta (solo admin)
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
    const validatedData = updateSaleSchema.parse(body);

    // Verificar que la venta exista
    const existing = await prisma.sale.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    const updateData: any = { ...validatedData };

    // Actualizar timestamps según el estado
    if (validatedData.status === 'COMPLETED' && !existing.completedAt) {
      updateData.completedAt = new Date();
    }

    if (validatedData.status === 'CANCELLED' && !existing.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    const sale = await prisma.sale.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
      },
    });

    return NextResponse.json(sale);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error actualizando venta:', error);
    return NextResponse.json(
      { error: 'Error actualizando venta' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar venta (solo admin)
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

    const sale = await prisma.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    await prisma.sale.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando venta:', error);
    return NextResponse.json(
      { error: 'Error eliminando venta' },
      { status: 500 }
    );
  }
}