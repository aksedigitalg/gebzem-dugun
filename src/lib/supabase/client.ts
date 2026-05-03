import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Tarayıcıda kullanılır — public bucket'lardan resim çekme, anonim okumalar için.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
