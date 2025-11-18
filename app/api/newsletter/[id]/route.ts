// app/api/newsletter/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE - Desuscribir (solo admin)
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

    const subscriber = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Suscriptor no encontrado' },
        { status: 404 }
      );
    }

    // Marcar como inactivo en lugar de eliminar (para historial)
    await prisma.newsletter.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ message: 'Suscriptor desactivado correctamente' });
  } catch (error) {
    console.error('Error desuscribiendo:', error);
    return NextResponse.json(
      { error: 'Error al desuscribir' },
      { status: 500 }
    );
  }
}