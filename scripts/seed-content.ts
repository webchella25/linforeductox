// scripts/seed-content.ts
import { prisma } from '../lib/prisma';

type ContentSeed = {
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string;
};

async function main() {
  console.log('🌱 Seeding content...');

  const contentData: ContentSeed[] = [
    {
      section: 'home_hero',
      title: '"Cuando el Sistema Linfático fluye con libertad, Tu Belleza y Salud Florecen"',
      subtitle: 'LINFOREDUCTOX',
      content: 'Una gama de experiencias personalizadas, propuesta única en Estética Avanzada, inspirada en la sabiduría de Tradiciones Ancestrales Orientales.',
    },
    {
      section: 'home_quote',
      title: null,
      subtitle: null,
      content: 'Cada masaje es una fusión que combina Ciencia, Arte y Energía',
    },
    {
      section: 'home_cta',
      title: '¿Lista para tu transformación?',
      subtitle: null,
      content: 'Cada masaje es una fusión que combina Ciencia, Arte y Energía',
    },
    {
      section: 'about_intro',
      title: 'Filosofía LINFOREDUCTOX',
      subtitle: 'Donde la Belleza y la Salud se Encuentran',
      content: 'Religar. Respirar. Renovar. Esa es la esencia del método LINFOREDUCTOX. Un espacio donde la belleza y la salud se encuentran en perfecta armonía.',
    },
    {
      section: 'about_method',
      title: 'El Método LINFOREDUCTOX',
      subtitle: 'Fusión de Tradición y Ciencia',
      content: 'Nuestro método único combina la sabiduría milenaria de la medicina oriental con técnicas modernas de estética avanzada, creando experiencias transformadoras que actúan en cuerpo, mente y espíritu.',
    },
    {
      section: 'aline_bio',
      title: 'Mi historia',
      subtitle: 'Coach corporal y facialista, diplomada en Acupuntura Estética, Osteopatía y Sistema Linfático.',
      content: `Creadora del método LINFOREDUCTOX.

Mi viaje en el mundo de la medicina oriental comenzó hace más de una década, cuando descubrí el poder transformador del toque consciente y las terapias ancestrales.

LINFOREDUCTOX nació de mi deseo de crear un espacio donde la ciencia, el arte y la energía se fusionen para ofrecer experiencias que van más allá de lo estético, llegando a la esencia del bienestar integral.`,
    },
    {
      section: 'aline_philosophy',
      title: 'Mi Filosofía',
      subtitle: null,
      content: `"Cuando el sistema linfático fluye con libertad, la belleza y la salud emergen naturalmente. Ese es el corazón del método LINFOREDUCTOX."

Creo profundamente en el poder del cuerpo para sanarse a sí mismo cuando se le proporciona el ambiente adecuado. Mi misión es guiar a cada persona en su viaje hacia el bienestar, combinando técnicas ancestrales con un toque moderno y personalizado.`,
    },
  ];

  for (const content of contentData) {
    await prisma.content.upsert({
      where: { section: content.section },
      update: content,
      create: content,
    });
    console.log(`✅ Content created/updated: ${content.section}`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });