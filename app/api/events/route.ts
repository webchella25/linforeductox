// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Listar eventos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const activeOnly = searchParams.get('active') === 'true';

    const where: any = {};

    if (activeOnly) {
      where.active = true;
    }

    if (status) {
      where.status = status;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: [
        { startDate: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return NextResponse.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    );
  }
}

// POST - Crear evento
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    // Verificar que el slug no exista
    if (body.slug) {
      const existing = await prisma.event.findUnique({
        where: { slug: body.slug },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Ya existe un evento con ese slug' },
          { status: 409 }
        );
      }
    }

    const event = await prisma.event.create({
      data: {
        ...body,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error creando evento:', error);
    return NextResponse.json(
      { error: 'Error al crear evento' },
      { status: 500 }
    );
  }
}