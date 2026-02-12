import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import path from 'path';

// Cargar variables de entorno
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'aline@linforeductox.com';
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'Aline Vidal';

  // ✅ SEGURIDAD: No permitir contraseñas hardcodeadas o débiles
  if (!password || password.length < 8) {
    console.error('❌ ERROR: Debes establecer ADMIN_PASSWORD en tu .env con al menos 8 caracteres');
    console.error('   Ejemplo: ADMIN_PASSWORD=MiContraseñaSegura123!');
    process.exit(1);
  }

  try {
    console.log('🔄 Creando usuario admin...');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      },
    });

    console.log('✅ Usuario admin creado:');
    console.log('   Email:', email);
    console.log('   ID:', user.id);
    console.log('⚠️  IMPORTANTE: La contraseña NO se muestra por seguridad');

    // Crear registro de contactInfo inicial
    const existingContact = await prisma.contactInfo.findFirst();
    
    if (!existingContact) {
      await prisma.contactInfo.create({
        data: {
          phone: '+34 123 456 789',
          email: 'info@linforeductox.com',
          whatsapp: '+34123456789',
          bufferMinutes: 15,
        },
      });
      console.log('✅ Configuración inicial creada');
    } else {
      console.log('ℹ️  Configuración de contacto ya existe');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();