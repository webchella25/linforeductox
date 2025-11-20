// app/api/redirects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const redirectSchema = z.object({
  source: z.string().min(1).regex(/^\//, 'Debe empezar con /'),
  destination: z.string().min(1),
  permanent: z.boolean().default(true),
  active: z.boolean().default(true),
});

// GET - Listar redirecciones
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const redirects = await prisma.redirect.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(redirects);
  } catch (error) {
    console.error('Error obteniendo redirecciones:', error);
    return NextResponse.json(
      { error: 'Error obteniendo redirecciones' },
      { status: 500 }
    );
  }
}

// POST - Crear redirección
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = redirectSchema.parse(body);

    // Verificar que no exista ya
    const existing = await prisma.redirect.findUnique({
      where: { source: validatedData.source },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una redirección para esta URL' },
        { status: 400 }
      );
    }

    const redirect = await prisma.redirect.create({
      data: validatedData,
    });

    return NextResponse.json(redirect, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creando redirección:', error);
    return NextResponse.json(
      { error: 'Error creando redirección' },
      { status: 500 }
    );
  }
}