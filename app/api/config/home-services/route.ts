// app/api/config/home-services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener configuración
export async function GET() {
  try {
    let config = await prisma.homeServicesSection.findFirst();
    
    if (!config) {
      // Obtener los primeros 3 servicios activos por defecto
      const defaultServices = await prisma.service.findMany({
        where: { active: true },
        take: 3,
        orderBy: { order: 'asc' },
        select: { id: true },
      });
      
      config = await prisma.homeServicesSection.create({
        data: {
          selectedServices: defaultServices.map(s => s.id),
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
    
    // Validar que haya entre 3 y 6 servicios
    if (body.selectedServices) {
      if (body.selectedServices.length < 3) {
        return NextResponse.json(
          { error: 'Debes seleccionar al menos 3 servicios' },
          { status: 400 }
        );
      }
      if (body.selectedServices.length > 6) {
        return NextResponse.json(
          { error: 'Puedes seleccionar máximo 6 servicios' },
          { status: 400 }
        );
      }
    }
    
    const validData = {
      title: body.title,
      subtitle: body.subtitle || null,
      active: body.active,
      selectedServices: body.selectedServices,
    };
    
    let config = await prisma.homeServicesSection.findFirst();
    
    if (!config) {
      config = await prisma.homeServicesSection.create({
        data: validData,
      });
    } else {
      config = await prisma.homeServicesSection.update({
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