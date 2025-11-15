// app/api/config/colors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener colores actuales
export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst();
    
    // Si no existe, crear con valores por defecto
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {},
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

// PATCH - Actualizar colores
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    let config = await prisma.siteConfig.findFirst();
    
    if (!config) {
      config = await prisma.siteConfig.create({
        data: body,
      });
    } else {
      config = await prisma.siteConfig.update({
        where: { id: config.id },
        data: body,
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}