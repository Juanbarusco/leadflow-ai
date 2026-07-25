import type { MissionBrief } from "@/lib/mission/brief"

export type PlacesDataSource = "google_places" | "demo"

export type PlaceCoordinates = {
  latitude: number
  longitude: number
}

export type PlaceOpeningHours = {
  openNow?: boolean
  weekdayDescriptions: string[]
}

export type BusinessDataCompleteness = {
  address: boolean
  phone: boolean
  website: boolean
  maps: boolean
  openingHours: boolean
}

export type PlaceBusiness = {
  id: string
  placeId?: string
  name: string
  city: string
  state?: string
  stateCode?: string
  postalCode?: string
  address: string
  phone?: string
  internationalPhone?: string
  whatsappUrl?: string
  website?: string
  mapsUrl?: string
  rating: number
  reviews: number
  category?: string
  businessStatus?: string
  coordinates?: PlaceCoordinates
  openingHours?: PlaceOpeningHours
  source: PlacesDataSource
  dataCompleteness: BusinessDataCompleteness
}

export type PlacesSearchResult = {
  mode: PlacesDataSource
  companies: PlaceBusiness[]
  query: string
  notice: string
}

export interface PlacesProvider {
  search(brief: MissionBrief): Promise<PlacesSearchResult>
}
