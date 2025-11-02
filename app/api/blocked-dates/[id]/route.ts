// app/api/blocked-dates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';

// DELETE - Eliminar fecha bloqueada
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // ✅ AWAIT params antes de usarlo
    const params = await context.params;
    const { id } = params;

    await prisma.blockedDate.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Fecha bloqueada eliminada' });
  } catch (error) {
    console.error('Error eliminando fecha bloqueada:', error);
    return NextResponse.json(
      { error: 'Error eliminando fecha bloqueada' },
      { status: 500 }
    );
  }
}