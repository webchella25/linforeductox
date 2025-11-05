// app/api/content/[section]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener contenido por sección
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  try {
    const params = await context.params;
    const { section } = params;

    const content = await prisma.content.findUnique({
      where: { section },
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    return NextResponse.json(
      { error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar contenido (solo admin)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const { section } = params;
    const body = await request.json();

    const content = await prisma.content.upsert({
      where: { section },
      update: body,
      create: {
        section,
        ...body,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    return NextResponse.json(
      { error: 'Error al actualizar contenido' },
      { status: 500 }
    );
  }
}