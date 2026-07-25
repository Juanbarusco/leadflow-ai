export type InstagramActivity = "active" | "irregular" | "inactive" | "unknown"
export type InstagramEngagement = "high" | "medium" | "low" | "unknown"
export type InstagramAnalysisSource = "website_link" | "not_found" | "demo"

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
  analysisSource: InstagramAnalysisSource
  metricsVerified: boolean
  signalsVerified: boolean
}

function parseUsername(profileUrl: string) {
  try {
    const parsed = new URL(profileUrl)
    const username = parsed.pathname.split("/").filter(Boolean)[0]
    return username ? `@${username}` : undefined
  } catch {
    return undefined
  }
}


function checksum(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0)
}

function demoAnalysis(companyName: string, profileUrl?: string): InstagramAnalysis {
  const seed = checksum(companyName)
  const url = profileUrl || `https://instagram.com/${companyName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "")}`
  const followers = 720 + (seed % 4300)
  const posts = 32 + (seed % 210)
  const daysSinceLastPost = 2 + (seed % 35)
  const activity: InstagramActivity = daysSinceLastPost <= 7 ? "active" : daysSinceLastPost <= 21 ? "irregular" : "inactive"
  const engagement: InstagramEngagement = seed % 4 === 0 ? "high" : seed % 3 === 0 ? "medium" : "low"
  const hasBioLink = seed % 3 !== 0
  const hasWhatsapp = seed % 4 !== 0
  const hasProfessionalBio = seed % 5 !== 0
  const hasHighlights = seed % 2 === 0
  const score = Math.min(92, 36 + (activity === "active" ? 22 : activity === "irregular" ? 12 : 4) + (hasBioLink ? 8 : 0) + (hasWhatsapp ? 8 : 0) + (hasProfessionalBio ? 8 : 0))
  const problems = [
    ...(activity === "inactive" ? ["Baixa frequência de publicação"] : []),
    ...(engagement === "low" ? ["Engajamento abaixo do potencial"] : []),
    ...(!hasBioLink ? ["Link comercial não identificado na bio"] : []),
    ...(!hasWhatsapp ? ["WhatsApp não identificado no perfil"] : []),
    ...(!hasProfessionalBio ? ["Bio precisa de posicionamento comercial"] : []),
  ]

  return {
    profileFound: true,
    username: parseUsername(url),
    profileUrl: url,
    followers,
    posts,
    daysSinceLastPost,
    activity,
    engagement,
    hasBioLink,
    hasWhatsapp,
    hasProfessionalBio,
    hasHighlights,
    score,
    scoreLabel: score >= 80 ? "Excelente" : score >= 60 ? "Bom" : score >= 40 ? "Regular" : "Crítico",
    observations: [
      "Perfil demonstrativo localizado.",
      `Última publicação simulada há ${daysSinceLastPost} dias.`,
      `Engajamento demonstrativo classificado como ${engagement === "high" ? "alto" : engagement === "medium" ? "médio" : "baixo"}.`,
    ],
    commercialProblems: problems.length ? problems : ["Conteúdo pode ser mais orientado para conversão"],
    recommendedServices: [
      "Planejamento estratégico de conteúdo",
      "Otimização da bio comercial",
      "Integração com WhatsApp",
      "Campanhas para geração de leads",
    ],
    commercialDiagnosis: "Análise demonstrativa criada para validar o fluxo de inteligência antes da ativação de uma fonte autorizada para métricas sociais.",
    analysisSource: "demo",
    metricsVerified: true,
    signalsVerified: true,
  }
}

export class InstagramAgent {
  async analyze(companyName: string, profileUrl?: string, options?: { demo?: boolean }): Promise<InstagramAnalysis> {
    if (options?.demo) return demoAnalysis(companyName, profileUrl)
    if (!profileUrl) {
      return {
        profileFound: false,
        followers: 0,
        posts: 0,
        daysSinceLastPost: -1,
        activity: "unknown",
        engagement: "unknown",
        hasBioLink: false,
        hasWhatsapp: false,
        hasProfessionalBio: false,
        hasHighlights: false,
        score: 22,
        scoreLabel: "Não verificado",
        observations: [
          "Nenhum link de Instagram foi localizado no website analisado.",
          "A ausência do link não confirma que a empresa não possua perfil.",
          "Recomenda-se validação manual antes da abordagem.",
        ],
        commercialProblems: [
          "Instagram não localizado nas fontes disponíveis",
          "Canal social ainda precisa de validação manual",
          "Integração entre website e Instagram não identificada",
        ],
        recommendedServices: [
          "Auditoria manual da presença no Instagram",
          "Integração do Instagram ao website",
          "Otimização da bio e do link comercial",
          "Planejamento de conteúdo orientado para conversão",
        ],
        commercialDiagnosis:
          `O LeadFlow não encontrou um link verificável do Instagram da ${companyName} no website. Isso pode indicar ausência de integração entre canais, mas não deve ser tratado como prova de que o perfil não existe.`,
        analysisSource: "not_found",
        metricsVerified: false,
        signalsVerified: false,
      }
    }

    const username = parseUsername(profileUrl)

    return {
      profileFound: true,
      username,
      profileUrl,
      followers: 0,
      posts: 0,
      daysSinceLastPost: -1,
      activity: "unknown",
      engagement: "unknown",
      hasBioLink: false,
      hasWhatsapp: false,
      hasProfessionalBio: false,
      hasHighlights: false,
      score: 52,
      scoreLabel: "Perfil localizado",
      observations: [
        "Link de Instagram localizado no website oficial.",
        "Seguidores, publicações e engajamento não foram inventados.",
        "As métricas do perfil exigem uma integração específica ou validação manual.",
      ],
      commercialProblems: [
        "Métricas e conteúdo ainda não verificados",
        "Conversão do perfil para WhatsApp precisa ser auditada",
      ],
      recommendedServices: [
        "Auditoria estratégica do Instagram",
        "Otimização da bio comercial",
        "Integração com WhatsApp",
        "Planejamento de conteúdo para geração de leads",
      ],
      commercialDiagnosis:
        "O perfil foi localizado por meio do website oficial, mas o LeadFlow mantém as métricas como não verificadas até existir uma fonte autorizada. A abordagem deve usar apenas o fato confirmado: o canal está vinculado ao site.",
      analysisSource: "website_link",
      metricsVerified: false,
      signalsVerified: false,
    }
  }
}

export const instagramAgent = new InstagramAgent()
