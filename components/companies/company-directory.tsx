"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Target,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { useLastMission } from "@/hooks/mission/use-last-mission"
import type { MissionCompany } from "@/lib/engines/mission-engine"
import { cn } from "@/lib/utils"

type PriorityFilter = "all" | "high" | "medium" | "low"

const filters: Array<{ value: PriorityFilter; label: string }> = [
  { value: "all", label: "Todas" },
  { value: "high", label: "Alta prioridade" },
  { value: "medium", label: "Média" },
  { value: "low", label: "Baixa" },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

export function CompanyDirectory() {
  const mission = useLastMission()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [priority, setPriority] = useState<PriorityFilter>("all")

  const companies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR")

    return (mission?.companies ?? []).filter((company) => {
      const matchesPriority = priority === "all" || company.leadScore.priority === priority
      const matchesQuery =
        !normalizedQuery ||
        company.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        company.city.toLocaleLowerCase("pt-BR").includes(normalizedQuery)

      return matchesPriority && matchesQuery
    })
  }, [mission, priority, query])

  function openCompany(company: MissionCompany) {
    window.sessionStorage.setItem(`leadflow-company:${company.id}`, JSON.stringify(company))
    router.push(`/company/${company.id}`)
  }

  if (!mission) {
    return (
      <div className="mx-auto grid min-h-[calc(100vh-190px)] max-w-2xl place-items-center py-12 text-center">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-violet-50 text-violet-600">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.035em] text-zinc-950">
            Sua lista começa com uma prospecção.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-zinc-600">
            Assim que a IA concluir uma missão, as empresas qualificadas aparecem aqui para pesquisa e análise.
          </p>
          <Link
            href="/prospecting"
            className={cn(
              buttonVariants(),
              "mt-7 h-11 rounded-xl bg-zinc-950 px-5 text-white hover:bg-zinc-800",
            )}
          >
            <Sparkles className="mr-2 h-4 w-4 text-violet-300" />
            Criar primeira prospecção
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] pb-20 pt-4 sm:pt-8">
      <header className="grid gap-7 border-b border-zinc-200 pb-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Workspace comercial</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl">
            Empresas
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Oportunidades da última missão em <strong className="font-semibold text-zinc-950">{mission.city}</strong>, organizadas pela chance de contratação.
          </p>
          <span className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${mission.dataSource === "google_places" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
            {mission.dataSource === "google_places" ? "Dados reais · Google Places" : "Modo demonstração"}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-zinc-950">{mission.companies.length}</p>
            <p className="mt-1 text-xs text-zinc-500">empresas analisadas</p>
          </div>
          <div className="h-10 w-px bg-zinc-200" />
          <div>
            <p className="text-3xl font-semibold tracking-tight text-zinc-950">
              {mission.companies.filter((company) => company.leadScore.priority === "high").length}
            </p>
            <p className="mt-1 text-xs text-zinc-500">prioridade alta</p>
          </div>
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por empresa ou cidade..."
            className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:shadow-lg focus:shadow-zinc-950/[0.04]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setPriority(filter.value)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-xs font-semibold transition",
                priority === filter.value
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {companies.length ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {companies.map((company, index) => (
            <button
              key={company.id}
              type="button"
              onClick={() => openCompany(company)}
              className="group rounded-[26px] border border-zinc-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-950/[0.06] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-xs font-semibold text-white">
                    {company.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      #{index + 1} no ranking
                    </p>
                    <h2 className="mt-1 font-semibold text-zinc-950">{company.name}</h2>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {company.leadScore.score}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {company.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {company.rating > 0 ? `${company.rating.toFixed(1)} · ${company.reviews} avaliações` : "Sem avaliações públicas"}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-y border-zinc-100 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">Melhor oferta</p>
                  <p className="mt-1 text-sm font-medium text-zinc-800">
                    {company.websiteAnalysis.recommendedServices[0] || "Presença digital"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">Potencial</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-950">
                    {formatCurrency(company.websiteAnalysis.estimatedSaleMax)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700">
                  <Target className="h-3.5 w-3.5" />
                  {company.leadScore.priority === "high" ? "Alta prioridade" : "Oportunidade qualificada"}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition group-hover:bg-zinc-950 group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-[28px] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <Search className="mx-auto h-6 w-6 text-zinc-400" />
          <h2 className="mt-4 font-semibold text-zinc-950">Nenhuma empresa encontrada</h2>
          <p className="mt-1 text-sm text-zinc-500">Tente outro termo ou remova o filtro de prioridade.</p>
        </div>
      )}
    </div>
  )
}
