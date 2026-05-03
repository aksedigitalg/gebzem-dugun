"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * Auth.js session context — client component'lerin `useSession()` ile
 * oturum bilgisine erişebilmesi için root layout'ta tüm uygulamayı sarar.
 *
 * `refetchInterval={0}` -> background polling kapalı; oturum yalnızca pencere
 * tekrar focus alınca veya manuel `update()` çağrısıyla yenilenir.
 */
export function AuthSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
