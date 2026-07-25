export type MissionLocationScope = "country" | "region" | "state" | "city"

export type MissionLocation = {
  scope: MissionLocationScope
  region?: string
  state?: string
  stateCode?: string
  city?: string
  radiusKm?: number
}

export type MissionBrief = {
  objective: string
  segment: string
  location: MissionLocation
  createdAt: string
}

export const DEFAULT_MISSION_BRIEF: MissionBrief = {
  objective: "Encontrar empresas com baixa maturidade digital e potencial para contratar um site",
  segment: "Clínicas odontológicas",
  location: {
    scope: "city",
    state: "São Paulo",
    stateCode: "SP",
    city: "São Carlos",
    radiusKm: 50,
  },
  createdAt: "",
}

export const BRAZILIAN_REGIONS = [
  "Norte",
  "Nordeste",
  "Centro-Oeste",
  "Sudeste",
  "Sul",
] as const

export const BRAZILIAN_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
] as const

export const SEGMENT_OPTIONS = [
  "Todos os segmentos",
  "Clínicas odontológicas",
  "Clínicas de estética",
  "Academias",
  "Restaurantes",
  "Auto centers",
  "Imobiliárias",
  "Escritórios contábeis",
  "Lojas de moda",
] as const

export const QUICK_MISSION_TEMPLATES = [
  {
    label: "Sites para clínicas",
    segment: "Clínicas odontológicas",
    objective: "Encontrar clínicas sem uma página preparada para gerar contatos pelo WhatsApp",
  },
  {
    label: "Automação para restaurantes",
    segment: "Restaurantes",
    objective: "Encontrar restaurantes com atendimento manual e oportunidade de automação comercial",
  },
  {
    label: "Captação para academias",
    segment: "Academias",
    objective: "Encontrar academias com presença digital ativa, mas sem uma jornada clara de matrícula",
  },
  {
    label: "Presença digital para auto centers",
    segment: "Auto centers",
    objective: "Encontrar auto centers com boa reputação local e presença digital pouco profissional",
  },
] as const

export function formatMissionLocation(location: MissionLocation) {
  if (location.scope === "country") return "Todo o Brasil"
  if (location.scope === "region") return `Região ${location.region || "Sudeste"}`
  if (location.scope === "state") return location.state || "São Paulo"

  const city = location.city?.trim() || "São Carlos"
  const stateCode = location.stateCode ? `, ${location.stateCode}` : ""
  const radius = location.radiusKm ? ` · raio de ${location.radiusKm} km` : ""
  return `${city}${stateCode}${radius}`
}

export function missionAreaLabel(location: MissionLocation) {
  if (location.scope === "city") return location.city?.trim() || "São Carlos"
  if (location.scope === "state") return location.state || "São Paulo"
  if (location.scope === "region") return `Região ${location.region || "Sudeste"}`
  return "Brasil"
}

export function buildMissionPrompt(brief: MissionBrief) {
  const objective = brief.objective.trim()
  const segment = brief.segment === "Todos os segmentos" ? "segmentos compatíveis" : brief.segment
  return `${objective}. Priorize ${segment.toLowerCase()} em ${formatMissionLocation(brief.location)}.`
}

export function normalizeMissionBrief(value: Partial<MissionBrief> | null | undefined): MissionBrief {
  return {
    ...DEFAULT_MISSION_BRIEF,
    ...value,
    objective: value?.objective?.trim() || DEFAULT_MISSION_BRIEF.objective,
    segment: value?.segment || DEFAULT_MISSION_BRIEF.segment,
    location: {
      ...DEFAULT_MISSION_BRIEF.location,
      ...value?.location,
    },
    createdAt: value?.createdAt || "",
  }
}
