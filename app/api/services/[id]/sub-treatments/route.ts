// app/api/services/[id]/sub-treatments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar subtratamientos de un servicio
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const subTreatments = await prisma.subTreatment.findMany({
      where: { serviceId: id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ subTreatments });
  } catch (error) {
    console.error('Error obteniendo subtratamientos:', error);
    return NextResponse.json(
      { error: 'Error al obtener subtratamientos' },
      { status: 500 }
    );
  }
}

// POST - Crear subtratamiento
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { id: serviceId } = params;
    const body = await request.json();

    const { name, description, duration, imageUrl, active, order } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Nombre y descripción son requeridos' },
        { status: 400 }
      );
    }

    const subTreatment = await prisma.subTreatment.create({
      data: {
        serviceId,
        name,
        description,
        duration: duration ? parseInt(duration) : null,
        imageUrl: imageUrl || null,
        active: active !== undefined ? active : true,
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    return NextResponse.json({ success: true, subTreatment });
  } catch (error) {
    console.error('Error creando subtratamiento:', error);
    return NextResponse.json(
      { error: 'Error al crear subtratamiento' },
      { status: 500 }
    );
  }
}