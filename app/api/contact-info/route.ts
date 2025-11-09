// app/api/contact-info/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ✅ ARREGLADO: Usar zipCode en lugar de postalCode
const contactInfoSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),  // ✅ CAMBIO: postalCode → zipCode
  bufferMinutes: z.number().min(0).max(60).optional(),
});

// GET - Obtener info de contacto
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const contactInfo = await prisma.contactInfo.findFirst();

    if (!contactInfo) {
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
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    // ✅ Log para debug
    console.log('📝 Contact Info recibido:', body);
    
    const validatedData = contactInfoSchema.parse(body);
    
    console.log('✅ Contact Info validado:', validatedData);

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
      console.error('❌ Zod validation error:', error.issues);
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
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