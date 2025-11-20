// app/api/redirects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE - Eliminar redirección
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

    await prisma.redirect.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Redirección eliminada' });
  } catch (error) {
    console.error('Error eliminando redirección:', error);
    return NextResponse.json(
      { error: 'Error eliminando redirección' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar redirección
export async function PATCH(
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

    const redirect = await prisma.redirect.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(redirect);
  } catch (error) {
    console.error('Error actualizando redirección:', error);
    return NextResponse.json(
      { error: 'Error actualizando redirección' },
      { status: 500 }
    );
  }
}