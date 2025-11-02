// app/api/services/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Obtener servicios (público si active=true, admin para todos)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active');
    const category = searchParams.get('category');

    const where: any = {};

    // Si se pide solo activos
    if (activeOnly === 'true') {
      where.active = true;
    }

    // Filtrar por categoría
    if (category) {
      where.category = category;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        duration: true,
        price: true,
        category: true,
        benefits: true,
        conditions: true,
        active: true,
        order: true,
      },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los servicios' },
      { status: 500 }
    );
  }
}

// POST - Crear servicio (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      duration,
      price,
      category,
      benefits,
      conditions,
      active,
      order,
    } = body;

    // Validaciones básicas
    if (!name || !slug || !description || !duration || !category) {
      return NextResponse.json(
        { error: 'Campos requeridos: name, slug, description, duration, category' },
        { status: 400 }
      );
    }

    // Verificar que el slug no exista
    const existingService = await prisma.service.findUnique({
      where: { slug },
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'Ya existe un servicio con ese slug' },
        { status: 409 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        duration: parseInt(duration),
        price: price ? parseFloat(price) : null,
        category,
        benefits: benefits || [],
        conditions: conditions || [],
        active: active !== undefined ? active : true,
        order: order || 0,
      },
    });

    return NextResponse.json({
      success: true,
      service,
      message: 'Servicio creado exitosamente',
    });
  } catch (error) {
    console.error('Error creando servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear el servicio' },
      { status: 500 }
    );
  }
}