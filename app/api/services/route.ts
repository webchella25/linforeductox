// app/api/services/route.ts (actualizar el GET)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    const parentOnly = searchParams.get('parentOnly'); // ✅ NUEVO

    const where: any = {};
    
    if (active === 'true') {
      where.active = true;
    }

    // ✅ NUEVO: Filtrar solo servicios padre
    if (parentOnly === 'true') {
      where.parentServiceId = null;
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        categoryRel: true,
      },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

// POST ya existe, no lo toques
export async function POST(request: NextRequest) {
  // ... código existente
}