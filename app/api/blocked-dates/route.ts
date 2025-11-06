import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (debe ser YYYY-MM-DD)'),
  reason: z.string().optional(),
  allDay: z.boolean().default(true),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (debe ser HH:MM)').optional().nullable(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (debe ser HH:MM)').optional().nullable(),
});

// GET - Obtener fechas bloqueadas
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        ...(from && to && {
          date: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(blockedDates);
  } catch (error) {
    console.error('🔴 Error obteniendo fechas bloqueadas:', error);
    return NextResponse.json(
      { error: 'Error obteniendo fechas bloqueadas' },
      { status: 500 }
    );
  }
}

// POST - Crear fecha bloqueada
export async function POST(request: NextRequest) {
  try {
    console.log('🔹 POST /api/blocked-dates - Iniciando');

    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      console.log('🔴 No autorizado');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    console.log('🔹 Body recibido:', JSON.stringify(body, null, 2));

    const validationResult = blockedDateSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('🔴 Error de validación Zod:', validationResult.error.issues);
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    console.log('🔹 Datos validados:', validatedData);

    const blockedDate = await prisma.blockedDate.create({
      data: {
        date: new Date(validatedData.date),
        reason: validatedData.reason || null,
        allDay: validatedData.allDay,
        startTime: validatedData.startTime || null,
        endTime: validatedData.endTime || null,
      },
    });

    console.log('✅ Fecha bloqueada creada:', blockedDate.id);
    return NextResponse.json(blockedDate, { status: 201 });
  } catch (error: any) {
    console.error('🔴 Error creando fecha bloqueada:', error);
    console.error('🔴 Stack:', error.stack);

    return NextResponse.json(
      {
        error: 'Error creando fecha bloqueada',
        message: error.message,
      },
      { status: 500 }
    );
  }
}