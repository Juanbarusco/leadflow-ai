import { formatMissionLocation, type MissionBrief } from "@/lib/mission/brief"

const segmentQueries: Record<string, string> = {
  "Todos os segmentos": "empresas locais",
  "Clínicas odontológicas": "clínicas odontológicas e dentistas",
  "Clínicas de estética": "clínicas de estética",
  Academias: "academias e centros de treinamento",
  Restaurantes: "restaurantes",
  "Auto centers": "auto centers e oficinas automotivas",
  Imobiliárias: "imobiliárias",
  "Escritórios contábeis": "escritórios de contabilidade",
  "Lojas de moda": "lojas de moda e roupas",
}

export function buildPlacesTextQuery(brief: MissionBrief) {
  const segment = segmentQueries[brief.segment] ?? brief.segment
  const location = formatMissionLocation(brief.location)

  if (brief.location.scope === "state") {
    return `${segment} no estado de ${brief.location.state || location}, Brasil`
  }

  if (brief.location.scope === "region") {
    return `${segment} na região ${brief.location.region || "Sudeste"} do Brasil`
  }

  if (brief.location.scope === "country") {
    return `${segment} no Brasil`
  }

  return `${segment} em ${brief.location.city || "São Carlos"}, ${brief.location.stateCode || brief.location.state || "SP"}, Brasil`
}
