// app/api/services/[id]/sub-treatments/[subId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH - Actualizar subtratamiento
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; subId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { subId } = params;
    const body = await request.json();

    const subTreatment = await prisma.subTreatment.update({
      where: { id: subId },
      data: {
        name: body.name,
        description: body.description,
        duration: body.duration ? parseInt(body.duration) : null,
        imageUrl: body.imageUrl || null,
        active: body.active,
        order: body.order !== undefined ? parseInt(body.order) : undefined,
      },
    });

    return NextResponse.json({ success: true, subTreatment });
  } catch (error) {
    console.error('Error actualizando subtratamiento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar subtratamiento' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar subtratamiento
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; subId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { subId } = params;

    await prisma.subTreatment.delete({
      where: { id: subId },
    });

    return NextResponse.json({ success: true, message: 'Subtratamiento eliminado' });
  } catch (error) {
    console.error('Error eliminando subtratamiento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar subtratamiento' },
      { status: 500 }
    );
  }
}