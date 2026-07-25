import { NextResponse } from "next/server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") || "/dashboard"

  if (!isSupabaseConfigured()) return NextResponse.redirect(new URL("/dashboard?demo=1", url.origin))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, url.origin))
  }

  return NextResponse.redirect(new URL("/login?error=Não foi possível confirmar o acesso.", url.origin))
}
