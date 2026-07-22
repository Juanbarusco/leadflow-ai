import type { GoogleBusiness } from "@/lib/agents/google.agent"
import type { InstagramAnalysis } from "@/lib/agents/instagram.agent"
import type { SeoAnalysis } from "@/lib/agents/seo.agent"
import type { WebsiteAnalysis } from "@/lib/agents/website.agent"

export type LeadPriority = "high" | "medium" | "low"

export interface LeadScoreAnalysis {
  score: number
  priority: LeadPriority
  confidence: number
  reasons: string[]
}

export class ScoreAgent {
  async analyze(input: {
    company: GoogleBusiness
    website: WebsiteAnalysis
    instagram: InstagramAnalysis
    seo: SeoAnalysis
  }): Promise<LeadScoreAnalysis> {
    const { company, website, instagram, seo } = input
    const digitalGap = 100 - Math.round((website.score * 0.45) + (instagram.score * 0.3) + (seo.score * 0.25))
    const commercialCapacity = Math.min(100, Math.round(company.rating * 12 + Math.log10(company.reviews + 1) * 18))
    const score = Math.max(0, Math.min(100, Math.round(digitalGap * 0.65 + commercialCapacity * 0.35)))

    const reasons = [
      ...website.commercialProblems.slice(0, 2),
      ...instagram.commercialProblems.slice(0, 2),
      ...seo.problems.slice(0, 1),
    ]

    return {
      score,
      priority: score >= 75 ? "high" : score >= 50 ? "medium" : "low",
      confidence: Math.min(98, 70 + Math.round(Math.min(company.reviews, 300) / 15)),
      reasons: Array.from(new Set(reasons)),
    }
  }
}

export const scoreAgent = new ScoreAgent()
