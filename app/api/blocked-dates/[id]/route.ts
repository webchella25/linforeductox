import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

// DELETE - Eliminar fecha bloqueada
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.blockedDate.delete({
      where: { id: params.id },
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