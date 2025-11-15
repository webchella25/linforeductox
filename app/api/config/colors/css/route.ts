// app/api/config/colors/css/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst();
    
    // Si no existe, usar valores por defecto
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {},
      });
    }

    // Generar CSS con las variables
    const css = `
      :root {
        --primary-color: ${config.primaryColor};
        --primary-dark: ${config.primaryDark};
        --secondary-color: ${config.secondaryColor};
        --secondary-light: ${config.secondaryLight};
        --cream-color: ${config.creamColor};
        --text-color: ${config.textColor};
      }
    `;

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=60', // Cache por 1 minuto
      },
    });
  } catch (error) {
    console.error('Error generando CSS:', error);
    // Retornar CSS con valores por defecto en caso de error
    const defaultCss = `
      :root {
        --primary-color: #2C5F2D;
        --primary-dark: #1e3d1f;
        --secondary-color: #A27B5C;
        --secondary-light: #b89171;
        --cream-color: #F5F1E8;
        --text-color: #1F2937;
      }
    `;
    return new NextResponse(defaultCss, {
      headers: {
        'Content-Type': 'text/css',
      },
    });
  }
}