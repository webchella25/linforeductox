// app/api/config/seo-analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener configuración de SEO y Analytics
export async function GET() {
  try {
    let config = await prisma.seoAnalytics.findFirst();
    
    if (!config) {
      config = await prisma.seoAnalytics.create({
        data: {},
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo SEO Analytics:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar configuración
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    const validData = {
      googleSearchConsole: body.googleSearchConsole || null,
      googleAnalyticsId: body.googleAnalyticsId || null,
      metaPixelId: body.metaPixelId || null,
      googleTagManagerId: body.googleTagManagerId || null,
    };
    
    let config = await prisma.seoAnalytics.findFirst();
    
    if (!config) {
      config = await prisma.seoAnalytics.create({
        data: validData,
      });
    } else {
      config = await prisma.seoAnalytics.update({
        where: { id: config.id },
        data: validData,
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando SEO Analytics:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}