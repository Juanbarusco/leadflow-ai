import { createBrowserClient } from "@supabase/ssr"

import { getSupabasePublicKey, isSupabaseConfigured } from "@/lib/supabase/config"

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase não configurado. Adicione as variáveis no .env.local.")
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey(),
  )
}

export function createOptionalClient() {
  return isSupabaseConfigured() ? createClient() : null
}
