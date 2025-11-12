// lib/email.ts
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

// Configurar cliente de Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Tipos
interface EmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

// Función principal para enviar emails
export async function sendEmail({ to, subject, htmlContent, textContent }: EmailParams) {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: 'noreply@linforeductox.com',
      name: 'LINFOREDUCTOX',
    };

    sendSmtpEmail.to = to;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = textContent || htmlContent.replace(/<[^>]*>/g, '');

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
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
          .button { display: inline-block; background-color: #2C5F2D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
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
            <p>📞 Teléfono: +34 123 456 789<br>
            📧 Email: info@linforeductox.com<br>
            📍 Dirección: [Tu dirección aquí]</p>

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
    to: [{ email: 'aline@linforeductox.com', name: 'Aline Vidal' }],
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
    to: [{ email: 'aline@linforeductox.com', name: 'Aline Vidal' }],
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
            <p>📞 Teléfono: +34 123 456 789<br>
            📧 Email: info@linforeductox.com</p>
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