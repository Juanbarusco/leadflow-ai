export type InstagramActivity =
  | "active"
  | "irregular"
  | "inactive"

export type InstagramEngagement =
  | "high"
  | "medium"
  | "low"

export interface InstagramAnalysis {
  profileFound: boolean
  username?: string
  profileUrl?: string

  followers: number
  posts: number
  daysSinceLastPost: number

  activity: InstagramActivity
  engagement: InstagramEngagement

  hasBioLink: boolean
  hasWhatsapp: boolean
  hasProfessionalBio: boolean
  hasHighlights: boolean

  score: number
  scoreLabel: string

  observations: string[]
  commercialProblems: string[]
  recommendedServices: string[]

  commercialDiagnosis: string
}

export class InstagramAgent {
  async analyze(companyName: string): Promise<InstagramAnalysis> {
    const normalizedName = companyName.toLowerCase()

    if (normalizedName.includes("odonto life")) {
      return {
        profileFound: false,

        followers: 0,
        posts: 0,
        daysSinceLastPost: 999,

        activity: "inactive",
        engagement: "low",

        hasBioLink: false,
        hasWhatsapp: false,
        hasProfessionalBio: false,
        hasHighlights: false,

        score: 8,
        scoreLabel: "Crítico",

        observations: [
          "Perfil comercial não localizado.",
          "A empresa não possui presença social identificada.",
          "Não existem canais sociais ativos para relacionamento com clientes.",
        ],

        commercialProblems: [
          "Perfil do Instagram não encontrado",
          "Ausência de presença social profissional",
          "Sem canal de relacionamento pelo Instagram",
          "Sem link comercial na bio",
          "Sem destaques estratégicos",
          "Sem conteúdo recorrente",
        ],

        recommendedServices: [
          "Criação e configuração do Instagram comercial",
          "Desenvolvimento de identidade visual",
          "Planejamento mensal de conteúdo",
          "Criação de destaques estratégicos",
          "Integração do Instagram com WhatsApp",
          "Gestão de tráfego para captação de clientes",
        ],

        commercialDiagnosis:
          "A empresa não possui um perfil comercial identificado no Instagram. Isso representa uma oportunidade de alta prioridade para estruturar a presença social, apresentar os serviços, gerar autoridade e criar um novo canal de captação e relacionamento com potenciais clientes.",
      }
    }

    return {
      profileFound: true,
      username: "@clinicasorrisoprime",
      profileUrl: "https://instagram.com/clinicasorrisoprime",

      followers: 2140,
      posts: 184,
      daysSinceLastPost: 42,

      activity: "irregular",
      engagement: "low",

      hasBioLink: false,
      hasWhatsapp: false,
      hasProfessionalBio: true,
      hasHighlights: true,

      score: 46,
      scoreLabel: "Regular",

      observations: [
        "Perfil comercial encontrado.",
        "Última publicação realizada há 42 dias.",
        "Frequência de publicação irregular.",
        "Engajamento abaixo do esperado.",
        "Não existe link comercial na bio.",
        "WhatsApp não identificado no perfil.",
      ],

      commercialProblems: [
        "Perfil com baixa frequência de publicação",
        "Última postagem realizada há mais de 30 dias",
        "Engajamento baixo",
        "Sem link comercial na bio",
        "WhatsApp não identificado",
        "Conteúdo pouco orientado para conversão",
      ],

      recommendedServices: [
        "Gestão mensal de redes sociais",
        "Planejamento estratégico de conteúdo",
        "Criação de posts e vídeos curtos",
        "Otimização da bio comercial",
        "Integração com WhatsApp",
        "Campanhas para geração de leads",
      ],

      commercialDiagnosis:
        "A empresa possui um perfil profissional e uma base relevante de seguidores, mas apresenta baixa frequência de publicação e poucos elementos direcionados para conversão. Existe oportunidade para oferecer gestão de conteúdo, otimização da bio, integração com WhatsApp e campanhas de captação.",
    }
  }
}

export const instagramAgent = new InstagramAgent()