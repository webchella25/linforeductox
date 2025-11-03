// app/api/blocked-dates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
  allDay: z.boolean().default(true),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
});

// GET - Obtener fechas bloqueadas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
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
    console.error('Error obteniendo fechas bloqueadas:', error);
    return NextResponse.json(
      { error: 'Error obteniendo fechas bloqueadas' },
      { status: 500 }
    );
  }
}

// POST - Crear fecha bloqueada
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = blockedDateSchema.parse(body);

    const blockedDate = await prisma.blockedDate.create({
      data: {
        date: new Date(validatedData.date),
        reason: validatedData.reason,
        allDay: validatedData.allDay,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
      },
    });

    return NextResponse.json(blockedDate, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues }, // ✅ CAMBIO
        { status: 400 }
      );
    }
    console.error('Error creando fecha bloqueada:', error);
    return NextResponse.json(
      { error: 'Error creando fecha bloqueada' },
      { status: 500 }
    );
  }
}