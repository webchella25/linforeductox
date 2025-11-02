// app/api/testimonials/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener un testimonio
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

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error al obtener testimonio:', error);
    return NextResponse.json(
      { error: 'Error al obtener testimonio' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar testimonio
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

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error al actualizar testimonio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar testimonio' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar testimonio
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

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Testimonio eliminado' });
  } catch (error) {
    console.error('Error al eliminar testimonio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar testimonio' },
      { status: 500 }
    );
  }
}