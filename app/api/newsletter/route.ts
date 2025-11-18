// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().optional().nullable(),
  source: z.string().default('manual'),
});

// GET - Listar suscriptores (solo admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    const where: any = {};

    if (active === 'true') {
      where.active = true;
    } else if (active === 'false') {
      where.active = false;
    }

    const subscribers = await prisma.newsletter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Error obteniendo suscriptores:', error);
    return NextResponse.json(
      { error: 'Error obteniendo suscriptores' },
      { status: 500 }
    );
  }
}

// POST - Suscribirse al newsletter (público)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    // Verificar si ya existe
    const existing = await prisma.newsletter.findUnique({
      where: { email: validatedData.email },
    });

    if (existing) {
      if (!existing.active) {
        // Reactivar suscripción
        const subscriber = await prisma.newsletter.update({
          where: { email: validatedData.email },
          data: {
            active: true,
            name: validatedData.name || existing.name,
          },
        });
        return NextResponse.json({
          message: 'Suscripción reactivada correctamente',
          subscriber,
        });
      } else {
        return NextResponse.json(
          { error: 'Este email ya está suscrito' },
          { status: 400 }
        );
      }
    }

    // Crear nueva suscripción
    const subscriber = await prisma.newsletter.create({
      data: validatedData,
    });

    return NextResponse.json(
      {
        message: 'Suscripción exitosa',
        subscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error suscribiendo al newsletter:', error);
    return NextResponse.json(
      { error: 'Error al suscribirse' },
      { status: 500 }
    );
  }
}