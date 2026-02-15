// app/api/services/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

// GET - Obtener un servicio específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        faqs: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicio' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar servicio
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    
    // Extraer FAQs del body si existen
    const { faqs, heroImage, cardImage, images, ...serviceData } = body;

    // Actualizar servicio y FAQs en una transacción
    const service = await prisma.$transaction(async (tx) => {
      // 1. Actualizar datos del servicio (incluyendo imágenes)
      const updatedService = await tx.service.update({
        where: { id },
        data: {
          ...serviceData,
          heroImage: heroImage !== undefined ? heroImage : undefined,
          cardImage: cardImage !== undefined ? cardImage : undefined,
          images: images !== undefined ? images : undefined,
        },
      });

      // 2. Si hay FAQs, actualizarlos
      if (faqs && Array.isArray(faqs)) {
        // Eliminar FAQs existentes
        await tx.fAQ.deleteMany({
          where: { serviceId: id }
        });

        // Crear nuevos FAQs
        if (faqs.length > 0) {
          await tx.fAQ.createMany({
            data: faqs.map((faq: any, index: number) => ({
              serviceId: id,
              question: faq.question,
              answer: faq.answer,
              order: faq.order ?? index
            }))
          });
        }
      }

      // 3. Retornar servicio con FAQs
      return await tx.service.findUnique({
        where: { id },
        include: {
          faqs: {
            orderBy: { order: 'asc' }
          }
        }
      });
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    // Los FAQs se eliminan automáticamente por el onDelete: Cascade
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Servicio eliminado' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio' },
      { status: 500 }
    );
  }
}