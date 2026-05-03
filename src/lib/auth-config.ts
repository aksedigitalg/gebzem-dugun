import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-uyumlu auth konfigürasyonu (middleware tarafından import edilir).
 * Burada KESİNLİKLE Credentials, bcrypt veya Prisma OLMAMALI — bunlar yalnızca
 * Node runtime'da çalışır. Tam credentials provider `auth.ts` içinde tanımlı.
 *
 * NextAuth v5 önerilen split: https://authjs.dev/guides/edge-compatibility
 */
export const authConfig = {
  pages: {
    signIn: "/cift",
    signOut: "/",
    error: "/cift",
    verifyRequest: "/email-dogrula",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      const isAdminPanel = path.startsWith("/admin/panel");
      const isFirmDashboard = path.startsWith("/firma-paneli");
      const isCoupleAccount = path.startsWith("/hesabim");

      if (isAdminPanel) {
        return isLoggedIn && (role === "ADMIN" || role === "SUPER_ADMIN");
      }
      if (isFirmDashboard) {
        return isLoggedIn && (
          role === "FIRM_OWNER" ||
          role === "FIRM_STAFF" ||
          role === "ADMIN" ||
          role === "SUPER_ADMIN"
        );
      }
      if (isCoupleAccount) {
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
