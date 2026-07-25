import type { MissionBrief } from "@/lib/mission/brief"
import { buildPlacesTextQuery } from "@/lib/places/query"
import type { PlaceBusiness, PlacesProvider, PlacesSearchResult } from "@/lib/places/types"
import { buildWhatsappUrl, createDataCompleteness } from "@/lib/places/utils"

const GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1"
const SEARCH_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.addressComponents",
  "places.location",
  "places.googleMapsUri",
  "places.primaryTypeDisplayName",
  "places.businessStatus",
].join(",")

const DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "addressComponents",
  "location",
  "googleMapsUri",
  "primaryTypeDisplayName",
  "businessStatus",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "rating",
  "userRatingCount",
  "regularOpeningHours",
].join(",")

type GoogleLocalizedText = {
  text?: string
  languageCode?: string
}

type GoogleAddressComponent = {
  longText?: string
  shortText?: string
  types?: string[]
}

type GooglePlace = {
  id?: string
  displayName?: GoogleLocalizedText
  formattedAddress?: string
  addressComponents?: GoogleAddressComponent[]
  location?: {
    latitude?: number
    longitude?: number
  }
  googleMapsUri?: string
  primaryTypeDisplayName?: GoogleLocalizedText
  businessStatus?: string
  nationalPhoneNumber?: string
  internationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  regularOpeningHours?: {
    openNow?: boolean
    weekdayDescriptions?: string[]
  }
}

type GoogleTextSearchResponse = {
  places?: GooglePlace[]
  nextPageToken?: string
}

export class GooglePlacesError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "GooglePlacesError"
    this.status = status
    this.code = code
  }
}

function envInteger(name: string, fallback: number, minimum: number, maximum: number) {
  const parsed = Number.parseInt(process.env[name] ?? "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(maximum, Math.max(minimum, parsed))
}

function findAddressComponent(place: GooglePlace, type: string, preferShort = false) {
  const component = place.addressComponents?.find((item) => item.types?.includes(type))
  return preferShort ? component?.shortText || component?.longText : component?.longText || component?.shortText
}

function normalizePlace(place: GooglePlace): PlaceBusiness | null {
  if (!place.id || !place.displayName?.text) return null

  const city =
    findAddressComponent(place, "locality") ||
    findAddressComponent(place, "administrative_area_level_2") ||
    findAddressComponent(place, "sublocality") ||
    "Cidade não informada"
  const state = findAddressComponent(place, "administrative_area_level_1")
  const stateCode = findAddressComponent(place, "administrative_area_level_1", true)
  const postalCode = findAddressComponent(place, "postal_code")
  const phone = place.nationalPhoneNumber
  const internationalPhone = place.internationalPhoneNumber

  const business: PlaceBusiness = {
    id: place.id,
    placeId: place.id,
    name: place.displayName.text,
    city,
    state,
    stateCode,
    postalCode,
    address: place.formattedAddress || "Endereço não informado",
    phone,
    internationalPhone,
    whatsappUrl: buildWhatsappUrl(phone, internationalPhone),
    website: place.websiteUri,
    mapsUrl: place.googleMapsUri,
    rating: typeof place.rating === "number" ? place.rating : 0,
    reviews: typeof place.userRatingCount === "number" ? place.userRatingCount : 0,
    category: place.primaryTypeDisplayName?.text,
    businessStatus: place.businessStatus,
    coordinates:
      typeof place.location?.latitude === "number" && typeof place.location?.longitude === "number"
        ? {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
          }
        : undefined,
    openingHours: place.regularOpeningHours
      ? {
          openNow: place.regularOpeningHours.openNow,
          weekdayDescriptions: place.regularOpeningHours.weekdayDescriptions ?? [],
        }
      : undefined,
    source: "google_places",
    dataCompleteness: {
      address: false,
      phone: false,
      website: false,
      maps: false,
      openingHours: false,
    },
  }

  business.dataCompleteness = createDataCompleteness(business)
  return business
}

async function parseGoogleError(response: Response) {
  try {
    const payload = (await response.json()) as {
      error?: {
        code?: number
        message?: string
        status?: string
      }
    }
    return {
      message: payload.error?.message || `Google Places respondeu com status ${response.status}.`,
      code: payload.error?.status,
    }
  } catch {
    return {
      message: `Google Places respondeu com status ${response.status}.`,
      code: undefined,
    }
  }
}

async function googleFetch<T>(url: string, init: RequestInit, fieldMask: string, apiKey: string): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(15_000),
  })

  if (!response.ok) {
    const parsed = await parseGoogleError(response)
    throw new GooglePlacesError(parsed.message, response.status, parsed.code)
  }

  return (await response.json()) as T
}

async function enrichPlace(place: GooglePlace, apiKey: string) {
  if (!place.id) return place

  try {
    const details = await googleFetch<GooglePlace>(
      `${GOOGLE_PLACES_BASE_URL}/places/${encodeURIComponent(place.id)}?languageCode=pt-BR&regionCode=BR`,
      { method: "GET" },
      DETAILS_FIELD_MASK,
      apiKey,
    )

    return {
      ...place,
      ...details,
      displayName: details.displayName ?? place.displayName,
      formattedAddress: details.formattedAddress ?? place.formattedAddress,
      addressComponents: details.addressComponents ?? place.addressComponents,
      location: details.location ?? place.location,
      googleMapsUri: details.googleMapsUri ?? place.googleMapsUri,
      primaryTypeDisplayName: details.primaryTypeDisplayName ?? place.primaryTypeDisplayName,
      businessStatus: details.businessStatus ?? place.businessStatus,
    }
  } catch (error) {
    console.error(`Não foi possível enriquecer o lugar ${place.id}.`, error)
    return place
  }
}

async function enrichInBatches(places: GooglePlace[], apiKey: string, concurrency = 3) {
  const enriched: GooglePlace[] = []

  for (let index = 0; index < places.length; index += concurrency) {
    const batch = places.slice(index, index + concurrency)
    const results = await Promise.all(batch.map((place) => enrichPlace(place, apiKey)))
    enriched.push(...results)
  }

  return enriched
}

export class GooglePlacesProvider implements PlacesProvider {
  async search(brief: MissionBrief): Promise<PlacesSearchResult> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim()
    if (!apiKey) {
      throw new GooglePlacesError("GOOGLE_PLACES_API_KEY não configurada.", 503, "API_KEY_MISSING")
    }

    const pageSize = envInteger("GOOGLE_PLACES_MAX_RESULTS", 8, 1, 20)
    const enrichLimit = envInteger("GOOGLE_PLACES_ENRICH_LIMIT", 8, 1, pageSize)
    const query = buildPlacesTextQuery(brief)

    const response = await googleFetch<GoogleTextSearchResponse>(
      `${GOOGLE_PLACES_BASE_URL}/places:searchText`,
      {
        method: "POST",
        body: JSON.stringify({
          textQuery: query,
          pageSize,
          languageCode: "pt-BR",
          regionCode: "BR",
          includePureServiceAreaBusinesses: true,
        }),
      },
      SEARCH_FIELD_MASK,
      apiKey,
    )

    const basicPlaces = (response.places ?? []).filter(
      (place) => place.businessStatus !== "CLOSED_PERMANENTLY",
    )

    const enriched = await enrichInBatches(basicPlaces.slice(0, enrichLimit), apiKey)
    const untouched = basicPlaces.slice(enrichLimit)
    const companies = [...enriched, ...untouched]
      .map(normalizePlace)
      .filter((company): company is PlaceBusiness => Boolean(company))

    return {
      mode: "google_places",
      companies,
      query,
      notice: "Dados empresariais consultados no Google Places em tempo real.",
    }
  }
}

export const googlePlacesProvider = new GooglePlacesProvider()
