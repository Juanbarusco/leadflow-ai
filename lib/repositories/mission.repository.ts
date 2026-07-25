import type { Mission, MissionCompany } from "@/lib/engines/mission-engine"
import { getWorkspaceContext } from "@/lib/auth/workspace-context"

type PersistResult = {
  persisted: boolean
  reason?: string
}


export async function persistMission(mission: Mission): Promise<PersistResult> {
  try {
    const context = await getWorkspaceContext()
    if (!context) return { persisted: false, reason: "workspace-unavailable" }

    const { supabase, user, organizationId } = context

    const { error: missionError } = await supabase.from("missions").upsert({
      id: mission.id,
      organization_id: organizationId,
      created_by: user.id,
      prompt: mission.prompt,
      city: mission.city,
      niche: mission.niche,
      status: mission.status,
      progress: mission.progress,
      brief: mission.brief,
      data_source: mission.dataSource,
      data_notice: mission.dataNotice,
      search_query: mission.searchQuery,
      estimated_time: mission.estimatedTime,
      created_at: mission.createdAt,
      completed_at: mission.completedAt || null,
    })

    if (missionError) throw missionError

    const companyRows = mission.companies.map((company) => ({
      organization_id: organizationId,
      external_id: company.id,
      place_id: company.placeId || null,
      name: company.name,
      city: company.city,
      state: company.state || company.stateCode || null,
      address: company.address,
      phone: company.phone || company.internationalPhone || null,
      website: company.website || null,
      maps_url: company.mapsUrl || null,
      rating: company.rating,
      reviews: company.reviews,
      source: company.source,
      payload: company,
    }))

    const { data: storedCompanies, error: companyError } = await supabase
      .from("companies")
      .upsert(companyRows, { onConflict: "organization_id,external_id" })
      .select("id, external_id")

    if (companyError) throw companyError

    const idByExternal = new Map(
      (storedCompanies || []).map((company) => [company.external_id as string, company.id as string]),
    )

    const relationRows = mission.companies
      .map((company, index) => {
        const companyId = idByExternal.get(company.id)
        if (!companyId) return null
        return {
          mission_id: mission.id,
          company_id: companyId,
          ranking: index + 1,
          score: company.leadScore.score,
          priority: company.leadScore.priority,
        }
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row))

    if (relationRows.length) {
      const { error: relationError } = await supabase
        .from("mission_companies")
        .upsert(relationRows, { onConflict: "mission_id,company_id" })

      if (relationError) throw relationError
    }

    return { persisted: true }
  } catch (error) {
    console.warn("Missão concluída, mas não foi persistida no Supabase.", error)
    return {
      persisted: false,
      reason: error instanceof Error ? error.message : "unknown-persistence-error",
    }
  }
}

export async function getLatestMission(): Promise<Mission | null> {
  const context = await getWorkspaceContext()
  if (!context) return null

  const { supabase, organizationId } = context
  const { data: missionRow, error: missionError } = await supabase
    .from("missions")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (missionError || !missionRow) return null

  const { data: relations, error: relationError } = await supabase
    .from("mission_companies")
    .select("ranking, company:companies(payload)")
    .eq("mission_id", missionRow.id)
    .order("ranking", { ascending: true })

  if (relationError) return null

  const companies = (relations || [])
    .map((relation) => {
      const company = Array.isArray(relation.company) ? relation.company[0] : relation.company
      return company?.payload as MissionCompany | undefined
    })
    .filter((company): company is MissionCompany => Boolean(company))

  return {
    id: missionRow.id as string,
    prompt: missionRow.prompt as string,
    city: missionRow.city as string,
    niche: missionRow.niche as string,
    brief: missionRow.brief as Mission["brief"],
    progress: missionRow.progress as number,
    status: missionRow.status as Mission["status"],
    createdAt: missionRow.created_at as string,
    completedAt: (missionRow.completed_at as string | null) || undefined,
    estimatedTime: missionRow.estimated_time as number,
    companies,
    dataSource: missionRow.data_source as Mission["dataSource"],
    dataNotice: missionRow.data_notice as string,
    searchQuery: missionRow.search_query as string,
  }
}

export async function getCompanyByExternalId(externalId: string): Promise<MissionCompany | null> {
  const context = await getWorkspaceContext()
  if (!context) return null

  const { data, error } = await context.supabase
    .from("companies")
    .select("payload")
    .eq("organization_id", context.organizationId)
    .eq("external_id", externalId)
    .maybeSingle()

  if (error || !data?.payload) return null
  return data.payload as MissionCompany
}
