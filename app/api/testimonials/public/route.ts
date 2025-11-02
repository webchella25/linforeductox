// app/api/testimonials/public/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const testimonialSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  service: z.string().min(1, 'Debes seleccionar un servicio'),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, 'El testimonio debe tener al menos 10 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonial.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        service: validatedData.service,
        rating: validatedData.rating,
        text: validatedData.text,
        status: 'PENDING', // Pendiente de aprobación
      },
    });

    // TODO: Enviar email a Aline notificando nuevo testimonio

    return NextResponse.json({
      success: true,
      message: 'Testimonio enviado correctamente',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creando testimonio:', error);
    return NextResponse.json(
      { error: 'Error al enviar el testimonio' },
      { status: 500 }
    );
  }
}