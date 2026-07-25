import {
  ArrowUpRight,
  BadgeDollarSign,
  BrainCircuit,
  CalendarClock,
  CircleDollarSign,
  Flame,
  Gauge,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const bars = [38, 52, 47, 66, 58, 74, 69, 82, 76, 91, 86, 96]

const actions = [
  {
    title: "Responder 4 leads quentes",
    detail: "Tempo médio sem resposta: 46 min",
    icon: Flame,
    tone: "bg-orange-500/10 text-orange-600",
  },
  {
    title: "Revisar 3 propostas",
    detail: "R$ 12.800 em receita potencial",
    icon: BadgeDollarSign,
    tone: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Agendar follow-up",
    detail: "6 contatos entram na janela ideal hoje",
    icon: CalendarClock,
    tone: "bg-indigo-500/10 text-indigo-600",
  },
]

export function ExecutiveOverview() {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
      <Card className="overflow-hidden rounded-[30px] border p-0 shadow-sm">
        <div className="border-b bg-muted/20 px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="outline" className="mb-3">
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                Performance comercial
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight">Receita potencial em aceleração</h2>
              <p className="mt-1 text-sm text-muted-foreground">Projeção consolidada com base em propostas, score e estágio do pipeline.</p>
            </div>
            <Button variant="outline" size="sm">
              Ver análise
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Receita potencial</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">R$ 48.640</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              +18,4% nos últimos 30 dias
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Ticket médio</p>
                <p className="mt-1 text-xl font-semibold">R$ 2.840</p>
              </div>
              <div className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">Conversão</p>
                <p className="mt-1 text-xl font-semibold">31%</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border bg-zinc-950 p-5 text-white">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Evolução da oportunidade</p>
                <p className="mt-1 text-xs text-zinc-500">Últimas 12 semanas</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Tendência positiva
              </div>
            </div>

            <div className="flex h-44 items-end gap-2">
              {bars.map((height, index) => (
                <div key={index} className="group flex h-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 opacity-75 transition duration-300 group-hover:opacity-100"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[30px] border p-6 shadow-sm sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3">
              <BrainCircuit className="mr-1.5 h-3.5 w-3.5" />
              Próximas ações
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Onde agir agora</h2>
            <p className="mt-1 text-sm text-muted-foreground">Prioridades calculadas pela IA para maximizar fechamento.</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/10 text-violet-600">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button key={action.title} className="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${action.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{action.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{action.detail}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
              </button>
            )
          })}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t pt-5 text-center">
          <div>
            <Target className="mx-auto h-4 w-4 text-indigo-500" />
            <p className="mt-2 text-lg font-semibold">23</p>
            <p className="text-[11px] text-muted-foreground">leads críticos</p>
          </div>
          <div>
            <Gauge className="mx-auto h-4 w-4 text-emerald-500" />
            <p className="mt-2 text-lg font-semibold">92%</p>
            <p className="text-[11px] text-muted-foreground">confiança IA</p>
          </div>
          <div>
            <CircleDollarSign className="mx-auto h-4 w-4 text-amber-500" />
            <p className="mt-2 text-lg font-semibold">R$ 8,4k</p>
            <p className="text-[11px] text-muted-foreground">mais provável</p>
          </div>
        </div>
      </Card>
    </section>
  )
}
