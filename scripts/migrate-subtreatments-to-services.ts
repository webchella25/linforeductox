// scripts/migrate-subtreatments-to-services.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string, serviceSlug: string): string {
  const baseName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Agregar sufijo del servicio padre para evitar colisiones
  return `${baseName}`;
}

async function main() {
  console.log('🔄 Iniciando migración de SubTreatments a Services...\n');

  // 1. Obtener todos los SubTreatments
  const subTreatments = await prisma.subTreatment.findMany({
    include: {
      service: {
        include: {
          categoryRel: true,
        },
      },
    },
  });

  if (subTreatments.length === 0) {
    console.log('ℹ️  No hay SubTreatments para migrar.');
    return;
  }

  console.log(`📊 Encontrados ${subTreatments.length} SubTreatments para migrar:\n`);

  for (const subTreatment of subTreatments) {
    console.log(`\n🔹 Migrando: "${subTreatment.name}"`);
    console.log(`   Servicio padre: "${subTreatment.service.name}"`);

    try {
      // Generar slug único
      let slug = generateSlug(subTreatment.name, subTreatment.service.slug);
      
      // Verificar si ya existe un servicio con ese slug
      const existingService = await prisma.service.findUnique({
        where: { slug },
      });

      if (existingService) {
        console.log(`   ⚠️  Ya existe un servicio con slug "${slug}", agregando sufijo...`);
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      // Crear el nuevo Service hijo
      const newService = await prisma.service.create({
        data: {
          name: subTreatment.name,
          slug: slug,
          description: subTreatment.description,
          duration: subTreatment.duration || subTreatment.service.duration, // Usar duración del subtratamiento o del padre
          price: subTreatment.service.price, // Heredar precio del padre (puedes ajustar después en el dashboard)
          
          // Heredar categoría del padre
          category: subTreatment.service.category,
          categoryId: subTreatment.service.categoryId,
          
          // ✅ IMPORTANTE: Establecer la relación padre-hijo
          parentServiceId: subTreatment.serviceId,
          
          // Imagen
          heroImage: subTreatment.imageUrl,
          images: subTreatment.imageUrl 
            ? [{ url: subTreatment.imageUrl, alt: subTreatment.name }]
            : null,
          
          // Heredar del padre (puedes personalizar después)
          benefits: subTreatment.service.benefits,
          conditions: subTreatment.service.conditions,
          
          // Control
          active: subTreatment.active,
          order: subTreatment.order,
        },
      });

      console.log(`   ✅ Creado servicio hijo: "${newService.name}"`);
      console.log(`   📝 Slug: ${newService.slug}`);
      console.log(`   🔗 Parent ID: ${newService.parentServiceId}`);

    } catch (error) {
      console.error(`   ❌ Error migrando "${subTreatment.name}":`, error);
    }
  }

  console.log('\n\n📊 Resumen de la migración:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Mostrar servicios padre con sus hijos
  const parentServices = await prisma.service.findMany({
    where: {
      parentServiceId: null, // Solo servicios padre
    },
    include: {
      childServices: {
        orderBy: { order: 'asc' },
      },
    },
  });

  for (const parent of parentServices) {
    if (parent.childServices.length > 0) {
      console.log(`📂 ${parent.name}`);
      for (const child of parent.childServices) {
        console.log(`   └─ ${child.name} (${child.slug})`);
      }
      console.log('');
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ Migración completada exitosamente!');
  console.log('\n⚠️  IMPORTANTE: Los SubTreatments originales NO han sido eliminados.');
  console.log('   Verifica que todo funciona correctamente antes de eliminarlos.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Error durante la migración:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });