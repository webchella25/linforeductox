// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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

    // TODO: Aquí puedes implementar el envío de email
    // Por ahora solo registramos en consola
    console.log('📧 Nuevo mensaje de contacto:');
    console.log('Nombre:', name);
    console.log('Email:', email);
    console.log('Teléfono:', phone);
    console.log('Mensaje:', message);

    // TODO: Implementar envío de email con Resend, SendGrid, etc.
    // Ejemplo con Resend:
    // await resend.emails.send({
    //   from: 'contacto@linforeductox.com',
    //   to: 'aline@linforeductox.com',
    //   subject: `Nuevo mensaje de ${name}`,
    //   html: `
    //     <h2>Nuevo mensaje de contacto</h2>
    //     <p><strong>Nombre:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Teléfono:</strong> ${phone}</p>
    //     <p><strong>Mensaje:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

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