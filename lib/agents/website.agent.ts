export type WebsiteSpeed = "fast" | "medium" | "slow"

export type OpportunityPriority = "high" | "medium" | "low"

export interface WebsiteAnalysis {
  hasWebsite: boolean
  speed: WebsiteSpeed
  hasLandingPage: boolean
  hasWhatsappButton: boolean

  score: number
  scoreLabel: string

  opportunityScore: number
  opportunityPriority: OpportunityPriority

  observations: string[]
  commercialProblems: string[]
  recommendedServices: string[]

  commercialDiagnosis: string

  estimatedSaleMin: number
  estimatedSaleMax: number
}

export class WebsiteAgent {
  async analyze(url?: string): Promise<WebsiteAnalysis> {
    if (!url) {
      return {
        hasWebsite: false,
        speed: "slow",
        hasLandingPage: false,
        hasWhatsappButton: false,

        score: 10,
        scoreLabel: "Crítico",

        opportunityScore: 96,
        opportunityPriority: "high",

        observations: [
          "Empresa sem website.",
          "Não existe uma estrutura própria para apresentação dos serviços.",
          "A empresa depende de plataformas externas para gerar contatos.",
        ],

        commercialProblems: [
          "Não possui website",
          "Não possui landing page",
          "Não possui captação própria de leads",
          "Não possui botão de WhatsApp integrado",
          "Baixa autoridade digital",
        ],

        recommendedServices: [
          "Criação de website profissional",
          "Landing page para captação de clientes",
          "Integração com WhatsApp",
          "SEO local",
          "Configuração de métricas e conversões",
        ],

        commercialDiagnosis:
          "A empresa não possui website e apresenta uma oportunidade comercial de alta prioridade. É possível oferecer uma estrutura digital completa para apresentar os serviços, captar novos clientes e centralizar os contatos pelo WhatsApp.",

        estimatedSaleMin: 2500,
        estimatedSaleMax: 6000,
      }
    }

    return {
      hasWebsite: true,
      speed: "medium",
      hasLandingPage: false,
      hasWhatsappButton: true,

      score: 74,
      scoreLabel: "Bom",

      opportunityScore: 82,
      opportunityPriority: "high",

      observations: [
        "Site encontrado.",
        "Landing page não encontrada.",
        "Botão de WhatsApp presente.",
        "Velocidade média.",
      ],

      commercialProblems: [
        "Não possui landing page específica",
        "Velocidade de carregamento mediana",
        "Captação de leads pode ser melhorada",
        "Ausência de uma página focada em conversão",
      ],

      recommendedServices: [
        "Landing page de alta conversão",
        "Otimização de velocidade",
        "SEO local",
        "Melhoria da jornada até o WhatsApp",
        "Configuração de acompanhamento de conversões",
      ],

      commercialDiagnosis:
        "A empresa possui um website funcional, mas não utiliza uma landing page focada em conversão. A velocidade é mediana e existe espaço para melhorar a captação de clientes, a experiência de navegação e o direcionamento dos visitantes para o WhatsApp.",

      estimatedSaleMin: 1500,
      estimatedSaleMax: 3500,
    }
  }
}

export const websiteAgent = new WebsiteAgent()