// app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://linforeductox.com';

  // Obtener servicios activos
  const services = await prisma.service.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  // Obtener eventos activos
  const events = await prisma.event.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/aline-vidal`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/testimonios`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reservar`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/eventos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tienda`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Servicios dinámicos
  const servicePages = services.map((service) => ({
    url: `${baseUrl}/servicios/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Eventos dinámicos
  const eventPages = events.map((event) => ({
    url: `${baseUrl}/eventos/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...eventPages];
}