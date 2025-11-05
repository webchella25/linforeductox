import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log("❌ [AUTH] Usuario no encontrado:", credentials.email);
          throw new Error("Usuario no encontrado");
        }

        const valid = await bcrypt.compare(credentials.password, user.password);

        if (!valid) {
          console.log("❌ [AUTH] Contraseña incorrecta:", credentials.email);
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
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// ✅ Añade esta línea para que puedas usar getServerSession con authOptions
export const authOptions = authConfig;