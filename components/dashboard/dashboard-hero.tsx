import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  Gauge,
  MessageSquareText,
  Rocket,
  Target,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const stats = [
  {
    icon: Building2,
    value: "12.847",
    label: "empresas analisadas",
    detail: "+1.284 hoje",
  },
  {
    icon: Target,
    value: "23",
    label: "oportunidades críticas",
    detail: "score acima de 85",
  },
  {
    icon: MessageSquareText,
    value: "14",
    label: "abordagens prontas",
    detail: "personalizadas pela IA",
  },
  {
    icon: CheckCircle2,
    value: "8",
    label: "negociações atualizadas",
    detail: "sem ação manual",
  },
]

export function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_32%)]" />

      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative p-6 md:p-8 xl:p-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-5 border-white/10 bg-white/10 text-white hover:bg-white/10">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Inteligência comercial ativa
            </Badge>

            <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
              Central de Operações
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Boa tarde, Juan.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
              Enquanto você estava fora, o LeadFlow pesquisou empresas,
              encontrou oportunidades e preparou suas próximas ações.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Clock3 className="mr-2 h-4 w-4" />
              Ver histórico
            </Button>

            <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
              <Rocket className="mr-2 h-4 w-4" />
              Iniciar missão
            </Button>
          </div>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-zinc-200">
                    <Icon className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-zinc-600 transition group-hover:text-zinc-300" />
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {stat.label}
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  {stat.detail}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Flame className="h-4 w-4 text-orange-400" />
              Melhor oportunidade de hoje
            </div>

            <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">
                  Vender landing pages para clínicas odontológicas
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  Alta demanda, baixa maturidade digital e ótimo potencial de
                  ticket.
                </p>
              </div>

              <Button className="shrink-0 bg-indigo-500 text-white hover:bg-indigo-400">
                Explorar 23 empresas
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  Confiança da IA
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  94%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                <Gauge className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[94%] rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}