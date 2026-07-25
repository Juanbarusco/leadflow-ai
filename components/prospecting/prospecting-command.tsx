"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Command,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react"

import { LocationPicker } from "@/components/prospecting/location-picker"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useActiveMissionBrief } from "@/hooks/mission/use-active-mission-brief"
import {
  QUICK_MISSION_TEMPLATES,
  SEGMENT_OPTIONS,
  type MissionLocation,
} from "@/lib/mission/brief"
import { cn } from "@/lib/utils"

type ProspectingCommandProps = {
  variant?: "dashboard" | "standalone"
}

export function ProspectingCommand({ variant = "dashboard" }: ProspectingCommandProps) {
  const router = useRouter()
  const { brief, setBrief } = useActiveMissionBrief()
  const [objective, setObjective] = useState(brief.objective)
  const [segment, setSegment] = useState(brief.segment)
  const [location, setLocation] = useState<MissionLocation>(brief.location)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    router.prefetch("/mission")
  }, [router])

  const objectiveLength = objective.trim().length
  const canSubmit = objectiveLength >= 12 && !submitting

  const helperText = useMemo(() => {
    if (!objectiveLength) return "Descreva o tipo de oportunidade. A localização fica separada."
    if (objectiveLength < 12) return "Conte um pouco mais para a IA entender o perfil ideal."
    return "Contexto suficiente. A IA vai combinar objetivo, segmento e região."
  }, [objectiveLength])

  function applyTemplate(template: (typeof QUICK_MISSION_TEMPLATES)[number]) {
    setObjective(template.objective)
    setSegment(template.segment)
    setError(null)
  }

  function submitMission() {
    if (!canSubmit) {
      setError("Descreva com um pouco mais de detalhe quem você quer encontrar.")
      return
    }

    const nextBrief = {
      objective: objective.trim(),
      segment,
      location,
      createdAt: new Date().toISOString(),
    }

    setSubmitting(true)
    setBrief(nextBrief)
    router.push("/mission")
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      submitMission()
    }
  }

  const standalone = variant === "standalone"

  return (
    <section
      id="nova-prospeccao"
      className={cn(
        "relative isolate overflow-hidden border border-zinc-800 bg-zinc-950 text-white shadow-2xl shadow-zinc-950/10",
        standalone ? "rounded-[36px]" : "rounded-[32px]",
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:46px_46px]" />

      <div
        className={cn(
          "relative",
          standalone ? "px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14" : "px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10",
        )}
      >
        <div className={cn("max-w-3xl", standalone && "max-w-4xl")}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15">
              <Bot className="h-3.5 w-3.5" />
            </span>
            Copiloto comercial
          </div>

          <h2
            className={cn(
              "mt-5 font-semibold tracking-[-0.035em]",
              standalone ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-[44px]",
            )}
          >
            Quem vamos encontrar hoje?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
            Diga o tipo de oportunidade. Escolha a região separadamente e deixe a IA montar a prospecção.
          </p>
        </div>

        <div className={cn("mt-8", standalone ? "max-w-5xl" : "max-w-6xl")}>
          <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-2 shadow-[0_28px_80px_rgba(0,0,0,.28)] backdrop-blur-sm sm:p-3">
            <div className="flex gap-3 rounded-[20px] bg-white p-3 text-zinc-950 sm:p-4">
              <div className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 sm:flex">
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <label htmlFor="mission-objective" className="sr-only">
                  Objetivo da prospecção
                </label>
                <textarea
                  id="mission-objective"
                  value={objective}
                  onChange={(event) => {
                    setObjective(event.target.value)
                    setError(null)
                  }}
                  onKeyDown={onKeyDown}
                  rows={standalone ? 3 : 2}
                  placeholder="Ex.: empresas com Instagram ativo, mas sem site preparado para gerar contatos..."
                  className={cn(
                    "w-full resize-none border-0 bg-transparent p-0 font-medium leading-7 text-zinc-950 outline-none placeholder:font-normal placeholder:text-zinc-400",
                    standalone ? "text-lg sm:text-xl" : "text-base sm:text-lg",
                  )}
                />

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3">
                  <p className={cn("text-xs", error ? "text-red-600" : "text-zinc-500")}>
                    {error || helperText}
                  </p>
                  <div className="hidden items-center gap-1.5 text-[11px] text-zinc-400 sm:flex">
                    <Command className="h-3 w-3" />
                    Enter
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 grid gap-2 lg:grid-cols-[minmax(260px,1.35fr)_minmax(220px,.95fr)_auto]">
              <LocationPicker value={location} onChange={setLocation} dark />

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="group flex min-h-14 min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-left text-white transition-all hover:border-white/20 hover:bg-white/[0.09]"
                    />
                  }
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-violet-200">
                    <Search className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Segmento
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-semibold">{segment}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-data-[popup-open]:rotate-180" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={8}
                  className="min-w-[280px] rounded-2xl p-2 shadow-xl"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
                      Priorizar segmento
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {SEGMENT_OPTIONS.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setSegment(option)}
                        className="rounded-xl px-3 py-2.5"
                      >
                        <span className="flex-1">{option}</span>
                        {segment === option ? <Check className="h-4 w-4 text-violet-600" /> : null}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                onClick={submitMission}
                disabled={!canSubmit}
                className="min-h-14 rounded-2xl bg-white px-6 text-sm font-semibold text-zinc-950 shadow-xl shadow-black/20 hover:bg-zinc-100 disabled:bg-white/40 disabled:text-zinc-500 lg:min-w-[230px]"
              >
                {submitting ? (
                  <WandSparkles className="mr-2 h-4 w-4 animate-pulse" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4 text-violet-600" />
                )}
                Encontrar oportunidades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="shrink-0 text-xs font-medium text-zinc-500">Comece com uma ideia:</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_MISSION_TEMPLATES.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
