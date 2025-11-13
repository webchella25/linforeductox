// app/(public)/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

async function getLegalPage(slug: string) {
  try {
    const page = await prisma.legalPage.findUnique({
      where: { slug },
    });
    return page;
  } catch (error) {
    console.error('Error obteniendo página legal:', error);
    return null;
  }
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug);

  if (!page) {
    return {
      title: 'Página no encontrada | LINFOREDUCTOX',
    };
  }

  return {
    title: `${page.title} | LINFOREDUCTOX`,
    description: `${page.title} de LINFOREDUCTOX - Centro de estética y medicina ancestral oriental`,
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = await getLegalPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4">
            {page.title}
          </h1>
          <p className="text-gray-600">
            Última actualización: {new Date(page.updatedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Contenido */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none
            prose-headings:font-heading prose-headings:text-primary
            prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:my-4 prose-li:text-gray-700
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-primary prose-th:text-white prose-th:p-3 prose-th:text-left
            prose-td:border prose-td:border-gray-300 prose-td:p-3"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Botón volver */}
        <div className="mt-12 text-center">
          
            href="/"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}