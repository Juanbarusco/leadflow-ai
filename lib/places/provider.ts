import type { PlacesDataSource, PlacesProvider } from "@/lib/places/types"
import { demoPlacesProvider } from "@/lib/places/demo.provider"
import { googlePlacesProvider } from "@/lib/places/google-places.provider"

export type PlacesRuntimeMode = "auto" | "demo" | "live"

export function getConfiguredPlacesMode(): PlacesRuntimeMode {
  const configured = process.env.LEADFLOW_DATA_MODE?.trim().toLowerCase()
  if (configured === "demo" || configured === "live") return configured
  return "auto"
}

export function isGooglePlacesConfigured() {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim())
}

export function resolvePlacesSource(): PlacesDataSource {
  const mode = getConfiguredPlacesMode()
  if (mode === "demo") return "demo"
  if (mode === "live") return "google_places"
  return isGooglePlacesConfigured() ? "google_places" : "demo"
}

export function getPlacesProvider(): PlacesProvider {
  return resolvePlacesSource() === "google_places" ? googlePlacesProvider : demoPlacesProvider
}
