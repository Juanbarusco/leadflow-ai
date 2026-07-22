import type { GoogleBusiness } from "@/lib/agents/google.agent"
import type { WebsiteAnalysis } from "@/lib/agents/website.agent"

export interface SeoAnalysis {
  score: number
  scoreLabel: "Crítico" | "Regular" | "Bom" | "Excelente"
  hasLocalPresence: boolean
  hasWebsiteIndexability: boolean
  estimatedLocalPosition: number
  problems: string[]
  opportunities: string[]
}

export class SeoAgent {
  async analyze(company: GoogleBusiness, website: WebsiteAnalysis): Promise<SeoAnalysis> {
    const hasLocalPresence = company.rating >= 4 && company.reviews >= 20
    const hasWebsiteIndexability = website.hasWebsite
    const score = Math.max(0, Math.min(100,
      (hasLocalPresence ? 35 : 12) +
      (hasWebsiteIndexability ? 30 : 0) +
      Math.min(25, Math.round(company.reviews / 12)) +
      (website.speed === "fast" ? 10 : website.speed === "medium" ? 5 : 0),
    ))

    const problems: string[] = []
    if (!hasWebsiteIndexability) problems.push("Empresa sem site próprio para posicionamento orgânico")
    if (company.reviews < 50) problems.push("Baixo volume de avaliações locais")
    if (website.speed === "slow") problems.push("Velocidade prejudica experiência e SEO")
    if (!website.hasLandingPage) problems.push("Ausência de página focada no serviço principal")

    return {
      score,
      scoreLabel: score >= 85 ? "Excelente" : score >= 65 ? "Bom" : score >= 40 ? "Regular" : "Crítico",
      hasLocalPresence,
      hasWebsiteIndexability,
      estimatedLocalPosition: score >= 80 ? 3 : score >= 60 ? 7 : score >= 40 ? 12 : 20,
      problems,
      opportunities: [
        "Otimização do Google Business Profile",
        "SEO local por serviço e cidade",
        "Estratégia contínua de avaliações",
        "Conteúdo orientado para buscas comerciais",
      ],
    }
  }
}

export const seoAgent = new SeoAgent()
