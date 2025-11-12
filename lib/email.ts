// lib/email.ts
import { prisma } from '@/lib/prisma';

// Tipos
interface EmailRecipient {
  email: string;
  name?: string;
}

interface EmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: EmailRecipient;
}

// ✅ NUEVA FUNCIÓN: Obtener datos de contacto desde BD
async function getContactInfo() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    
    if (!contactInfo) {
      // Valores por defecto si no hay datos en BD
      return {
        phone: '+34 123 456 789',
        email: 'info@linforeductox.com',
        whatsapp: '+34123456789',
        address: 'Dirección no configurada',
      };
    }

    return {
      phone: contactInfo.phone || '+34 123 456 789',
      email: contactInfo.email || 'info@linforeductox.com',
      whatsapp: contactInfo.whatsapp || contactInfo.phone || '+34123456789',
      address: contactInfo.address 
        ? `${contactInfo.address}${contactInfo.city ? ', ' + contactInfo.city : ''}${contactInfo.zipCode ? ', ' + contactInfo.zipCode : ''}`
        : 'Dirección no configurada',
    };
  } catch (error) {
    console.error('Error obteniendo contactInfo:', error);
    // Valores por defecto en caso de error
    return {
      phone: '+34 123 456 789',
      email: 'info@linforeductox.com',
      whatsapp: '+34123456789',
      address: 'Dirección no configurada',
    };
  }
}

// Función principal para enviar emails con Brevo API
export async function sendEmail({ 
  to, 
  subject, 
  htmlContent, 
  textContent,
  replyTo 
}: EmailParams) {
  try {
    const contactInfo = await getContactInfo();

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: 'noreply@linforeductox.com',
          name: 'LINFOREDUCTOX',
        },
        to: to,
        replyTo: replyTo || {
          email: contactInfo.email, // ✅ Dinámico desde BD
          name: 'LINFOREDUCTOX',
        },
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent || htmlContent.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error de Brevo API:', error);
      throw new Error(`Brevo API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('✅ Email enviado:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// PLANTILLAS DE EMAIL
// ═══════════════════════════════════════════════════════════════

// 1. Email de confirmación de reserva (al cliente)
export async function sendBookingConfirmationToClient({
  clientName,
  clientEmail,
  serviceName,
  date,
  startTime,
  endTime,
}: {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  // ✅ Obtener datos de contacto dinámicamente
  const contactInfo = await getContactInfo();

  const subject = `✅ Reserva confirmada - ${serviceName}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C5F2D; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A27B5C; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #2C5F2D; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Reserva Confirmada!</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${clientName}</strong>,</p>
            <p>Tu reserva ha sido confirmada correctamente. Aquí están los detalles:</p>
            
            <div class="detail-box">
              <div class="detail-row">
                <span class="label">Servicio:</span> ${serviceName}
              </div>
              <div class="detail-row">
                <span class="label">Fecha:</span> ${new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div class="detail-row">
                <span class="label">Hora:</span> ${startTime} - ${endTime}
              </div>
            </div>

            <p><strong>Importante:</strong></p>
            <ul>
              <li>Por favor, llega 10 minutos antes de tu cita</li>
              <li>Si necesitas cancelar o reprogramar, contacta con nosotros lo antes posible</li>
              <li>Trae ropa cómoda y evita comidas pesadas antes de la sesión</li>
            </ul>

            <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
            <p>
              📞 Teléfono: <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a><br>
              📧 Email: <a href="mailto:${contactInfo.email}">${contactInfo.email}</a>
              ${contactInfo.whatsapp ? `<br>💬 WhatsApp: <a href="https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}">${contactInfo.whatsapp}</a>` : ''}
              ${contactInfo.address !== 'Dirección no configurada' ? `<br>📍 Dirección: ${contactInfo.address}` : ''}
            </p>

            <p>¡Nos vemos pronto!</p>
            <p><em>Equipo LINFOREDUCTOX</em></p>
          </div>
          <div class="footer">
            <p>Este email fue enviado por LINFOREDUCTOX</p>
            <p style="font-size: 12px; color: #999;">
              Desarrollado por <a href="https://luisgranero.com" style="color: #2C5F2D;">Luis Granero</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: [{ email: clientEmail, name: clientName }],
    subject,
    htmlContent,
  });
}

// 2. Notificación de nueva reserva (a Aline)
export async function sendBookingNotificationToAdmin({
  clientName,
  clientEmail,
  clientPhone,
  serviceName,
  date,
  startTime,
  endTime,
  clientNotes,
}: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  clientNotes?: string;
}) {
  // ✅ Obtener email de admin dinámicamente
  const contactInfo = await getContactInfo();

  const subject = `🔔 Nueva reserva: ${serviceName} - ${clientName}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #A27B5C; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2C5F2D; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #A27B5C; display: inline-block; width: 140px; }
          .notes-box { background-color: #FFF9E6; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #A27B5C; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Nueva Reserva</h1>
          </div>
          <div class="content">
            <p><strong>Hola Aline,</strong></p>
            <p>Has recibido una nueva reserva en tu agenda:</p>
            
            <div class="detail-box">
              <h3 style="color: #2C5F2D; margin-top: 0;">Información del Servicio</h3>
              <div class="detail-row">
                <span class="label">Servicio:</span> <strong>${serviceName}</strong>
              </div>
              <div class="detail-row">
                <span class="label">Fecha:</span> ${new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div class="detail-row">
                <span class="label">Hora:</span> ${startTime} - ${endTime}
              </div>
            </div>

            <div class="detail-box">
              <h3 style="color: #2C5F2D; margin-top: 0;">Información del Cliente</h3>
              <div class="detail-row">
                <span class="label">Nombre:</span> ${clientName}
              </div>
              <div class="detail-row">
                <span class="label">Email:</span> <a href="mailto:${clientEmail}">${clientEmail}</a>
              </div>
              <div class="detail-row">
                <span class="label">Teléfono:</span> <a href="tel:${clientPhone}">${clientPhone}</a>
              </div>
            </div>

            ${clientNotes ? `
              <div class="notes-box">
                <strong>📝 Notas del cliente:</strong>
                <p style="margin: 10px 0 0 0;">${clientNotes}</p>
              </div>
            ` : ''}

            <p style="margin-top: 30px;">
              <a href="https://linforeductox.com/dashboard/reservas" 
                 style="display: inline-block; background-color: #2C5F2D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                Ver en el Dashboard
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: [{ email: contactInfo.email, name: 'Aline Vidal' }], // ✅ Dinámico desde BD
    subject,
    htmlContent,
  });
}

// 3. Notificación de formulario de contacto (a Aline)
export async function sendContactFormNotification({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  // ✅ Obtener email de admin dinámicamente
  const contactInfo = await getContactInfo();

  const subject = `💬 Nuevo mensaje de contacto - ${name}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C5F2D; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A27B5C; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: bold; color: #2C5F2D; display: inline-block; width: 100px; }
          .message-box { background-color: #F5F1E8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Nuevo Mensaje</h1>
          </div>
          <div class="content">
            <p><strong>Hola Aline,</strong></p>
            <p>Has recibido un nuevo mensaje desde el formulario de contacto de tu web:</p>
            
            <div class="detail-box">
              <h3 style="color: #2C5F2D; margin-top: 0;">Datos de Contacto</h3>
              <div class="detail-row">
                <span class="label">Nombre:</span> ${name}
              </div>
              <div class="detail-row">
                <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
              </div>
              <div class="detail-row">
                <span class="label">Teléfono:</span> <a href="tel:${phone}">${phone}</a>
              </div>
            </div>

            <div class="message-box">
              <strong style="color: #2C5F2D;">Mensaje:</strong>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="margin-top: 30px;">
              <a href="mailto:${email}?subject=Re: Tu consulta en LINFOREDUCTOX" 
                 style="display: inline-block; background-color: #2C5F2D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                Responder por Email
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: [{ email: contactInfo.email, name: 'Aline Vidal' }], // ✅ Dinámico desde BD
    subject,
    htmlContent,
  });
}

// 4. Email de confirmación al remitente del formulario de contacto
export async function sendContactFormAutoReply({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  // ✅ Obtener datos de contacto dinámicamente
  const contactInfo = await getContactInfo();

  const subject = 'Hemos recibido tu mensaje - LINFOREDUCTOX';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2C5F2D; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Gracias por contactarnos</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${name}</strong>,</p>
            <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
            <p>Nuestro horario de atención es de <strong>lunes a viernes de 9:00 a 19:00</strong>.</p>
            <p>Si tu consulta es urgente, puedes contactarnos directamente:</p>
            <p>
              📞 Teléfono: <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a><br>
              📧 Email: <a href="mailto:${contactInfo.email}">${contactInfo.email}</a>
              ${contactInfo.whatsapp ? `<br>💬 WhatsApp: <a href="https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}">${contactInfo.whatsapp}</a>` : ''}
            </p>
            <p>¡Gracias por confiar en LINFOREDUCTOX!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: [{ email, name }],
    subject,
    htmlContent,
  });
}
