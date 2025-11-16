// app/api/config/home-about/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener configuración
export async function GET() {
  try {
    let config = await prisma.homeAboutSection.findFirst();
    
    if (!config) {
      config = await prisma.homeAboutSection.create({
        data: {
          quote: "Cuando el sistema linfático fluye con libertad, la belleza y la salud emergen naturalmente. Ese es el corazón del método LINFOREDUCTOX.",
        },
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error obteniendo config:', error);
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
      label: body.label,
      name: body.name,
      subtitle: body.subtitle,
      description: body.description,
      quote: body.quote || null,
      buttonText: body.buttonText,
      buttonLink: body.buttonLink,
      image: body.image,
      imageAlt: body.imageAlt,
      active: body.active,
    };
    
    let config = await prisma.homeAboutSection.findFirst();
    
    if (!config) {
      config = await prisma.homeAboutSection.create({
        data: validData,
      });
    } else {
      config = await prisma.homeAboutSection.update({
        where: { id: config.id },
        data: validData,
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}