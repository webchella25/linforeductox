// app/api/testimonials/public/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

const testimonialSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  service: z.string().min(1, 'Debes seleccionar un servicio').max(100),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, 'El testimonio debe tener al menos 10 caracteres').max(2000),
});

export async function POST(request: NextRequest) {
  try {
    // ✅ SEGURIDAD: Rate limiting - 3 testimonios por IP cada hora
    const clientIP = getClientIP(request);
    const limiter = rateLimit(`testimonials:${clientIP}`, {
      maxRequests: 3,
      windowSeconds: 60 * 60,
    });

    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, espera un poco.' },
        { status: 429 }
      );
    }

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
        { error: 'Datos inválidos', details: error.issues }, // ✅ CAMBIO
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