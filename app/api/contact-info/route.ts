// app/api/contact-info/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactInfoSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  whatsappNumber: z.string().optional(),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  mapsEmbedUrl: z.string().optional(),
  bufferMinutes: z.number().min(0).max(60).optional(),
});

// GET - Obtener info de contacto
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const contactInfo = await prisma.contactInfo.findFirst();

    if (!contactInfo) {
      // Crear registro por defecto si no existe
      const newContactInfo = await prisma.contactInfo.create({
        data: {
          phone: '+34 123 456 789',
          email: 'info@linforeductox.com',
          bufferMinutes: 15,
        },
      });
      return NextResponse.json(newContactInfo);
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error obteniendo contacto:', error);
    return NextResponse.json(
      { error: 'Error obteniendo información de contacto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar info de contacto
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = contactInfoSchema.parse(body);

    // Obtener el primer registro (solo debería haber uno)
    const existing = await prisma.contactInfo.findFirst();

    if (!existing) {
      const contactInfo = await prisma.contactInfo.create({
        data: validatedData,
      });
      return NextResponse.json(contactInfo);
    }

    const contactInfo = await prisma.contactInfo.update({
      where: { id: existing.id },
      data: validatedData,
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues }, // ✅ CAMBIO
        { status: 400 }
      );
    }
    console.error('Error actualizando contacto:', error);
    return NextResponse.json(
      { error: 'Error actualizando información de contacto' },
      { status: 500 }
    );
  }
}