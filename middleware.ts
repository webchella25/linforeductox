// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export default auth(async (req) => {
  const isAuthenticated = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const pathname = req.nextUrl.pathname;

  // ✅ 1. AUTH LOGIC (lo que ya tenías)
  // Si está en login y autenticado → redirigir a dashboard
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Si está en dashboard y NO autenticado → redirigir a login
  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ✅ 2. REDIRECTS LOGIC (nuevo - solo para rutas públicas)
  // NO aplicar redirecciones en dashboard, API, archivos estáticos
  const shouldCheckRedirects = 
    !isDashboard && 
    !pathname.startsWith('/api') && 
    !pathname.startsWith('/_next') && 
    !pathname.startsWith('/login') &&
    !pathname.includes('.');

  if (shouldCheckRedirects) {
    try {
      // Buscar redirección en la BD
      const redirect = await prisma.redirect.findUnique({
        where: {
          source: pathname,
          active: true,
        },
      });

      if (redirect) {
        // Incrementar contador (sin await para no bloquear)
        prisma.redirect.update({
          where: { id: redirect.id },
          data: {
            hits: { increment: 1 },
            lastHit: new Date(),
          },
        }).catch(err => console.error('Error updating redirect hits:', err));

        // Aplicar redirección 301 o 302
        const url = req.nextUrl.clone();
        url.pathname = redirect.destination;

        return NextResponse.redirect(url, {
          status: redirect.permanent ? 301 : 302,
        });
      }
    } catch (error) {
      console.error('Error checking redirects:', error);
      // Si hay error, continuar normal (no romper la web)
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Auth routes
    '/dashboard/:path*', 
    '/login',
    // Public routes (para redirects)
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};