"use client"

import { useMemo, useState } from "react"
import {
  Check,
  ChevronDown,
  Globe2,
  Map,
  MapPin,
  Navigation,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BRAZILIAN_REGIONS,
  BRAZILIAN_STATES,
  formatMissionLocation,
  type MissionLocation,
  type MissionLocationScope,
} from "@/lib/mission/brief"
import { cn } from "@/lib/utils"

type LocationPickerProps = {
  value: MissionLocation
  onChange: (location: MissionLocation) => void
  className?: string
  dark?: boolean
}

const scopeOptions: Array<{
  value: MissionLocationScope
  label: string
  description: string
  icon: typeof Globe2
}> = [
  {
    value: "country",
    label: "Brasil inteiro",
    description: "Cobertura nacional",
    icon: Globe2,
  },
  {
    value: "region",
    label: "Região",
    description: "Norte, Sul, Sudeste...",
    icon: Map,
  },
  {
    value: "state",
    label: "Estado",
    description: "Ex.: Santa Catarina",
    icon: Navigation,
  },
  {
    value: "city",
    label: "Cidade e raio",
    description: "Ex.: Manaus + 100 km",
    icon: MapPin,
  },
]

const radiusOptions = [10, 25, 50, 100, 200] as const

function getStateByCode(code?: string) {
  return BRAZILIAN_STATES.find((state) => state.code === code)
}

export function LocationPicker({
  value,
  onChange,
  className,
  dark = false,
}: LocationPickerProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<MissionLocation>(value)


  const canApply = useMemo(() => {
    if (draft.scope === "region") return Boolean(draft.region)
    if (draft.scope === "state") return Boolean(draft.state)
    if (draft.scope === "city") return Boolean(draft.city?.trim() && draft.stateCode)
    return true
  }, [draft])

  function updateScope(scope: MissionLocationScope) {
    if (scope === "country") {
      setDraft({ scope: "country" })
      return
    }

    if (scope === "region") {
      setDraft({ scope: "region", region: value.region || "Sudeste" })
      return
    }

    if (scope === "state") {
      const currentState = getStateByCode(value.stateCode)
      setDraft({
        scope: "state",
        state: value.state || currentState?.name || "São Paulo",
        stateCode: value.stateCode || currentState?.code || "SP",
      })
      return
    }

    setDraft({
      scope: "city",
      city: value.city || "São Carlos",
      state: value.state || "São Paulo",
      stateCode: value.stateCode || "SP",
      radiusKm: value.radiusKm || 50,
    })
  }

  function applyLocation() {
    if (!canApply) return
    onChange(draft)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDraft(value)
          setOpen(true)
        }}
        className={cn(
          "group flex min-h-14 min-w-0 items-center gap-3 rounded-2xl border px-4 text-left transition-all",
          dark
            ? "border-white/10 bg-white/[0.06] text-white hover:border-white/20 hover:bg-white/[0.09]"
            : "border-zinc-200 bg-white text-zinc-950 shadow-sm hover:border-zinc-300 hover:shadow-md",
          className,
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            dark ? "bg-white/10 text-violet-200" : "bg-violet-50 text-violet-600",
          )}
        >
          <MapPin className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block text-[10px] font-semibold uppercase tracking-[0.16em]",
              dark ? "text-zinc-500" : "text-zinc-400",
            )}
          >
            Onde buscar
          </span>
          <span className="mt-0.5 block truncate text-sm font-semibold">
            {formatMissionLocation(value)}
          </span>
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5",
            dark ? "text-zinc-500" : "text-zinc-400",
          )}
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-[28px] p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-zinc-200 px-6 py-6 sm:px-8">
            <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-950">
              Onde a IA deve procurar?
            </DialogTitle>
            <DialogDescription className="max-w-lg leading-6">
              Escolha uma cobertura ampla ou concentre a prospecção em uma cidade e defina o raio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-7 px-6 py-6 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {scopeOptions.map((option) => {
                const Icon = option.icon
                const selected = draft.scope === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateScope(option.value)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                      selected
                        ? "border-violet-500 bg-violet-50 shadow-[0_0_0_3px_rgba(139,92,246,.08)]"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        selected ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-600",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-zinc-950">{option.label}</span>
                        {selected ? <Check className="h-4 w-4 text-violet-600" /> : null}
                      </span>
                      <span className="mt-1 block text-sm text-zinc-500">
                        {option.description}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            {draft.scope === "country" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="font-semibold text-emerald-950">Cobertura nacional</p>
                <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                  A IA poderá priorizar as cidades com maior volume de oportunidades para o segmento escolhido.
                </p>
              </div>
            ) : null}

            {draft.scope === "region" ? (
              <label className="block">
                <span className="text-sm font-semibold text-zinc-950">Região do Brasil</span>
                <select
                  value={draft.region || "Sudeste"}
                  onChange={(event) => setDraft({ scope: "region", region: event.target.value })}
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  {BRAZILIAN_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {draft.scope === "state" ? (
              <label className="block">
                <span className="text-sm font-semibold text-zinc-950">Estado</span>
                <select
                  value={draft.stateCode || "SP"}
                  onChange={(event) => {
                    const state = getStateByCode(event.target.value)
                    setDraft({
                      scope: "state",
                      state: state?.name || "São Paulo",
                      stateCode: state?.code || "SP",
                    })
                  }}
                  className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  {BRAZILIAN_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {draft.scope === "city" ? (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-[1fr_190px]">
                  <label className="block">
                    <span className="text-sm font-semibold text-zinc-950">Cidade</span>
                    <input
                      value={draft.city || ""}
                      onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))}
                      placeholder="Ex.: Manaus, Florianópolis, São Paulo..."
                      className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-zinc-950">Estado</span>
                    <select
                      value={draft.stateCode || "SP"}
                      onChange={(event) => {
                        const state = getStateByCode(event.target.value)
                        setDraft((current) => ({
                          ...current,
                          state: state?.name || "São Paulo",
                          stateCode: state?.code || "SP",
                        }))
                      }}
                      className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    >
                      {BRAZILIAN_STATES.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.code}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-950">Raio de busca</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {radiusOptions.map((radius) => {
                      const selected = draft.radiusKm === radius
                      return (
                        <button
                          key={radius}
                          type="button"
                          onClick={() => setDraft((current) => ({ ...current, radiusKm: radius }))}
                          className={cn(
                            "rounded-xl border px-4 py-2 text-sm font-medium transition",
                            selected
                              ? "border-zinc-950 bg-zinc-950 text-white"
                              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950",
                          )}
                        >
                          {radius} km
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="mx-0 mb-0 rounded-none rounded-b-[28px] px-6 py-5 sm:px-8">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-5"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-11 rounded-xl bg-zinc-950 px-5 text-white hover:bg-zinc-800"
              disabled={!canApply}
              onClick={applyLocation}
            >
              Usar esta região
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
