"use client"

import { useEffect, useState } from "react"
import {
  Bot,
  CheckCircle2,
  CircleDot,
  LoaderCircle,
  Search,
  Sparkles,
  Target,
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

const steps = [
  {
    icon: Search,
    text: "Analisando empresas em Campinas e região...",
  },
  {
    icon: Target,
    text: "Filtrando empresas com maior potencial comercial...",
  },
  {
    icon: Sparkles,
    text: "Cruzando presença digital, reputação e concorrência...",
  },
  {
    icon: Bot,
    text: "Preparando estratégia e abordagem personalizada...",
  },
]

export function AIThinkingPanel() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= steps.length - 1) {
          return 0
        }

        return current + 1
      })
    }, 2200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <Card className="overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 text-white shadow-xl">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="mb-3 border-white/10 bg-white/10 text-white hover:bg-white/10">
              <CircleDot className="mr-1.5 h-3 w-3 animate-pulse text-emerald-400" />
              Processamento ao vivo
            </Badge>

            <CardTitle className="flex items-center gap-2 text-xl">
              <Bot className="h-5 w-5 text-indigo-400" />
              IA pensando
            </CardTitle>

            <CardDescription className="mt-2 text-zinc-400">
              O LeadFlow está analisando o mercado e preparando sua próxima
              ação.
            </CardDescription>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            const completed = index < activeStep
            const active = index === activeStep

            return (
              <div
                key={step.text}
                className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                  active
                    ? "border-indigo-400/30 bg-indigo-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    completed
                      ? "bg-emerald-400/10 text-emerald-400"
                      : active
                        ? "bg-indigo-400/10 text-indigo-400"
                        : "bg-white/5 text-zinc-500"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : active ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      active ? "font-medium text-white" : "text-zinc-400"
                    }`}
                  >
                    {step.text}
                  </p>

                  {active && (
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-400" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-400">
            Oportunidade parcial detectada
          </p>

          <p className="mt-2 text-lg font-semibold">
            R$ 18.700 em potencial comercial
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Baseado em 23 empresas com score acima de 85.
          </p>
        </div>

        <Button className="mt-5 w-full bg-white text-zinc-950 hover:bg-zinc-200">
          Acompanhar análise completa
        </Button>
      </CardContent>
    </Card>
  )
}