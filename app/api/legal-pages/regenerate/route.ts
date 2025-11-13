// app/api/legal-pages/regenerate/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener datos de contacto
    const contactInfo = await prisma.contactInfo.findFirst();

    if (!contactInfo) {
      return NextResponse.json(
        { error: 'No hay información de contacto configurada' },
        { status: 400 }
      );
    }

    // Formatear dirección completa
    const fullAddress = contactInfo.address 
      ? `${contactInfo.address}${contactInfo.city ? ', ' + contactInfo.city : ''}${contactInfo.zipCode ? ', ' + contactInfo.zipCode : ''}`
      : 'Dirección pendiente de configurar';

    // Actualizar página de privacidad
    await prisma.legalPage.update({
      where: { slug: 'privacidad' },
      data: {
        content: `
<h2>1. Información al usuario</h2>
<p>LINFOREDUCTOX, en adelante RESPONSABLE, es el Responsable del tratamiento de los datos personales del Usuario y le informa que estos datos serán tratados de conformidad con lo dispuesto en el Reglamento (UE) 2016/679 de 27 de abril (GDPR) y la Ley Orgánica 3/2018 de 5 de diciembre (LOPDGDD).</p>

<h2>2. ¿Por qué tratamos sus datos personales?</h2>
<p>Para mantener una relación comercial con el usuario. Las operaciones previstas para realizar el tratamiento son:</p>
<ul>
  <li>Gestión de reservas y citas</li>
  <li>Envío de comunicaciones comerciales publicitarias por email, SMS, WhatsApp u otro medio electrónico o físico</li>
  <li>Responder a consultas del formulario de contacto</li>
  <li>Gestión de testimonios y opiniones</li>
</ul>

<h2>3. ¿Por cuánto tiempo conservaremos sus datos?</h2>
<p>Los datos se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales. Los datos no se eliminarán mientras puedan ser necesarios para el ejercicio o defensa de reclamaciones.</p>

<h2>4. ¿Cuál es la legitimación para el tratamiento de sus datos?</h2>
<p>La base legal para el tratamiento de sus datos es:</p>
<ul>
  <li>El consentimiento del usuario al reservar una cita o enviar el formulario de contacto</li>
  <li>La ejecución de un contrato de prestación de servicios</li>
  <li>El interés legítimo del responsable</li>
</ul>

<h2>5. ¿A qué destinatarios se comunicarán sus datos?</h2>
<p>Los datos no se comunicarán a ningún tercero ajeno a LINFOREDUCTOX, salvo obligación legal. No se realizan transferencias internacionales de datos.</p>

<h2>6. ¿Cuáles son sus derechos cuando nos facilita sus datos?</h2>
<p>Cualquier persona tiene derecho a obtener confirmación sobre si en LINFOREDUCTOX estamos tratando datos personales que les conciernan, o no.</p>
<p>Las personas interesadas tienen derecho a:</p>
<ul>
  <li>Solicitar el acceso a los datos personales relativos al interesado</li>
  <li>Solicitar su rectificación o supresión</li>
  <li>Solicitar la limitación de su tratamiento</li>
  <li>Oponerse al tratamiento</li>
  <li>Solicitar la portabilidad de los datos</li>
</ul>

<h2>7. ¿Cómo puede ejercer sus derechos?</h2>
<p>Puede ejercer sus derechos enviando un email a: <a href="mailto:${contactInfo.email}">${contactInfo.email}</a></p>

<h2>8. Datos de contacto del Responsable</h2>
<p>
  <strong>LINFOREDUCTOX</strong><br>
  Dirección: ${fullAddress}<br>
  Email: <a href="mailto:${contactInfo.email}">${contactInfo.email}</a><br>
  Teléfono: <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a>
  ${contactInfo.whatsapp ? `<br>WhatsApp: <a href="https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}">${contactInfo.whatsapp}</a>` : ''}
</p>

<p><em>Última actualización: ${new Date().toLocaleDateString('es-ES')}</em></p>
        `,
      },
    });

    // Actualizar aviso legal (similar...)
    await prisma.legalPage.update({
      where: { slug: 'aviso-legal' },
      data: {
        content: `
<h2>1. Datos identificativos</h2>
<p>En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos:</p>

<p>
  <strong>Titular:</strong> LINFOREDUCTOX (Aline Vidal)<br>
  <strong>Domicilio:</strong> ${fullAddress}<br>
  <strong>Email:</strong> <a href="mailto:${contactInfo.email}">${contactInfo.email}</a><br>
  <strong>Teléfono:</strong> <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a>
  ${contactInfo.whatsapp ? `<br><strong>WhatsApp:</strong> <a href="https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}">${contactInfo.whatsapp}</a>` : ''}
  <br><strong>Web:</strong> https://linforeductox.com
</p>

<h2>2. Objeto</h2>
<p>El presente aviso legal regula el uso y utilización del sitio web https://linforeductox.com, del que es titular LINFOREDUCTOX.</p>

<p>La navegación por el sitio web atribuye la condición de usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.</p>

<h2>3. Servicios</h2>
<p>A través del sitio web, LINFOREDUCTOX facilita a los usuarios el acceso y la utilización de diversos servicios y contenidos:</p>
<ul>
  <li>Información sobre tratamientos de drenaje linfático, faciales y acupuntura</li>
  <li>Sistema de reserva de citas online</li>
  <li>Formulario de contacto</li>
  <li>Publicación de testimonios</li>
</ul>

<h2>4. Responsabilidad</h2>
<p>LINFOREDUCTOX se exime de cualquier tipo de responsabilidad derivada de la información publicada en su sitio web, siempre que esta información haya sido manipulada o introducida por un tercero ajeno al mismo.</p>

<h2>5. Propiedad intelectual e industrial</h2>
<p>El sitio web, incluyendo a título enunciativo pero no limitativo su programación, edición, compilación y demás elementos necesarios para su funcionamiento, los diseños, logotipos, texto y/o gráficos son propiedad del Responsable o en su caso dispone de licencia o autorización expresa por parte de los autores.</p>

<h2>6. Ley aplicable y jurisdicción</h2>
<p>Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la que se someten expresamente las partes.</p>

<p><em>Última actualización: ${new Date().toLocaleDateString('es-ES')}</em></p>
        `,
      },
    });

    // Actualizar cookies
    await prisma.legalPage.update({
      where: { slug: 'cookies' },
      data: {
        content: `
<h2>1. ¿Qué son las cookies?</h2>
<p>Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo.</p>

<h2>2. ¿Qué tipos de cookies utiliza esta página web?</h2>

<h3>Cookies técnicas (necesarias)</h3>
<p>Son aquellas que permiten al usuario la navegación a través de la página web y la utilización de las diferentes opciones o servicios que en ella existen, incluyendo aquellas que se utilizan para permitir la gestión y operativa de la página web.</p>

<h3>Cookies de análisis</h3>
<p>Son aquellas que permiten al responsable de las mismas el seguimiento y análisis del comportamiento de los usuarios de los sitios web a los que están vinculadas, incluida la cuantificación de los impactos de los anuncios.</p>

<h2>3. Cookies utilizadas en linforeductox.com</h2>

<table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #2C5F2D; color: white;">
      <th>Cookie</th>
      <th>Tipo</th>
      <th>Finalidad</th>
      <th>Duración</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>cookie_consent</td>
      <td>Técnica</td>
      <td>Almacena las preferencias de cookies del usuario</td>
      <td>1 año</td>
    </tr>
    <tr>
      <td>next-auth.session-token</td>
      <td>Técnica</td>
      <td>Gestión de sesión de usuarios autenticados (admin)</td>
      <td>30 días</td>
    </tr>
  </tbody>
</table>

<h2>4. ¿Cómo desactivar o eliminar las cookies?</h2>
<p>Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador:</p>

<ul>
  <li><strong>Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Ayuda de Chrome</a></li>
  <li><strong>Firefox:</strong> <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer">Ayuda de Firefox</a></li>
  <li><strong>Safari:</strong> <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Ayuda de Safari</a></li>
  <li><strong>Edge:</strong> <a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener noreferrer">Ayuda de Edge</a></li>
</ul>

<h2>5. Aceptación de la Política de cookies</h2>
<p>LINFOREDUCTOX asume que usted acepta el uso de cookies si continúa navegando, considerando que se trata de una acción consciente y positiva.</p>

<h2>6. Contacto</h2>
<p>Si tiene alguna duda sobre esta Política de Cookies, puede contactar con nosotros en:</p>
<p>
  Email: <a href="mailto:${contactInfo.email}">${contactInfo.email}</a><br>
  Teléfono: <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a>
</p>

<p><em>Última actualización: ${new Date().toLocaleDateString('es-ES')}</em></p>
        `,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Páginas legales actualizadas con los nuevos datos de contacto',
    });
  } catch (error) {
    console.error('Error regenerando páginas legales:', error);
    return NextResponse.json(
      { error: 'Error al regenerar páginas legales' },
      { status: 500 }
    );
  }
}