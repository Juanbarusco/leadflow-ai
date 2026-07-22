import {
  ArrowUpRight,
  AtSign,
  Building2,
  Flame,
  Globe2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const opportunities = [
  {
    company: "Clínica Sorriso Prime",
    segment: "Odontologia",
    location: "Campinas, SP",
    score: 96,
    opportunity: "Landing page",
    reason: "Site antigo, Instagram ativo e agendamento pouco eficiente.",
    signals: ["Site lento", "SEO fraco", "Anúncios ativos"],
  },
  {
    company: "Instituto Bella Vita",
    segment: "Estética",
    location: "Campinas, SP",
    score: 92,
    opportunity: "Automação comercial",
    reason: "Alta demanda no WhatsApp e atendimento completamente manual.",
    signals: ["Muitas avaliações", "Sem funil", "Alta procura"],
  },
  {
    company: "Odonto Care Campinas",
    segment: "Odontologia",
    location: "Campinas, SP",
    score: 88,
    opportunity: "Captação de leads",
    reason: "Boa reputação, mas baixa presença orgânica no Google.",
    signals: ["Boa reputação", "SEO baixo", "Ticket alto"],
  },
]

export function CommercialRadar() {
  return (
    <Card className="overflow-hidden rounded-[28px] border shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Radar Comercial
            </Badge>

            <CardTitle className="text-2xl">
              27 empresas valem seu tempo agora
            </CardTitle>

            <CardDescription className="mt-2 max-w-2xl">
              A IA analisou 382 empresas em Campinas e priorizou apenas as que
              possuem sinais reais de oportunidade.
            </CardDescription>
          </div>

          <Button>
            Abrir radar completo
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-5">
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border bg-muted/30 p-3 md:flex-row md:items-center">
          <Search className="h-5 w-5 text-muted-foreground" />

          <input
            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Ex.: dentistas em Campinas"
          />

          <Button className="md:px-6">Analisar mercado</Button>
        </div>

        <div className="space-y-3">
          {opportunities.map((item, index) => (
            <div
              key={item.company}
              className="group rounded-2xl border bg-background p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        #{index + 1}
                      </span>

                      <h3 className="font-semibold">{item.company}</h3>

                      <Badge variant="secondary">{item.segment}</Badge>
                    </div>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </p>

                    <p className="mt-4 text-sm leading-6">{item.reason}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.signals.map((signal) => (
                        <Badge key={signal} variant="outline">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-5 xl:flex-col xl:items-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Score da IA</p>

                    <p className="mt-1 text-3xl font-semibold">
                      {item.score}
                      <span className="text-sm text-muted-foreground">/100</span>
                    </p>

                    <div className="mt-2 flex justify-end gap-0.5">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <Flame className="h-4 w-4 text-orange-500" />
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    Ver diagnóstico
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe2 className="h-4 w-4" />
                  Presença digital analisada
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AtSign className="h-4 w-4" />
                  Redes sociais verificadas
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  IA recomenda: {item.opportunity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}