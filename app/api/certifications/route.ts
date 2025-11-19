// app/api/certifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const certificationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  issuer: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  active: z.boolean().default(true),
  order: z.number().int().default(0),
});

// GET - Obtener certificaciones (público)
export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Error obteniendo certificaciones:', error);
    return NextResponse.json(
      { error: 'Error obteniendo certificaciones' },
      { status: 500 }
    );
  }
}

// POST - Crear certificación (admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = certificationSchema.parse(body);

    const certification = await prisma.certification.create({
      data: validatedData,
    });

    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creando certificación:', error);
    return NextResponse.json(
      { error: 'Error creando certificación' },
      { status: 500 }
    );
  }
}