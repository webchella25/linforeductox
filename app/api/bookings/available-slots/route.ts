// app/api/bookings/available-slots/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date'); // formato: "2025-11-15"
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
      return NextResponse.json(
        { error: 'Fecha y servicio son requeridos' },
        { status: 400 }
      );
    }

    // Obtener el servicio para conocer su duración
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Obtener día de la semana (0=Domingo, 1=Lunes, etc.)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // Verificar horario de trabajo para ese día
    const workingHours = await prisma.workingHours.findUnique({
      where: { dayOfWeek },
    });

    if (!workingHours || !workingHours.isOpen) {
      return NextResponse.json({ slots: [] });
    }

    // Verificar si la fecha está bloqueada
    const blockedDate = await prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: new Date(date + 'T00:00:00'),
          lte: new Date(date + 'T23:59:59'),
        },
        allDay: true,
      },
    });

    if (blockedDate) {
      return NextResponse.json({ slots: [] });
    }

    // Obtener configuración del buffer
    const bufferSetting = await prisma.settings.findUnique({
      where: { key: 'booking_buffer' },
    });
    const buffer = bufferSetting ? parseInt(bufferSetting.value) : 15;

    // Obtener reservas existentes para ese día
    const existingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(date + 'T00:00:00'),
          lte: new Date(date + 'T23:59:59'),
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    // Generar slots disponibles
    const slots = generateAvailableSlots(
      workingHours,
      service.duration,
      buffer,
      existingBookings
    );

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Error obteniendo slots:', error);
    return NextResponse.json(
      { error: 'Error al obtener horarios disponibles' },
      { status: 500 }
    );
  }
}

// Función auxiliar para generar slots disponibles
function generateAvailableSlots(
  workingHours: any,
  serviceDuration: number,
  buffer: number,
  existingBookings: any[]
) {
  const slots = [];
  const { openTime, closeTime, breakStart, breakEnd } = workingHours;

  if (!openTime || !closeTime) return slots;

  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);

  let currentHour = openHour;
  let currentMinute = openMinute;

  const closeTimeInMinutes = closeHour * 60 + closeMinute;

  while (true) {
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const endTimeInMinutes = currentTimeInMinutes + serviceDuration;

    // Verificar si ya pasamos la hora de cierre
    if (endTimeInMinutes > closeTimeInMinutes) break;

    const startTime = `${String(currentHour).padStart(2, '0')}:${String(
      currentMinute
    ).padStart(2, '0')}`;
    const endHour = Math.floor(endTimeInMinutes / 60);
    const endMinute = endTimeInMinutes % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(
      endMinute
    ).padStart(2, '0')}`;

    // Verificar si está en horario de descanso
    const isInBreak =
      breakStart &&
      breakEnd &&
      isTimeInRange(startTime, breakStart, breakEnd);

    // Verificar si hay conflicto con reservas existentes
    const hasConflict = existingBookings.some((booking) => {
      return (
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime)
      );
    });

    if (!isInBreak && !hasConflict) {
      slots.push({
        startTime,
        endTime,
        available: true,
      });
    }

    // Avanzar al siguiente slot (duración del servicio + buffer)
    const nextTimeInMinutes = currentTimeInMinutes + serviceDuration + buffer;
    currentHour = Math.floor(nextTimeInMinutes / 60);
    currentMinute = nextTimeInMinutes % 60;
  }

  return slots;
}

function isTimeInRange(time: string, rangeStart: string, rangeEnd: string) {
  return time >= rangeStart && time < rangeEnd;
}