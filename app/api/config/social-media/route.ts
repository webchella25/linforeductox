// app/api/config/social-media/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET
export async function GET() {
  try {
    let config = await prisma.socialMediaConfig.findFirst();
    
    if (!config) {
      config = await prisma.socialMediaConfig.create({
        data: {},
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo social media config:', error);
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
    
    let config = await prisma.socialMediaConfig.findFirst();
    
    if (!config) {
      config = await prisma.socialMediaConfig.create({
        data: body,
      });
    } else {
      config = await prisma.socialMediaConfig.update({
        where: { id: config.id },
        data: body,
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando social media config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}