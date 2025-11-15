// app/api/config/hero/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener configuración del hero
export async function GET() {
  try {
    let config = await prisma.heroConfig.findFirst();
    
    if (!config) {
      config = await prisma.heroConfig.create({
        data: {
          description: 'Regenera y depura tu sistema linfático. Activa tu metabolismo. Esculpe tu belleza facial y corporal.',
        },
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo hero config:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar configuración del hero
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    let config = await prisma.heroConfig.findFirst();
    
    if (!config) {
      config = await prisma.heroConfig.create({
        data: body,
      });
    } else {
      config = await prisma.heroConfig.update({
        where: { id: config.id },
        data: body,
      });
    }
	
	revalidatePath('/');
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando hero config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}