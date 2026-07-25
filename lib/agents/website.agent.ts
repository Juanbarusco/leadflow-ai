export type WebsiteSpeed = "fast" | "medium" | "slow"
export type OpportunityPriority = "high" | "medium" | "low"
export type WebsiteAnalysisSource = "live" | "inferred" | "unavailable" | "demo"

export interface WebsiteAnalysis {
  hasWebsite: boolean
  speed: WebsiteSpeed
  hasLandingPage: boolean
  hasWhatsappButton: boolean
  hasContactForm: boolean
  hasSsl: boolean

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

  analysisSource: WebsiteAnalysisSource
  httpStatus?: number
  responseTimeMs?: number
  pageTitle?: string
  metaDescription?: string
  instagramUrl?: string
  whatsappUrl?: string
  detectedEmails: string[]
}

function normalizeUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function extractFirst(html: string, expression: RegExp) {
  return expression.exec(html)?.[1]?.trim()
}

function cleanText(value?: string) {
  if (!value) return undefined
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values))
}

function scoreLabel(score: number) {
  if (score >= 82) return "Excelente"
  if (score >= 65) return "Bom"
  if (score >= 40) return "Regular"
  return "Crítico"
}

function opportunityPriority(score: number): OpportunityPriority {
  if (score >= 75) return "high"
  if (score >= 48) return "medium"
  return "low"
}


function checksum(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0)
}

function demoWebsiteAnalysis(url?: string, seedValue = "demo"): WebsiteAnalysis {
  if (!url) {
    return { ...noWebsiteAnalysis(), analysisSource: "demo" }
  }

  const seed = checksum(seedValue)
  const hasLandingPage = seed % 4 === 0
  const hasWhatsappButton = seed % 3 !== 0
  const hasContactForm = seed % 2 === 0
  const speed: WebsiteSpeed = seed % 5 === 0 ? "slow" : seed % 2 === 0 ? "fast" : "medium"
  const hasSsl = true
  const pageTitle = `${seedValue} | Site oficial`
  const metaDescription = seed % 3 === 0 ? undefined : `Conheça os serviços da ${seedValue}.`
  const instagramUrl = `https://instagram.com/${seedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "")}`
  let score = 42
  score += speed === "fast" ? 18 : speed === "medium" ? 10 : 2
  score += hasLandingPage ? 12 : 0
  score += hasWhatsappButton ? 10 : 0
  score += hasContactForm ? 8 : 0
  score += metaDescription ? 8 : 0
  score = Math.min(96, score)
  const opportunityScore = Math.max(28, 100 - score + 18)
  const problems = unique([
    ...(!hasLandingPage ? ["Não possui landing page focada em conversão"] : []),
    ...(!hasWhatsappButton ? ["WhatsApp não está destacado no site"] : []),
    ...(!hasContactForm ? ["Formulário de contato não identificado"] : []),
    ...(speed === "slow" ? ["Velocidade de carregamento abaixo do ideal"] : []),
    ...(!metaDescription ? ["Descrição de SEO não identificada"] : []),
  ])

  return {
    hasWebsite: true,
    speed,
    hasLandingPage,
    hasWhatsappButton,
    hasContactForm,
    hasSsl,
    score,
    scoreLabel: scoreLabel(score),
    opportunityScore,
    opportunityPriority: opportunityPriority(opportunityScore),
    observations: [
      "Website demonstrativo encontrado.",
      `Velocidade simulada: ${speed === "fast" ? "rápida" : speed === "medium" ? "média" : "lenta"}.`,
      hasWhatsappButton ? "WhatsApp demonstrativo identificado." : "WhatsApp demonstrativo não identificado.",
      hasLandingPage ? "Jornada de conversão demonstrativa identificada." : "Landing page demonstrativa não identificada.",
    ],
    commercialProblems: problems.length ? problems : ["Mensuração de conversões pode ser aprimorada"],
    recommendedServices: unique([
      ...(!hasLandingPage ? ["Landing page de alta conversão"] : []),
      ...(speed !== "fast" ? ["Otimização de velocidade"] : []),
      ...(!hasWhatsappButton ? ["Integração com WhatsApp"] : []),
      ...(!hasContactForm ? ["Formulário e captura de leads"] : []),
      "SEO local e acompanhamento de conversões",
    ]),
    commercialDiagnosis:
      "Análise demonstrativa usada para validar toda a experiência do LeadFlow antes da ativação das fontes pagas.",
    estimatedSaleMin: 1500,
    estimatedSaleMax: problems.length >= 3 ? 4800 : 3200,
    analysisSource: "demo",
    httpStatus: 200,
    responseTimeMs: 650 + (seed % 1800),
    pageTitle,
    metaDescription,
    instagramUrl,
    whatsappUrl: hasWhatsappButton ? "https://wa.me/5511999999999" : undefined,
    detectedEmails: [`contato@${new URL(normalizeUrl(url)!).hostname.replace(/^www\./, "")}`],
  }
}

function noWebsiteAnalysis(): WebsiteAnalysis {
  return {
    hasWebsite: false,
    speed: "slow",
    hasLandingPage: false,
    hasWhatsappButton: false,
    hasContactForm: false,
    hasSsl: false,
    score: 10,
    scoreLabel: "Crítico",
    opportunityScore: 96,
    opportunityPriority: "high",
    observations: [
      "Empresa sem website informado no Google.",
      "Não existe uma estrutura própria identificada para apresentação dos serviços.",
      "A empresa depende de plataformas externas para gerar contatos.",
    ],
    commercialProblems: [
      "Não possui website identificado",
      "Não possui landing page própria",
      "Não possui captação própria de leads",
      "Não possui botão de WhatsApp integrado em um site",
      "Baixa autoridade digital própria",
    ],
    recommendedServices: [
      "Criação de website profissional",
      "Landing page para captação de clientes",
      "Integração com WhatsApp",
      "SEO local",
      "Configuração de métricas e conversões",
    ],
    commercialDiagnosis:
      "Nenhum website foi informado pela fonte empresarial. Isso cria uma oportunidade de alta prioridade para oferecer uma estrutura digital própria, melhorar autoridade e transformar buscas em contatos.",
    estimatedSaleMin: 2500,
    estimatedSaleMax: 6000,
    analysisSource: "inferred",
    detectedEmails: [],
  }
}

function unavailableWebsiteAnalysis(url: string, message: string): WebsiteAnalysis {
  const hasSsl = url.startsWith("https://")
  return {
    hasWebsite: true,
    speed: "slow",
    hasLandingPage: false,
    hasWhatsappButton: false,
    hasContactForm: false,
    hasSsl,
    score: 42,
    scoreLabel: "Regular",
    opportunityScore: 78,
    opportunityPriority: "high",
    observations: [
      "Website informado pela empresa.",
      "A página não pôde ser lida automaticamente nesta tentativa.",
      message,
    ],
    commercialProblems: [
      "Disponibilidade ou acesso técnico precisa ser revisado",
      "Conversão e velocidade não puderam ser confirmadas",
      "Estrutura de contato não pôde ser validada",
    ],
    recommendedServices: [
      "Auditoria técnica do website",
      "Otimização de velocidade e disponibilidade",
      "Landing page orientada à conversão",
      "Integração com WhatsApp e métricas",
    ],
    commercialDiagnosis:
      "Existe um website informado, porém a leitura automática falhou. O LeadFlow não inventa sinais ausentes: o relatório mantém a oportunidade como provável e recomenda uma validação manual antes da abordagem.",
    estimatedSaleMin: 1200,
    estimatedSaleMax: 3500,
    analysisSource: "unavailable",
    detectedEmails: [],
  }
}

export class WebsiteAgent {
  async analyze(rawUrl?: string, options?: { demo?: boolean; seed?: string }): Promise<WebsiteAnalysis> {
    if (options?.demo) return demoWebsiteAnalysis(rawUrl, options.seed)
    if (!rawUrl) return noWebsiteAnalysis()

    const url = normalizeUrl(rawUrl)
    if (!url) return noWebsiteAnalysis()

    const startedAt = Date.now()

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; LeadFlowAI/1.0; +https://leadflow.ai)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(9_000),
      })

      const responseTimeMs = Date.now() - startedAt
      const contentType = response.headers.get("content-type") ?? ""
      if (!response.ok) {
        return unavailableWebsiteAnalysis(url, `O servidor respondeu com HTTP ${response.status}.`)
      }

      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        return unavailableWebsiteAnalysis(url, "O endereço não retornou uma página HTML analisável.")
      }

      const html = (await response.text()).slice(0, 1_500_000)
      const lower = html.toLowerCase()
      const finalUrl = response.url || url
      const hasSsl = finalUrl.startsWith("https://")
      const hasWhatsappButton = /(?:wa\.me|api\.whatsapp\.com|whatsapp\.com\/send|whatsapp:)/i.test(html)
      const hasContactForm = /<form\b/i.test(html)
      const hasStrongCta = /(agende|solicite|fale conosco|entre em contato|peça um orçamento|quero saber mais|chame no whatsapp)/i.test(lower)
      const hasLandingPage = hasStrongCta && (hasWhatsappButton || hasContactForm)
      const instagramUrl = extractFirst(
        html,
        /href=["'](https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_.-]+\/?)["']/i,
      )
      const whatsappUrl = extractFirst(
        html,
        /href=["']((?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com|www\.whatsapp\.com)\/[^"']+)["']/i,
      )
      const detectedEmails = unique(
        Array.from(html.matchAll(/mailto:([^?"'\s>]+)/gi)).map((match) => match[1].toLowerCase()),
      ).slice(0, 5)
      const pageTitle = cleanText(extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i))
      const metaDescription = cleanText(
        extractFirst(
          html,
          /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
        ) ||
          extractFirst(
            html,
            /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
          ),
      )

      const speed: WebsiteSpeed = responseTimeMs <= 1400 ? "fast" : responseTimeMs <= 3500 ? "medium" : "slow"
      let score = 30
      score += hasSsl ? 12 : 0
      score += speed === "fast" ? 18 : speed === "medium" ? 10 : 2
      score += pageTitle ? 8 : 0
      score += metaDescription ? 8 : 0
      score += hasWhatsappButton ? 10 : 0
      score += hasContactForm ? 8 : 0
      score += hasLandingPage ? 12 : 0
      score = Math.min(100, score)

      const problems = unique([
        ...(!hasSsl ? ["Website sem HTTPS confirmado"] : []),
        ...(speed === "slow" ? ["Carregamento lento na análise"] : []),
        ...(!pageTitle ? ["Título principal da página não identificado"] : []),
        ...(!metaDescription ? ["Descrição para mecanismos de busca não identificada"] : []),
        ...(!hasLandingPage ? ["Não foi identificada uma jornada clara de conversão"] : []),
        ...(!hasWhatsappButton ? ["WhatsApp não identificado no website"] : []),
        ...(!hasContactForm ? ["Formulário de contato não identificado"] : []),
      ])

      const recommended = unique([
        ...(!hasLandingPage ? ["Landing page de alta conversão"] : []),
        ...(speed !== "fast" ? ["Otimização de velocidade"] : []),
        ...(!metaDescription || !pageTitle ? ["SEO técnico e local"] : []),
        ...(!hasWhatsappButton ? ["Integração com WhatsApp"] : []),
        ...(!hasContactForm ? ["Formulário e captura de leads"] : []),
        "Configuração de acompanhamento de conversões",
      ])

      const hasWebsite = true
      const opportunityScore = Math.max(25, 100 - score)

      return {
        hasWebsite,
        speed,
        hasLandingPage,
        hasWhatsappButton,
        hasContactForm,
        hasSsl,
        score,
        scoreLabel: scoreLabel(score),
        opportunityScore,
        opportunityPriority: opportunityPriority(opportunityScore),
        observations: [
          `Website acessado com HTTP ${response.status}.`,
          `Tempo de resposta aproximado: ${responseTimeMs} ms.`,
          hasSsl ? "HTTPS confirmado." : "HTTPS não confirmado.",
          hasWhatsappButton ? "WhatsApp identificado no HTML." : "WhatsApp não identificado no HTML.",
          hasContactForm ? "Formulário de contato identificado." : "Formulário de contato não identificado.",
          hasLandingPage ? "Sinais de jornada de conversão identificados." : "Jornada de conversão não ficou clara.",
        ],
        commercialProblems: problems.length ? problems : ["O site existe, mas pode melhorar mensuração e conversão"],
        recommendedServices: recommended,
        commercialDiagnosis:
          problems.length >= 4
            ? "O website está online, mas apresenta lacunas técnicas e comerciais que podem reduzir contatos. A melhor entrada é uma auditoria objetiva seguida de melhorias de conversão."
            : "O website possui uma base funcional. A oportunidade está em melhorar velocidade, mensuração e transformar mais visitantes em conversas comerciais.",
        estimatedSaleMin: problems.length >= 4 ? 1800 : 1200,
        estimatedSaleMax: problems.length >= 4 ? 4800 : 3200,
        analysisSource: "live",
        httpStatus: response.status,
        responseTimeMs,
        pageTitle,
        metaDescription,
        instagramUrl,
        whatsappUrl,
        detectedEmails,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha desconhecida ao acessar o website."
      return unavailableWebsiteAnalysis(url, message)
    }
  }
}

export const websiteAgent = new WebsiteAgent()
