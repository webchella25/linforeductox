// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // ✅ SEGURIDAD: Validar tipo MIME
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, WebP, AVIF, GIF).' },
        { status: 400 }
      );
    }

    // ✅ SEGURIDAD: Validar tamaño máximo (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB.' },
        { status: 400 }
      );
    }

    // ✅ SEGURIDAD: Validar extensión del archivo
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];
    const fileName = file.name.toLowerCase();
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
      return NextResponse.json(
        { error: 'Extensión de archivo no permitida.' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary usando promesa
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'linforeductox/services', // Carpeta en Cloudinary
            transformation: [
              { width: 1920, height: 1080, crop: 'limit' }, // Max size
              { quality: 'auto:good' }, // Optimización automática
              { fetch_format: 'auto' }, // WebP si el navegador lo soporta
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar imagen de Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: 'No se proporcionó publicId' }, { status: 400 });
    }

    // ✅ SEGURIDAD: Validar que el publicId pertenece a nuestra carpeta
    if (typeof publicId !== 'string' || !publicId.startsWith('linforeductox/')) {
      return NextResponse.json(
        { error: 'ID de imagen no válido.' },
        { status: 400 }
      );
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la imagen' },
      { status: 500 }
    );
  }
}