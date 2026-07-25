import { NextResponse } from "next/server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createOptionalClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  if (isSupabaseConfigured()) {
    const supabase = await createOptionalClient()
    await supabase?.auth.signOut()
  }

  return NextResponse.redirect(new URL("/login", request.url), 303)
}
