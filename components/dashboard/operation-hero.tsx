import {
  Building2,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const activities = [
  {
    icon: Building2,
    value: "1.284",
    label: "empresas analisadas",
  },
  {
    icon: TrendingUp,
    value: "21",
    label: "oportunidades encontradas",
  },
  {
    icon: MessageSquareText,
    value: "14",
    label: "abordagens preparadas",
  },
  {
    icon: CheckCircle2,
    value: "8",
    label: "negociações atualizadas",
  },
]

export function OperationHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm md:p-8">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <Badge variant="secondary" className="mb-4 gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          Inteligência comercial ativa
        </Badge>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Boa tarde, Juan.
        </h1>

        <p className="mt-2 text-lg text-muted-foreground">
          Enquanto você estava fora, o LeadFlow continuou trabalhando.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {activities.map((activity) => {
            const Icon = activity.icon

            return (
              <div
                key={activity.label}
                className="rounded-2xl border bg-background/70 p-4 backdrop-blur"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-2xl font-semibold">{activity.value}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.label}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border bg-background/60 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Melhor oportunidade de hoje
            </p>

            <p className="mt-1 text-lg font-semibold">
              Vender landing pages para clínicas odontológicas
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Alta demanda, baixa maturidade digital e bom potencial de ticket.
            </p>
          </div>

          <Button>
            Ver oportunidades
          </Button>
        </div>
      </div>
    </section>
  )
}