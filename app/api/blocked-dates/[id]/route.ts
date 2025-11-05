// app/api/blocked-dates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

// DELETE - Eliminar fecha bloqueada
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // ✅ Protección completa contra undefined
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

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