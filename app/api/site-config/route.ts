// app/api/site-config/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst();

    // Si no existe, crear uno por defecto
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          primaryColor: '#2C5F2D',
          primaryDark: '#1e3d1f',
          secondaryColor: '#A27B5C',
          secondaryLight: '#b89171',
          creamColor: '#F5F1E8',
          textColor: '#1F2937',
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}