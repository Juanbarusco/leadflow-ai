"use client"

import { useEffect, useState } from "react"
import {
  Bot,
  CheckCircle2,
  CircleDot,
  Clock3,
  Globe2,
  LoaderCircle,
  Map,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  Target,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const stages = [
  {
    label: "Google Maps",
    icon: Map,
  },
  {
    label: "Sites",
    icon: Globe2,
  },
  {
    label: "Instagram",
    icon: Search,
  },
  {
    label: "SEO",
    icon: Sparkles,
  },
  {
    label: "WhatsApp",
    icon: MessageSquareText,
  },
]

const liveEvents = [
  "Empresa encontrada: Clínica Dental Prime",
  "Instagram localizado",
  "Site com carregamento lento",
  "SEO abaixo da média",
  "Landing page inexistente",
  "Abordagem personalizada criada",
  "Lead enviado ao Pipeline",
]

export function MissionControl() {
  const [progress, setProgress] = useState(62)
  const [activeStage, setActiveStage] = useState(3)
  const [visibleEvents, setVisibleEvents] = useState(4)

  useEffect(() => {
    const progressInterval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 94) {
          return 62
        }

        return current + 1
      })
    }, 900)

    const stageInterval = window.setInterval(() => {
      setActiveStage((current) => {
        if (current >= stages.length - 1) {
          return 0
        }

        return current + 1
      })
    }, 2600)

    const eventInterval = window.setInterval(() => {
      setVisibleEvents((current) => {
        if (current >= liveEvents.length) {
          return 3
        }

        return current + 1
      })
    }, 2200)

    return () => {
      window.clearInterval(progressInterval)
      window.clearInterval(stageInterval)
      window.clearInterval(eventInterval)
    }
  }, [])

  return (
    <Card className="overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
      <div className="relative p-6 md:p-8">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
                <CircleDot className="mr-1.5 h-3 w-3 animate-pulse text-emerald-400" />
                Missão em execução
              </Badge>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Mission Control
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Encontrar clínicas odontológicas em Campinas
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                A IA está pesquisando empresas, analisando presença digital,
                calculando potencial comercial e preparando abordagens.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Pausar missão
              </Button>

              <Button className="bg-white text-zinc-950 hover:bg-zinc-200">
                <Bot className="mr-2 h-4 w-4" />
                Abrir detalhes
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Progresso da missão</p>

                  <p className="mt-2 text-5xl font-semibold tracking-tight">
                    {progress}%
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Clock3 className="h-4 w-4" />
                  1min 32s restantes
                </div>
              </div>

              <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {stages.map((stage, index) => {
                  const Icon = stage.icon
                  const completed = index < activeStage
                  const active = index === activeStage

                  return (
                    <div
                      key={stage.label}
                      className={`rounded-2xl border p-4 transition-all ${
                        active
                          ? "border-indigo-400/30 bg-indigo-500/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          completed
                            ? "bg-emerald-400/10 text-emerald-400"
                            : active
                              ? "bg-indigo-400/10 text-indigo-400"
                              : "bg-white/5 text-zinc-500"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : active ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>

                      <p className="mt-3 text-sm font-medium">{stage.label}</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {completed
                          ? "Concluído"
                          : active
                            ? "Processando"
                            : "Aguardando"}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500">Empresas encontradas</p>
                  <p className="mt-2 text-2xl font-semibold">32</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500">Com alto potencial</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-400">
                    18
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500">Mensagens prontas</p>
                  <p className="mt-2 text-2xl font-semibold">7</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500">Valor potencial</p>
                  <p className="mt-2 text-2xl font-semibold text-violet-400">
                    R$ 12.400
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Execução ao vivo</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Eventos mais recentes da missão
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Online
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {liveEvents.slice(0, visibleEvents).map((event, index) => (
                  <div
                    key={`${event}-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      {index === visibleEvents - 1 ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-zinc-200">{event}</p>

                      <p className="mt-1 text-xs text-zinc-600">
                        há {index + 1} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-4 w-4 text-indigo-400" />

                  <div>
                    <p className="text-sm font-medium">
                      Próxima etapa automática
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-400">
                      Gerar mensagens personalizadas e enviar os melhores leads
                      para o Pipeline.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="mt-5 w-full bg-indigo-500 text-white hover:bg-indigo-400">
                <Send className="mr-2 h-4 w-4" />
                Acelerar execução
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}