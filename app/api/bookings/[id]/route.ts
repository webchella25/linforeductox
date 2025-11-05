// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener una reserva
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params; // ✅ AWAIT params
    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    return NextResponse.json(
      { error: 'Error al obtener reserva' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar reserva
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params; // ✅ AWAIT params
    const { id } = params;

    const body = await request.json();

    const booking = await prisma.booking.update({
      where: { id },
      data: body,
      include: { service: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    return NextResponse.json(
      { error: 'Error al actualizar reserva' },
      { status: 500 }
    );
  }
}

// DELETE - Cancelar reserva
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params; // ✅ AWAIT params
    const { id } = params;

    await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ message: 'Reserva cancelada' });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    return NextResponse.json(
      { error: 'Error al cancelar reserva' },
      { status: 500 }
    );
  }
}