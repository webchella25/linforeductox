// app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bookingSchema = z.object({
  serviceId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(9, 'Teléfono inválido'),
  clientNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos
    const validatedData = bookingSchema.parse(body);

    // Verificar que el servicio existe
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el slot sigue disponible
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(validatedData.date),
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: validatedData.startTime } },
              { endTime: { gt: validatedData.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: validatedData.endTime } },
              { endTime: { gte: validatedData.endTime } },
            ],
          },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Este horario ya no está disponible' },
        { status: 409 }
      );
    }

    // Crear la reserva
    const booking = await prisma.booking.create({
      data: {
        serviceId: validatedData.serviceId,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientPhone: validatedData.clientPhone,
        clientNotes: validatedData.clientNotes || null,
        status: 'PENDING',
      },
      include: {
        service: true,
      },
    });

    // TODO: Enviar email de confirmación al cliente
    // TODO: Enviar notificación a Aline

    return NextResponse.json({
      success: true,
      booking,
      message: 'Reserva creada exitosamente. Recibirás un email de confirmación pronto.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creando reserva:', error);
    return NextResponse.json(
      { error: 'Error al crear la reserva' },
      { status: 500 }
    );
  }
}

// GET para listar reservas (solo admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reservas' },
      { status: 500 }
    );
  }
}