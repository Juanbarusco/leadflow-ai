import type { MissionBrief } from "@/lib/mission/brief"
import { getPlacesProvider } from "@/lib/places/provider"
import type { PlaceBusiness, PlacesSearchResult } from "@/lib/places/types"

export type GoogleBusiness = PlaceBusiness

export class GoogleAgent {
  async search(brief: MissionBrief): Promise<PlacesSearchResult> {
    return getPlacesProvider().search(brief)
  }
}

export const googleAgent = new GoogleAgent()
