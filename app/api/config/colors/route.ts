// app/api/config/colors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener colores actuales
export async function GET() {
  try {
    console.log('📥 GET /api/config/colors - Iniciando...');
    let config = await prisma.siteConfig.findFirst();
    
    // Si no existe, crear con valores por defecto
    if (!config) {
      console.log('⚠️ No hay config, creando una nueva...');
      config = await prisma.siteConfig.create({
        data: {},
      });
    }
    
    console.log('✅ Config obtenida:', config);
    return NextResponse.json(config);
  } catch (error) {
    console.error('❌ Error obteniendo configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración', details: String(error) },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar colores
export async function PATCH(request: NextRequest) {
  try {
    console.log('📥 PATCH /api/config/colors - Iniciando...');
    
    const session = await auth();
    console.log('🔐 Session:', session?.user);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      console.log('❌ No autorizado');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📦 Body recibido:', body);
    
    // ✅ FILTRAR solo campos válidos
    const validData = {
      primaryColor: body.primaryColor,
      primaryDark: body.primaryDark,
      secondaryColor: body.secondaryColor,
      secondaryLight: body.secondaryLight,
      creamColor: body.creamColor,
      textColor: body.textColor,
    };
    
    console.log('✅ Data filtrada:', validData);
    
    let config = await prisma.siteConfig.findFirst();
    console.log('📄 Config actual:', config);
    
    if (!config) {
      console.log('⚠️ No existe config, creando nueva...');
      config = await prisma.siteConfig.create({
        data: validData,
      });
      console.log('✅ Config creada:', config);
    } else {
      console.log('🔄 Actualizando config existente...');
      config = await prisma.siteConfig.update({
        where: { id: config.id },
        data: validData,  // ✅ Usar data filtrada
      });
      console.log('✅ Config actualizada:', config);
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('❌ Error completo actualizando configuración:', error);
    console.error('Stack:', (error as Error).stack);
    return NextResponse.json(
      { error: 'Error al actualizar configuración', details: String(error) },
      { status: 500 }
    );
  }
}