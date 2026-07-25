"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  MessageSquareText,
  PhoneCall,
  Sparkles,
} from "lucide-react"

import { ProspectingCommand } from "@/components/prospecting/prospecting-command"
import { useLastMission } from "@/hooks/mission/use-last-mission"
import type { MissionCompany } from "@/lib/engines/mission-engine"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AttentionItem = {
  id: string
  icon: typeof PhoneCall
  eyebrow: string
  title: string
  description: string
  action: string
  href: string
}

const attentionItems: AttentionItem[] = [
  {
    id: "follow-up",
    icon: PhoneCall,
    eyebrow: "Retorno",
    title: "2 empresas esperam sua ligação",
    description: "Elas pediram um novo contato para hoje.",
    action: "Ver contatos",
    href: "/companies",
  },
  {
    id: "messages",
    icon: MessageSquareText,
    eyebrow: "Abordagem",
    title: "4 mensagens estão prontas",
    description: "A IA personalizou os textos para cada oportunidade.",
    action: "Revisar mensagens",
    href: "/mission#opportunities",
  },
  {
    id: "meeting",
    icon: CalendarCheck2,
    eyebrow: "Reunião",
    title: "Prepare a conversa com a Clínica Prime",
    description: "Argumentos e objeções prováveis já foram separados.",
    action: "Abrir briefing",
    href: "/mission#mission-summary",
  },
]

type RecentCompany = {
  initials: string
  name: string
  city: string
  score: number
  opportunity: string
  potential: string
  company?: MissionCompany
}

const fallbackRecentCompanies: RecentCompany[] = [
  {
    initials: "CP",
    name: "Clínica Prime",
    city: "São Carlos, SP",
    score: 94,
    opportunity: "Landing page e captação",
    potential: "R$ 6.000",
  },
  {
    initials: "OV",
    name: "Odonto Vida",
    city: "Araraquara, SP",
    score: 91,
    opportunity: "Site institucional",
    potential: "R$ 4.500",
  },
  {
    initials: "SC",
    name: "Sorriso Concept",
    city: "Campinas, SP",
    score: 88,
    opportunity: "Automação de atendimento",
    potential: "R$ 7.200",
  },
]

export function DailyBriefing() {
  const router = useRouter()
  const mission = useLastMission()
  const [completed, setCompleted] = useState<string[]>([])

  const pendingItems = useMemo(
    () => attentionItems.filter((item) => !completed.includes(item.id)),
    [completed],
  )

  const recentCompanies = useMemo<RecentCompany[]>(() => {
    if (!mission?.companies.length) return fallbackRecentCompanies

    return mission.companies.slice(0, 3).map((company) => ({
      initials: company.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join(""),
      name: company.name,
      city: company.city,
      score: company.leadScore.score,
      opportunity: company.websiteAnalysis.recommendedServices[0] || "Presença digital",
      potential: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(company.websiteAnalysis.estimatedSaleMax),
      company,
    }))
  }, [mission])

  const summaryMetrics = useMemo(() => {
    if (!mission?.companies.length) {
      return [
        { value: "18", label: "empresas encontradas" },
        { value: "7", label: "oportunidades prioritárias" },
        { value: "R$ 41,8 mil", label: "potencial estimado" },
      ]
    }

    const priorityCount = mission.companies.filter((company) => company.leadScore.priority === "high").length
    const potential = mission.companies.reduce(
      (total, company) => total + company.websiteAnalysis.estimatedSaleMax,
      0,
    )

    return [
      { value: String(mission.companies.length), label: "empresas encontradas" },
      { value: String(priorityCount), label: "oportunidades prioritárias" },
      {
        value: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(potential),
        label: "potencial estimado",
      },
    ]
  }, [mission])

  function openRecentCompany(item: RecentCompany) {
    if (!item.company) {
      router.push("/mission")
      return
    }

    window.sessionStorage.setItem(`leadflow-company:${item.company.id}`, JSON.stringify(item.company))
    router.push(`/company/${item.company.id}`)
  }


  function markAsDone(id: string) {
    setCompleted((current) => [...current, id])
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] pb-20">
      <section className="pb-10 pt-5 sm:pb-14 sm:pt-8 lg:pb-16 lg:pt-12">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" />
          Sua IA está ativa
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
          <div>
            <p className="text-base font-medium text-zinc-500 sm:text-lg">Bom dia, Juan.</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl lg:text-6xl lg:leading-[1.02]">
              Sua IA trabalhou enquanto você estava fora.
            </h1>
          </div>

          <div className="xl:pb-1">
            <p className="max-w-md text-base leading-7 text-zinc-600">
              {mission ? `A prospecção em ${mission.city} terminou com novas empresas prontas para análise. Você só precisa decidir por onde começar.` : "A última prospecção terminou com novas empresas prontas para análise. Você só precisa decidir por onde começar."}
            </p>
            <Link
              href="/mission"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "mt-4 h-auto rounded-none p-0 font-semibold text-zinc-950 hover:bg-transparent hover:text-violet-700",
              )}
            >
              Acompanhar última missão
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid border-y border-zinc-200 sm:grid-cols-3 lg:mt-14">
          {summaryMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className={cn(
                "py-5 sm:px-6 sm:py-7 lg:px-8",
                index > 0 && "border-t border-zinc-200 sm:border-l sm:border-t-0",
                index === 0 && "sm:pl-0 lg:pl-0",
              )}
            >
              <p className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ProspectingCommand />

      <section className="mt-16 grid gap-14 lg:mt-20 xl:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] xl:gap-20">
        <div>
          <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Seu próximo passo
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                O que merece atenção
              </h2>
            </div>
            <span className="text-sm font-medium text-zinc-500">{pendingItems.length} pendências</span>
          </div>

          {pendingItems.length ? (
            <div>
              {pendingItems.map((item) => {
                const Icon = item.icon

                return (
                  <article
                    key={item.id}
                    className="group grid gap-4 border-b border-zinc-200 py-6 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 transition group-hover:bg-zinc-950 group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-400">
                        {item.eyebrow}
                      </p>
                      <h3 className="mt-1 font-semibold text-zinc-950">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-1 sm:justify-end">
                      <Link
                        href={item.href}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "rounded-xl text-zinc-600 hover:text-zinc-950",
                        )}
                      >
                        {item.action}
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-xl text-zinc-400 hover:bg-emerald-50 hover:text-emerald-700"
                        aria-label={`Concluir ${item.title}`}
                        onClick={() => markAsDone(item.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="border-b border-zinc-200 py-12 text-center">
              <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />
              <p className="mt-3 font-semibold text-zinc-950">Tudo resolvido por agora.</p>
              <p className="mt-1 text-sm text-zinc-500">A IA avisa quando alguma decisão precisar de você.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Última prospecção
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                Começaria por estas empresas
              </h2>
            </div>
            <Link
              href="/mission"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-auto w-fit rounded-none p-0 font-semibold text-zinc-600 hover:bg-transparent hover:text-zinc-950",
              )}
            >
              Ver resultado completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {recentCompanies.map((company, index) => (
              <button
                key={company.name}
                type="button"
                onClick={() => openRecentCompany(company)}
                className="group flex min-h-[250px] flex-col rounded-[26px] border border-zinc-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-950/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-xs font-semibold text-white">
                    {company.initials}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {company.score} score
                  </span>
                </div>

                <div className="mt-7 flex-1">
                  <p className="text-xs font-medium text-zinc-400">#{index + 1} prioridade</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-950">
                    {company.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">{company.city}</p>
                  <p className="mt-4 text-sm leading-6 text-zinc-700">{company.opportunity}</p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      Potencial
                    </p>
                    <p className="mt-1 font-semibold text-zinc-950">{company.potential}</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition group-hover:bg-zinc-950 group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-900">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-600" />
            <p>
              A IA priorizou empresas com boa reputação local e falhas claras na jornada de conversão.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
