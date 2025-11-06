// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ✅ NUEVO en Next.js 16: se movió de experimental a raíz
  serverExternalPackages: ['@prisma/client', 'prisma'],
  
  // ✅ Configuración vacía de turbopack para silenciar el warning
  turbopack: {},
};

export default nextConfig;