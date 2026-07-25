import { NextResponse } from "next/server"

import { getCrmBoard } from "@/lib/repositories/crm.repository"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ mode: "demo", deals: [] })
  }

  try {
    const deals = await getCrmBoard()
    if (!deals) {
      return NextResponse.json({ error: "Sessão ou workspace indisponível." }, { status: 401 })
    }
    return NextResponse.json({ mode: "live", deals })
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Não foi possível carregar o CRM."
    const message = /crm_deals|relation .* does not exist/i.test(rawMessage)
      ? "O CRM ainda não foi instalado no Supabase. Execute a migration da Release 0.12."
      : rawMessage
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
