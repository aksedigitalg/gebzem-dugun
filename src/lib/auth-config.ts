import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Edge-uyumlu auth konfigürasyonu.
 * Prisma adapter ve bcrypt'i içermez (bunlar yalnızca Node runtime'da çalışır).
 * `auth.ts` (full) bu konfige adapter'ı ekler.
 */
export const authConfig = {
  pages: {
    signIn: "/giris",
    signOut: "/cikis",
    error: "/giris",
    verifyRequest: "/email-dogrula",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      // Asıl authorize fonksiyonu auth.ts içinde override edilir.
      authorize: async () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const requiresAdmin = nextUrl.pathname.startsWith("/admin");
      const requiresFirm = nextUrl.pathname.startsWith("/firma-paneli");
      const requiresAccount = nextUrl.pathname.startsWith("/hesabim");

      if (requiresAdmin) {
        return isLoggedIn && (role === "ADMIN" || role === "SUPER_ADMIN");
      }
      if (requiresFirm) {
        return isLoggedIn && (role === "FIRM_OWNER" || role === "FIRM_STAFF" || role === "ADMIN" || role === "SUPER_ADMIN");
      }
      if (requiresAccount) {
        return isLoggedIn;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export { credentialsSchema };
