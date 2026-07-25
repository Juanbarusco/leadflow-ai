import { googleAgent, type GoogleBusiness } from "@/lib/agents/google.agent"
import { instagramAgent, type InstagramAnalysis } from "@/lib/agents/instagram.agent"
import { outreachAgent, type OutreachAnalysis } from "@/lib/agents/outreach.agent"
import { scoreAgent, type LeadScoreAnalysis } from "@/lib/agents/score.agent"
import { seoAgent, type SeoAnalysis } from "@/lib/agents/seo.agent"
import { websiteAgent, type WebsiteAnalysis } from "@/lib/agents/website.agent"
import { buildMissionPrompt, formatMissionLocation, type MissionBrief } from "@/lib/mission/brief"
import type { PlacesDataSource } from "@/lib/places/types"
import { leadService } from "@/lib/services/lead.service"

export type MissionStatus = "waiting" | "running" | "completed" | "failed"

export interface MissionCompany extends GoogleBusiness {
  websiteAnalysis: WebsiteAnalysis
  instagramAnalysis: InstagramAnalysis
  seoAnalysis: SeoAnalysis
  leadScore: LeadScoreAnalysis
  outreach: OutreachAnalysis
}

export interface Mission {
  id: string
  prompt: string
  city: string
  niche: string
  brief: MissionBrief
  progress: number
  status: MissionStatus
  createdAt: string
  completedAt?: string
  estimatedTime: number
  companies: MissionCompany[]
  dataSource: PlacesDataSource
  dataNotice: string
  searchQuery: string
}

export class MissionEngine {
  async create(brief: MissionBrief): Promise<Mission> {
    const prompt = buildMissionPrompt(brief)
    const createdAt = new Date().toISOString()

    try {
      const placesResult = await googleAgent.search(brief)
      const analyzed = await Promise.all(
        placesResult.companies.map(async (company) => {
          const isDemo = company.source === "demo"
          const websiteAnalysis = await websiteAgent.analyze(company.website, { demo: isDemo, seed: company.name })
          const instagramAnalysis = await instagramAgent.analyze(company.name, websiteAnalysis.instagramUrl, { demo: isDemo })
          const seoAnalysis = await seoAgent.analyze(company, websiteAnalysis)
          const leadScore = await scoreAgent.analyze({ company, website: websiteAnalysis, instagram: instagramAnalysis, seo: seoAnalysis })
          const outreach = await outreachAgent.generate(company, websiteAnalysis, leadScore)
          return { ...company, websiteAnalysis, instagramAnalysis, seoAnalysis, leadScore, outreach }
        }),
      )

      return {
        id: crypto.randomUUID(),
        prompt,
        city: formatMissionLocation(brief.location),
        niche: brief.segment,
        brief,
        progress: 100,
        status: "completed",
        createdAt,
        completedAt: new Date().toISOString(),
        estimatedTime: placesResult.mode === "google_places" ? 35 : 12,
        companies: leadService.rank(analyzed),
        dataSource: placesResult.mode,
        dataNotice: placesResult.notice,
        searchQuery: placesResult.query,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido"
      throw new Error(`Falha ao executar missão: ${message}`, { cause: error })
    }
  }
}

export const missionEngine = new MissionEngine()
