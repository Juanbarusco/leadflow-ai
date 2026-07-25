import type { MissionBrief } from "@/lib/mission/brief"
import type { PlaceBusiness, PlacesProvider, PlacesSearchResult } from "@/lib/places/types"
import { buildPlacesTextQuery } from "@/lib/places/query"
import { buildWhatsappUrl, createDataCompleteness } from "@/lib/places/utils"

const stateCities: Record<string, string[]> = {
  SP: ["São Paulo", "Campinas", "São Carlos", "Ribeirão Preto", "Sorocaba", "Santos", "Jundiaí", "Araraquara"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "Itajaí", "Chapecó", "Criciúma", "São José", "Jaraguá do Sul"],
  AM: ["Manaus", "Manaus", "Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Manaus", "Manaus"],
  MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora", "Contagem", "Uberaba", "Montes Claros", "Betim", "Divinópolis"],
  PR: ["Curitiba", "Londrina", "Maringá", "Cascavel", "Ponta Grossa", "Foz do Iguaçu", "São José dos Pinhais", "Colombo"],
  RJ: ["Rio de Janeiro", "Niterói", "Petrópolis", "Nova Iguaçu", "Volta Redonda", "Macaé", "Duque de Caxias", "Cabo Frio"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Novo Hamburgo", "Gravataí", "São Leopoldo"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Juazeiro", "Lauro de Freitas", "Barreiras"],
  PE: ["Recife", "Jaboatão", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Garanhuns"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Aquiraz"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Catalão", "Valparaíso", "Trindade"],
  DF: ["Brasília", "Taguatinga", "Águas Claras", "Ceilândia", "Gama", "Samambaia", "Guará", "Sobradinho"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas", "Castanhal", "Barcarena", "Abaetetuba"],
}

const regionCities: Record<string, string[]> = {
  Norte: ["Manaus", "Belém", "Porto Velho", "Macapá", "Palmas", "Rio Branco", "Boa Vista", "Santarém"],
  Nordeste: ["Salvador", "Recife", "Fortaleza", "São Luís", "Natal", "Maceió", "João Pessoa", "Teresina"],
  "Centro-Oeste": ["Brasília", "Goiânia", "Cuiabá", "Campo Grande", "Anápolis", "Dourados", "Rio Verde", "Rondonópolis"],
  Sudeste: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Campinas", "Vitória", "Ribeirão Preto", "Santos", "Uberlândia"],
  Sul: ["Curitiba", "Florianópolis", "Porto Alegre", "Joinville", "Londrina", "Caxias do Sul", "Maringá", "Blumenau"],
}

const countryCities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Salvador", "Manaus", "Recife", "Porto Alegre"]

const namesBySegment: Record<string, string[]> = {
  "Clínicas odontológicas": ["Clínica Prime", "Odonto Vida", "Sorriso Concept", "Instituto Oral", "Dentalis", "Clínica Vitta", "Odonto Center", "Sorriso Mais"],
  "Clínicas de estética": ["Essenza Estética", "Studio Vitta", "Clínica Lumina", "Belle Concept", "Instituto Aura", "Derma Prime", "Espaço Revita", "Clínica Harmonia"],
  Academias: ["Pulse Academia", "Body Move", "Arena Fitness", "Viva Training", "Strong Club", "Forma Studio", "Move Center", "Performance Gym"],
  Restaurantes: ["Casa Nobre", "Sabor & Brasa", "Bistrô Central", "Mesa Viva", "Quintal 27", "Villa Gourmet", "Cozinha Urbana", "Terraço 21"],
  "Auto centers": ["Prime Auto Center", "Box 7 Motors", "Auto Tech", "Garage Pro", "CentroCar", "Via Motors", "AutoMax", "Oficina Central"],
  Imobiliárias: ["Vitta Imóveis", "Prime House", "Cidade Imóveis", "Nexo Negócios", "Portal Imobiliária", "Haus Consultoria", "Nova Chave", "Urban Imóveis"],
  "Escritórios contábeis": ["Nexo Contábil", "Prime Gestão", "Atlas Contabilidade", "Conta Certa", "Valor Consultoria", "Integra Contábil", "Ponto Fiscal", "Base Contábil"],
  "Lojas de moda": ["Lumi Store", "Vitrine 27", "Casa Donna", "Urban Mood", "Bella Concept", "Nativa Moda", "Essencial Store", "Viva Moda"],
}

function resolveCities(brief: MissionBrief) {
  const location = brief.location
  if (location.scope === "city") return Array(8).fill(location.city?.trim() || "São Carlos") as string[]
  if (location.scope === "state") return stateCities[location.stateCode || "SP"] || Array(8).fill(location.state || "São Paulo")
  if (location.scope === "region") return regionCities[location.region || "Sudeste"] || regionCities.Sudeste
  return countryCities
}

function resolveNames(segment: string) {
  return namesBySegment[segment] || ["Empresa Horizonte", "Grupo Vitta", "Nexo Local", "Prime Soluções", "Casa Urbana", "Atlas Negócios", "Ponto Central", "Grupo Nova Era"]
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
}

export class DemoPlacesProvider implements PlacesProvider {
  async search(brief: MissionBrief): Promise<PlacesSearchResult> {
    const cities = resolveCities(brief)
    const names = resolveNames(brief.segment)
    const query = buildPlacesTextQuery(brief)

    const companies: PlaceBusiness[] = names.map((name, index) => {
      const city = cities[index % cities.length]
      const phone = index === 4 ? undefined : `(11) 9${String(7812 + index * 137).padStart(4, "0")}-${String(3400 + index * 211).slice(-4)}`
      const website = index === 1 || index === 4 ? undefined : `https://${slugify(name)}.com.br`
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${city}`)}`
      const address = `${index % 2 === 0 ? "Av." : "Rua"} ${index % 2 === 0 ? "Central" : "das Palmeiras"}, ${420 + index * 173} - Centro, ${city}`
      const openingHours = {
        openNow: index % 3 !== 0,
        weekdayDescriptions: [
          "segunda-feira: 08:00–18:00",
          "terça-feira: 08:00–18:00",
          "quarta-feira: 08:00–18:00",
          "quinta-feira: 08:00–18:00",
          "sexta-feira: 08:00–18:00",
          "sábado: 08:00–12:00",
          "domingo: Fechado",
        ],
      }

      const company: PlaceBusiness = {
        id: `demo-${slugify(name)}-${index + 1}`,
        placeId: `demo-place-${index + 1}`,
        name,
        city,
        state: brief.location.state,
        stateCode: brief.location.stateCode,
        postalCode: `1356${index}-000`,
        address,
        phone,
        internationalPhone: phone ? `+55 ${phone}` : undefined,
        whatsappUrl: buildWhatsappUrl(phone),
        website,
        mapsUrl,
        rating: Number((4.3 + (index % 6) * 0.1).toFixed(1)),
        reviews: 42 + index * 57,
        category: brief.segment,
        businessStatus: "OPERATIONAL",
        coordinates: {
          latitude: -22.0 - index * 0.01,
          longitude: -47.0 - index * 0.01,
        },
        openingHours,
        source: "demo",
        dataCompleteness: {
          address: false,
          phone: false,
          website: false,
          maps: false,
          openingHours: false,
        },
      }

      company.dataCompleteness = createDataCompleteness(company)
      return company
    })

    return {
      mode: "demo",
      companies,
      query,
      notice: "Modo demonstração ativo. A integração com Google Places está pronta e será ativada automaticamente quando a chave for adicionada.",
    }
  }
}

export const demoPlacesProvider = new DemoPlacesProvider()
