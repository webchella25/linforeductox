// scripts/seed-products.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding product categories and products...');

  // Crear categoría
  const category = await prisma.productCategory.upsert({
    where: { slug: 'kits-de-masaje' },
    update: {},
    create: {
      name: 'Kits de Masaje',
      slug: 'kits-de-masaje',
      description: 'Kits completos para masajes relajantes y terapéuticos',
      icon: '💆‍♀️',
      active: true,
      order: 1,
    },
  });

  console.log('✅ Categoría creada:', category.name);

  // Crear productos de ejemplo
  const products = [
    {
      name: 'Kit de Masaje Relajante',
      slug: 'kit-masaje-relajante',
      description:
        'Kit completo para masajes relajantes con aceites esenciales de lavanda y manzanilla. Incluye aceite base, velas aromáticas y toallas de algodón suave.',
      shortDescription: 'Todo lo necesario para un masaje relajante perfecto',
      basePrice: 45.0,
      categoryId: category.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
          alt: 'Kit de masaje relajante',
        },
      ],
      stock: 10,
      trackStock: true,
      active: true,
      featured: true,
      order: 1,
    },
    {
      name: 'Kit de Masaje Descontracturante',
      slug: 'kit-masaje-descontracturante',
      description:
        'Kit especializado para masajes terapéuticos profundos. Incluye aceite de árnica, bálsamo descontracturante y rodillo de masaje.',
      shortDescription: 'Ideal para contracturas y tensión muscular',
      basePrice: 55.0,
      categoryId: category.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
          alt: 'Kit de masaje descontracturante',
        },
      ],
      stock: 8,
      trackStock: true,
      active: true,
      featured: true,
      order: 2,
    },
    {
      name: 'Kit de Masaje Facial',
      slug: 'kit-masaje-facial',
      description:
        'Kit completo para masajes faciales rejuvenecedores. Incluye rodillo de jade, gua sha, aceite facial y sérum hidratante.',
      shortDescription: 'Para un rostro radiante y rejuvenecido',
      basePrice: 65.0,
      categoryId: category.id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800',
          alt: 'Kit de masaje facial',
        },
      ],
      stock: 15,
      trackStock: true,
      active: true,
      featured: false,
      order: 3,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product as any,
    });
    console.log('✅ Producto creado:', created.name);
  }

  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });