// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener contenido (público o por sección)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      // Obtener contenido de una sección específica
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
    } else {
      // Obtener todo el contenido
      const contents = await prisma.content.findMany({
        orderBy: { section: 'asc' },
      });
      return NextResponse.json(contents);
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Error al obtener contenido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar contenido (requiere autenticación)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, title, subtitle, content } = body;

    if (!section) {
      return NextResponse.json(
        { error: 'Sección requerida' },
        { status: 400 }
      );
    }

    const updatedContent = await prisma.content.upsert({
      where: { section },
      update: {
        title,
        subtitle,
        content,
        updatedAt: new Date(),
      },
      create: {
        section,
        title,
        subtitle,
        content,
      },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Error al actualizar contenido' },
      { status: 500 }
    );
  }
}