// app/api/testimonials/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/lib/auth";
import { authOptions } from '@/lib/auth';

// GET - Obtener testimonios (público si status=APPROVED, admin para todos)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        rating: true,
        text: true,
        service: true,
        status: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error obteniendo testimonios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los testimonios' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar estado de testimonio (solo admin)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID y status son requeridos' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      testimonial,
      message: 'Testimonio actualizado correctamente',
    });
  } catch (error) {
    console.error('Error actualizando testimonio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el testimonio' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar testimonio (solo admin)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Testimonio eliminado correctamente',
    });
  } catch (error) {
    console.error('Error eliminando testimonio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el testimonio' },
      { status: 500 }
    );
  }
}