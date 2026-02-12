// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { sendBookingConfirmationToClient, sendBookingNotificationToAdmin } from '@/lib/email';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

const bookingSchema = z.object({
  serviceId: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(9),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  clientNotes: z.string().optional(),
  source: z.string().optional(), // ✅ NUEVO: para saber si vino por whatsapp o email
});

// POST - Crear nueva reserva
export async function POST(request: NextRequest) {
  try {
    // ✅ SEGURIDAD: Rate limiting - 10 reservas por IP cada 30 minutos
    const clientIP = getClientIP(request);
    const limiter = rateLimit(`bookings:${clientIP}`, {
      maxRequests: 10,
      windowSeconds: 30 * 60,
    });

    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, espera unos minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Crear reserva en BD
    const booking = await prisma.booking.create({
      data: {
        serviceId: validatedData.serviceId,
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientPhone: validatedData.clientPhone,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        clientNotes: validatedData.clientNotes,
        status: 'PENDING',
      },
      include: {
        service: true,
      },
    });

    // ✅ ENVIAR EMAILS
    try {
      // 1. Email al cliente
      await sendBookingConfirmationToClient({
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        serviceName: booking.service.name,
        date: validatedData.date,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
      });

      // 2. Notificación a Aline
      await sendBookingNotificationToAdmin({
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        serviceName: booking.service.name,
        date: validatedData.date,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        clientNotes: validatedData.clientNotes,
      });

      console.log('✅ Emails enviados correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando emails:', emailError);
      // NO fallar la reserva si el email falla
    }

    return NextResponse.json({
      success: true,
      booking,
      message: 'Reserva creada exitosamente. Recibirás un email de confirmación.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
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
    // ✅ SEGURIDAD: Verificar autenticación admin
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

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