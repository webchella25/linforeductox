import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const workingHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  breakStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).nullable().optional(),
  breakEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).nullable().optional(),
  isActive: z.boolean(),
});

// GET - Obtener todos los horarios
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const workingHours = await prisma.workingHours.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json(workingHours);
  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    return NextResponse.json(
      { error: 'Error obteniendo horarios' },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar horario
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = workingHoursSchema.parse(body);

    const prismaData = {
      dayOfWeek: validatedData.dayOfWeek,
      isOpen: validatedData.isActive,
      openTime: validatedData.startTime,
      closeTime: validatedData.endTime,
      breakStart: validatedData.breakStart ?? null,
      breakEnd: validatedData.breakEnd ?? null,
    };

    const workingHour = await prisma.workingHours.upsert({
      where: { dayOfWeek: validatedData.dayOfWeek },
      update: prismaData,
      create: prismaData,
    });

    return NextResponse.json(workingHour);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error guardando horario:', error);
    return NextResponse.json(
      { error: 'Error guardando horario' },
      { status: 500 }
    );
  }
}