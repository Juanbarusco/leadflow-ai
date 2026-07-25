import { NextResponse } from "next/server"

import {
  getConfiguredPlacesMode,
  isGooglePlacesConfigured,
  resolvePlacesSource,
} from "@/lib/places/provider"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const dynamic = "force-dynamic"

export async function GET() {
  const googlePlacesConfigured = isGooglePlacesConfigured()
  const supabaseConfigured = isSupabaseConfigured()

  return NextResponse.json({
    places: {
      configuredMode: getConfiguredPlacesMode(),
      activeSource: resolvePlacesSource(),
      googlePlacesConfigured,
    },
    supabase: {
      configured: supabaseConfigured,
      authAndPersistenceReady: supabaseConfigured,
    },
    readyForLiveData: googlePlacesConfigured,
    readyForAuthenticatedBeta: googlePlacesConfigured && supabaseConfigured,
  })
}
