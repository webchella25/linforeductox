// scripts/migrate-categories.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Paso 1: Creando categorías...');

  const categories = [
    {
      name: 'Corporal',
      slug: 'corporal',
      description: 'Tratamientos corporales para tu bienestar',
      color: '#3B82F6',
      icon: '💆‍♀️',
      gradient: 'from-blue-600/90 via-blue-500/80 to-blue-700/90',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2000',
      order: 1,
    },
    {
      name: 'Facial',
      slug: 'facial',
      description: 'Tratamientos faciales y cuidado de la piel',
      color: '#EC4899',
      icon: '✨',
      gradient: 'from-pink-600/90 via-pink-500/80 to-pink-700/90',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2000',
      order: 2,
    },
    {
      name: 'Acupuntura',
      slug: 'acupuntura',
      description: 'Medicina tradicional china y acupuntura',
      color: '#10B981',
      icon: '🌿',
      gradient: 'from-green-600/90 via-green-500/80 to-green-700/90',
      imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2000',
      order: 3,
    },
  ];

  const createdCategories: any = {};

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    createdCategories[category.slug] = created;
    console.log(`✅ Categoría creada: ${category.name} (ID: ${created.id})`);
  }

  console.log('\n🔄 Paso 2: Migrando servicios de string a relación...');

  // Obtener todos los servicios
  const services = await prisma.service.findMany();

  for (const service of services) {
    // Usar la columna vieja "category" (string) para determinar la nueva categoryId
    const oldCategory = service.category.toLowerCase();
    
    let categoryId = createdCategories['corporal'].id; // Por defecto

    if (oldCategory === 'facial') {
      categoryId = createdCategories['facial'].id;
    } else if (oldCategory === 'acupuntura') {
      categoryId = createdCategories['acupuntura'].id;
    } else if (oldCategory === 'corporal') {
      categoryId = createdCategories['corporal'].id;
    }

    await prisma.service.update({
      where: { id: service.id },
      data: { categoryId },
    });

    console.log(`✅ "${service.name}" (${service.category}) → ${categoryId}`);
  }

  console.log('\n🎉 ¡Migración completada! Ahora puedes eliminar la columna "category" vieja');
  console.log('📝 Siguiente paso: Actualiza el schema y ejecuta "npx prisma db push" de nuevo');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });