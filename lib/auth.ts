import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { User } from "next-auth";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🟦 [AUTH] Intentando login con:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [AUTH] Faltan credenciales");
          throw new Error("Faltan credenciales");
        }

        const { email, password } = credentials as { email: string; password: string };

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log("❌ [AUTH] Usuario no encontrado:", email);
          throw new Error("Usuario no encontrado");
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          console.log("❌ [AUTH] Contraseña incorrecta:", email);
          throw new Error("Contraseña incorrecta");
        }

        console.log("✅ [AUTH] Login correcto:", user.email);

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = (user as any).role;
        token.sub = (user as any).id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        name: token.name ?? "",
        email: token.email ?? "",
        image: token.picture ?? "",
        id: token.sub ?? "",
        role: token.role as string,
      };
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export const authOptions = authConfig;