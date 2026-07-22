import type { GoogleBusiness } from "@/lib/agents/google.agent"
import type { LeadScoreAnalysis } from "@/lib/agents/score.agent"
import type { WebsiteAnalysis } from "@/lib/agents/website.agent"

export interface OutreachAnalysis {
  channel: "whatsapp" | "email" | "phone"
  subject: string
  message: string
  callOpening: string
}

export class OutreachAgent {
  async generate(company: GoogleBusiness, website: WebsiteAnalysis, score: LeadScoreAnalysis): Promise<OutreachAnalysis> {
    const mainProblem = score.reasons[0] ?? "oportunidades de melhoria na presença digital"
    const firstName = company.name.split(" ")[0]
    return {
      channel: company.phone ? "whatsapp" : company.website ? "email" : "phone",
      subject: `Ideia para aumentar a captação da ${company.name}`,
      message: `Olá, equipe ${firstName}! Analisei rapidamente a presença digital da ${company.name} e identifiquei ${mainProblem.toLowerCase()}. Tenho uma sugestão prática para transformar isso em mais contatos pelo WhatsApp. Posso enviar um diagnóstico curto?`,
      callOpening: `Olá, falo com a ${company.name}? Fiz uma análise rápida da presença digital de vocês e encontrei uma oportunidade objetiva de captação. Posso explicar em um minuto?`,
    }
  }
}

export const outreachAgent = new OutreachAgent()
