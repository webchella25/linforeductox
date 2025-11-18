// app/api/sales/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const saleSchema = z.object({
  productId: z.string().min(1, 'El producto es requerido'),
  clientName: z.string().min(1, 'El nombre es requerido'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(1, 'El teléfono es requerido'),
  clientNotes: z.string().optional().nullable(),
  acceptsNewsletter: z.boolean().default(false),
});

// GET - Listar ventas (solo admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    return NextResponse.json(
      { error: 'Error obteniendo ventas' },
      { status: 500 }
    );
  }
}

// POST - Crear venta (público desde la web)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = saleSchema.parse(body);

    // Verificar que el producto exista y esté activo
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product || !product.active) {
      return NextResponse.json(
        { error: 'Producto no disponible' },
        { status: 404 }
      );
    }

    // Verificar stock si está activado
    if (product.trackStock && product.stock !== null && product.stock <= 0) {
      return NextResponse.json(
        { error: 'Producto sin stock' },
        { status: 400 }
      );
    }

    // Crear la venta
    const sale = await prisma.sale.create({
      data: validatedData,
      include: {
        product: true,
      },
    });

    // Si acepta newsletter, suscribir
    if (validatedData.acceptsNewsletter) {
      await prisma.newsletter.upsert({
        where: { email: validatedData.clientEmail },
        update: {
          name: validatedData.clientName,
          source: 'sale',
          active: true,
        },
        create: {
          email: validatedData.clientEmail,
          name: validatedData.clientName,
          source: 'sale',
          active: true,
        },
      });
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creando venta:', error);
    return NextResponse.json(
      { error: 'Error creando venta' },
      { status: 500 }
    );
  }
}