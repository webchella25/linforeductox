import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import path from 'path';

// Cargar variables de entorno
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'aline@linforeductox.com';
  const password = 'admin123'; // CAMBIAR después del primer login
  const name = 'Aline Vidal';

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
    console.log('   Password:', password);
    console.log('   ID:', user.id);
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

    // Crear registro de contactInfo inicial
    const existingContact = await prisma.contactInfo.findFirst();
    
    if (!existingContact) {
      await prisma.contactInfo.create({
        data: {
          phone: '+34 123 456 789',
          email: 'info@linforeductox.com',
          whatsappNumber: '+34123456789',
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