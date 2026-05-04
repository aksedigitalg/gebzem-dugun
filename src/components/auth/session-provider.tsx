"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * Auth.js session context — client component'lerin `useSession()` ile
 * oturum bilgisine erişebilmesi için root layout'ta tüm uygulamayı sarar.
 *
 * `key` prop'unu user.id'ye bağladık: kullanıcı değiştiğinde
 * (login/logout) provider tamamen yeniden mount olur, böylece eski
 * session state'i kalmaz ve header anında güncellenir.
 */
export function AuthSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const userId = session?.user?.id ?? "anon";
  return (
    <SessionProvider
      key={userId}
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
