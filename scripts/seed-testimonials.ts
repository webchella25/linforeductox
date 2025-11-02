// scripts/seed-testimonials.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testimonials = [
  {
    name: 'Cliente 1',
    rating: 5,
    text: 'Desde la primera sesión tuve una sensación de ligereza a la que no estaba acostumbrada, como si todo mi cuerpo pudiera respirar.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 2',
    rating: 5,
    text: 'Noté cómo mi abdomen se desinflamó, mi piel comenzó a brillar y mi energía cambió por completo.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 3',
    rating: 5,
    text: 'No es solo un masaje… es una experiencia de renovación, por dentro y por fuera.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 4',
    rating: 5,
    text: 'Salí con la sensación de que era una mujer nueva.',
    service: 'Tratamiento Facial',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 5',
    rating: 5,
    text: 'He probado los masajes linfáticos con varios profesionales, nunca antes tuve la sensación de sentirme tan guapa por dentro.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 6',
    rating: 5,
    text: 'Desde la primera sesión del masaje Linforeductox Alma Fémina, noté mi piel más tonificada y que mi cintura, muslos y nalgas resaltaban más sus curvas.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 7',
    rating: 5,
    text: 'La combinación de técnicas de drenaje linfático, madero, olores y el entorno de relajación y tranquilidad que Aline genera me aportan un gran bienestar.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 8',
    rating: 5,
    text: 'Yo sé lo que es el drenaje linfático y con Aline lo hago a menudo porque, la forma como ella lo interpreta, es única.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 9',
    rating: 5,
    text: 'Sentí que algo dentro de mí se desbloqueó y salió a luz.',
    service: 'Acupuntura',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 10',
    rating: 5,
    text: 'Mi digestión mejora cuando hago el Linforeductox; duermo profundamente y mi cuerpo se siente más liviano, en equilibrio.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 11',
    rating: 5,
    text: 'Al ver mi cuerpo en el espejo sentí un cambio de vibra.',
    service: 'Tratamiento Facial',
    status: 'APPROVED',
  },
  {
    name: 'Cliente 12',
    rating: 5,
    text: 'Gracias, Aline, por ayudarme a recordar mi energía femenina y mi bienestar natural.',
    service: 'LINFOREDUCTOX Corporal',
    status: 'APPROVED',
  },
];

async function main() {
  console.log('🌱 Insertando testimonios...');

  // Eliminar testimonios existentes (opcional)
  await prisma.testimonial.deleteMany({});

  // Insertar nuevos testimonios
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  console.log('✅ Testimonios insertados correctamente');
  console.log(`📊 Total: ${testimonials.length} testimonios`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });