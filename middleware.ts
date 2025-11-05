// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // Protección de rutas
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ["/dashboard", "/admin"];

  if (!isLoggedIn && protectedRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

// Solo aplica auth middleware a las rutas indicadas
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
