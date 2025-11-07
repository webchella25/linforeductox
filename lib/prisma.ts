// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const client = new PrismaClient().$extends(withAccelerate());

export const prisma = globalForPrisma.prisma ?? client;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma as any;
}

export default prisma;