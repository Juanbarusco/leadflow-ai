import { NextResponse } from "next/server"

import { getLatestMission } from "@/lib/repositories/mission.repository"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ mission: null, mode: "demo" })
  }

  const mission = await getLatestMission()
  return NextResponse.json({ mission, mode: "live" })
}
