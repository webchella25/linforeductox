// lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true, // ← CRÍTICO para Vercel
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('🔴 [AUTH] Credenciales faltantes');
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log('🟦 [AUTH] Intentando login con:', email);

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.error('🔴 [AUTH] Usuario no encontrado:', email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            console.error('🔴 [AUTH] Contraseña incorrecta para:', email);
            return null;
          }

          console.log('✅ [AUTH] Login correcto:', email);
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('🔴 [AUTH] Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});

export const authOptions = {
  providers: [],
};