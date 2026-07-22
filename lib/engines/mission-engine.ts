import { googleAgent, type GoogleBusiness } from "@/lib/agents/google.agent"
import { instagramAgent, type InstagramAnalysis } from "@/lib/agents/instagram.agent"
import { outreachAgent, type OutreachAnalysis } from "@/lib/agents/outreach.agent"
import { scoreAgent, type LeadScoreAnalysis } from "@/lib/agents/score.agent"
import { seoAgent, type SeoAnalysis } from "@/lib/agents/seo.agent"
import { websiteAgent, type WebsiteAnalysis } from "@/lib/agents/website.agent"
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
  progress: number
  status: MissionStatus
  createdAt: Date
  completedAt?: Date
  estimatedTime: number
  companies: MissionCompany[]
}

export class MissionEngine {
  async create(prompt: string): Promise<Mission> {
    const mission: Mission = {
      id: crypto.randomUUID(),
      prompt,
      city: "São Carlos",
      niche: "Clínicas odontológicas",
      progress: 0,
      status: "running",
      createdAt: new Date(),
      estimatedTime: 90,
      companies: [],
    }

    try {
      const googleCompanies = await googleAgent.search(prompt)
      const analyzed = await Promise.all(
        googleCompanies.map(async (company) => {
          const [websiteAnalysis, instagramAnalysis] = await Promise.all([
            websiteAgent.analyze(company.website),
            instagramAgent.analyze(company.name),
          ])
          const seoAnalysis = await seoAgent.analyze(company, websiteAnalysis)
          const leadScore = await scoreAgent.analyze({ company, website: websiteAnalysis, instagram: instagramAnalysis, seo: seoAnalysis })
          const outreach = await outreachAgent.generate(company, websiteAnalysis, leadScore)
          return { ...company, websiteAnalysis, instagramAnalysis, seoAnalysis, leadScore, outreach }
        }),
      )

      return {
        ...mission,
        companies: leadService.rank(analyzed),
        progress: 100,
        status: "completed",
        completedAt: new Date(),
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido"
      throw new Error(`Falha ao executar missão: ${message}`, { cause: error })
    }
  }
}

export const missionEngine = new MissionEngine()
