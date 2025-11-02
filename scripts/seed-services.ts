// scripts/seed-services.ts
import { prisma } from '../lib/prisma';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con -
    .replace(/^-+|-+$/g, ''); // Eliminar - al inicio y final
}

async function main() {
  console.log('🌱 Seeding services...');

  const services = [
    {
      name: 'Drenaje Linfático Manual',
      slug: 'drenaje-linfatico-manual',
      description: 'Técnica suave de masaje que estimula el sistema linfático para eliminar toxinas y reducir la retención de líquidos. Ideal para desintoxicar el cuerpo y mejorar la circulación.',
      duration: 60,
      price: 50,
      category: 'corporal',
      benefits: [
        'Elimina toxinas del cuerpo',
        'Reduce hinchazón y retención de líquidos',
        'Mejora la circulación sanguínea',
        'Fortalece el sistema inmunológico',
        'Reduce celulitis',
      ],
      conditions: [
        'Retención de líquidos',
        'Celulitis',
        'Post-operatorio',
        'Piernas cansadas',
      ],
      active: true,
      order: 1,
    },
    {
      name: 'Masaje Reductivo',
      slug: 'masaje-reductivo',
      description: 'Masaje intenso enfocado en eliminar grasa localizada y remodelar la figura. Combina técnicas de amasamiento profundo y presión para activar la circulación.',
      duration: 60,
      price: 55,
      category: 'corporal',
      benefits: [
        'Reduce medidas corporales',
        'Moldea la figura',
        'Combate la celulitis',
        'Tonifica la piel',
        'Mejora elasticidad',
      ],
      conditions: [
        'Grasa localizada',
        'Celulitis',
        'Flacidez',
        'Post-parto',
      ],
      active: true,
      order: 2,
    },
    {
      name: 'Presoterapia',
      slug: 'presoterapia',
      description: 'Tratamiento con botas de compresión que mejora el retorno venoso y linfático. Perfecto para piernas cansadas y retención de líquidos.',
      duration: 45,
      price: 40,
      category: 'corporal',
      benefits: [
        'Mejora circulación',
        'Alivia piernas cansadas',
        'Reduce hinchazón',
        'Elimina toxinas',
        'Previene varices',
      ],
      conditions: [
        'Piernas cansadas',
        'Varices',
        'Retención de líquidos',
        'Mala circulación',
      ],
      active: true,
      order: 3,
    },
    {
      name: 'Tratamiento Facial Kobido',
      slug: 'tratamiento-facial-kobido',
      description: 'Antigua técnica japonesa de masaje facial que rejuvenece, tonifica y reafirma la piel del rostro de forma natural.',
      duration: 60,
      price: 60,
      category: 'facial',
      benefits: [
        'Efecto lifting natural',
        'Tonifica músculos faciales',
        'Reduce arrugas y líneas',
        'Mejora circulación facial',
        'Brillo natural en la piel',
      ],
      conditions: [
        'Envejecimiento facial',
        'Arrugas',
        'Flacidez facial',
        'Piel apagada',
      ],
      active: true,
      order: 4,
    },
    {
      name: 'Limpieza Facial Profunda',
      slug: 'limpieza-facial-profunda',
      description: 'Limpieza completa que elimina impurezas, puntos negros y células muertas, dejando la piel luminosa y renovada.',
      duration: 75,
      price: 50,
      category: 'facial',
      benefits: [
        'Elimina impurezas profundas',
        'Desobstruye poros',
        'Oxigena la piel',
        'Previene acné',
        'Piel luminosa',
      ],
      conditions: [
        'Piel grasa',
        'Acné',
        'Puntos negros',
        'Poros dilatados',
      ],
      active: true,
      order: 5,
    },
    {
      name: 'Acupuntura Tradicional China',
      slug: 'acupuntura-tradicional-china',
      description: 'Medicina milenaria que equilibra la energía del cuerpo mediante la inserción de agujas en puntos específicos. Trata dolor, estrés y diversas afecciones.',
      duration: 60,
      price: 45,
      category: 'acupuntura',
      benefits: [
        'Alivia dolor crónico',
        'Reduce estrés y ansiedad',
        'Mejora sueño',
        'Equilibra energía vital',
        'Fortalece sistema inmune',
      ],
      conditions: [
        'Dolor crónico',
        'Migrañas',
        'Estrés',
        'Insomnio',
        'Ansiedad',
      ],
      active: true,
      order: 6,
    },
    {
      name: 'Auriculoterapia',
      slug: 'auriculoterapia',
      description: 'Técnica de medicina china que estimula puntos de la oreja para tratar diversas afecciones. Efectiva para control de peso y adicciones.',
      duration: 30,
      price: 30,
      category: 'acupuntura',
      benefits: [
        'Control de ansiedad',
        'Ayuda a dejar de fumar',
        'Control del apetito',
        'Reduce estrés',
        'Mejora sueño',
      ],
      conditions: [
        'Ansiedad',
        'Tabaquismo',
        'Control de peso',
        'Estrés',
      ],
      active: true,
      order: 7,
    },
    {
      name: 'Moxibustión',
      slug: 'moxibustion',
      description: 'Terapia complementaria de acupuntura que utiliza calor de artemisa para estimular puntos energéticos y mejorar el flujo de Qi.',
      duration: 45,
      price: 35,
      category: 'acupuntura',
      benefits: [
        'Mejora circulación',
        'Alivia dolor muscular',
        'Fortalece sistema inmune',
        'Equilibra energía',
        'Reduce inflamación',
      ],
      conditions: [
        'Dolor muscular',
        'Fatiga',
        'Sistema inmune débil',
        'Problemas digestivos',
      ],
      active: true,
      order: 8,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
    console.log(`✅ Service created/updated: ${service.name}`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding services:', e);
    process.exit(1);
  })
  .fina