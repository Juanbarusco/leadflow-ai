import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getSupabasePublicKey, isSupabaseConfigured } from "@/lib/supabase/config"

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não configurado. Adicione as variáveis no .env.local.")
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server Components cannot always mutate cookies. The proxy refreshes them.
          }
        },
      },
    },
  )
}

export async function createOptionalClient() {
  return isSupabaseConfigured() ? createClient() : null
}
