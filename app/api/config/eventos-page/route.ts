// app/api/config/eventos-page/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET - Obtener configuración de página de eventos
export async function GET() {
  try {
    let config = await prisma.eventsPageConfig.findFirst();

    if (!config) {
      config = await prisma.eventsPageConfig.create({
        data: {},
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo eventos page config:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar configuración de página de eventos
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    let config = await prisma.eventsPageConfig.findFirst();

    if (!config) {
      config = await prisma.eventsPageConfig.create({
        data: body,
      });
    } else {
      config = await prisma.eventsPageConfig.update({
        where: { id: config.id },
        data: body,
      });
    }

    revalidatePath('/eventos');

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando eventos page config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}
