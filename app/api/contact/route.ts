// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormNotification, sendContactFormAutoReply } from '@/lib/email';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // ✅ SEGURIDAD: Rate limiting - 5 mensajes por IP cada 15 minutos
    const clientIP = getClientIP(request);
    const limiter = rateLimit(`contact:${clientIP}`, {
      maxRequests: 5,
      windowSeconds: 15 * 60,
    });

    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, espera unos minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validación básica
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // ✅ ENVIAR EMAILS
    try {
      // 1. Notificación a Aline
      await sendContactFormNotification({
        name,
        email,
        phone,
        message,
      });

      // 2. Auto-respuesta al remitente
      await sendContactFormAutoReply({
        name,
        email,
      });

      console.log('✅ Emails de contacto enviados correctamente');
    } catch (emailError) {
      console.error('❌ Error enviando emails:', emailError);
      // NO fallar el formulario si el email falla
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Mensaje enviado correctamente' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Error al procesar el formulario de contacto' },
      { status: 500 }
    );
  }
}