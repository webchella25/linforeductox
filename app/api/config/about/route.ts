// app/api/config/about/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET
export async function GET() {
  try {
    let config = await prisma.aboutConfig.findFirst();
    
    if (!config) {
      config = await prisma.aboutConfig.create({
        data: {
          biography: '<p>Biografía de Aline Vidal...</p>',
        },
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo about config:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// PATCH
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    let config = await prisma.aboutConfig.findFirst();
    
    if (!config) {
      config = await prisma.aboutConfig.create({
        data: body,
      });
    } else {
      config = await prisma.aboutConfig.update({
        where: { id: config.id },
        data: body,
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando about config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}