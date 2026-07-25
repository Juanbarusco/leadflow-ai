"use client"

import Link from "next/link"
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  CRM_STAGE_LABELS,
  CRM_STAGES,
  type CrmDeal,
  type CrmStage,
} from "@/lib/crm/types"
import {
  CRM_DEMO_EVENT,
  getAllDemoDeals,
  updateDemoCrmStage,
} from "@/lib/crm/demo-store"
import { cn } from "@/lib/utils"

const columns: Array<{ id: string; title: string; stages: CrmStage[]; hint: string }> = [
  { id: "new", title: "Novos", stages: ["new"], hint: "Ainda sem contato" },
  { id: "contact", title: "Em contato", stages: ["contacted", "follow_up"], hint: "Contato e retorno" },
  { id: "meeting", title: "Reunião", stages: ["meeting"], hint: "Diagnóstico agendado" },
  { id: "proposal", title: "Proposta", stages: ["proposal", "negotiation"], hint: "Decisão comercial" },
  { id: "closed", title: "Encerrados", stages: ["won", "lost"], hint: "Ganhos e perdas" },
]

const stageAccent: Record<CrmStage, string> = {
  new: "bg-zinc-400",
  contacted: "bg-sky-500",
  follow_up: "bg-amber-500",
  meeting: "bg-violet-500",
  proposal: "bg-indigo-500",
  negotiation: "bg-fuchsia-500",
  won: "bg-emerald-500",
  lost: "bg-red-500",
}

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function dateLabel(value?: string) {
  if (!value) return "Sem data"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Sem data"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function CrmBoard() {
  const [deals, setDeals] = useState<CrmDeal[]>([])
  const [mode, setMode] = useState<"live" | "demo">("demo")
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/crm/board", { cache: "no-store" })
      const payload = (await response.json()) as {
        mode?: "live" | "demo"
        deals?: CrmDeal[]
        error?: string
      }
      if (!response.ok) throw new Error(payload.error || "Não foi possível carregar o CRM.")
      const resolvedMode = payload.mode || "demo"
      setMode(resolvedMode)
      setDeals(resolvedMode === "demo" ? getAllDemoDeals() : payload.deals || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar o CRM.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [load])

  useEffect(() => {
    const refreshDemo = () => {
      if (mode === "demo") setDeals(getAllDemoDeals())
    }
    window.addEventListener(CRM_DEMO_EVENT, refreshDemo)
    window.addEventListener("storage", refreshDemo)
    return () => {
      window.removeEventListener(CRM_DEMO_EVENT, refreshDemo)
      window.removeEventListener("storage", refreshDemo)
    }
  }, [mode])

  const grouped = useMemo(
    () => columns.map((column) => ({
      ...column,
      deals: deals.filter((deal) => column.stages.includes(deal.stage)),
    })),
    [deals],
  )

  const openPipeline = deals.filter((deal) => deal.stage !== "won" && deal.stage !== "lost")
  const totalPotential = openPipeline.reduce((total, deal) => total + deal.estimatedValue, 0)
  const needingAction = openPipeline.filter((deal) => deal.nextAction).length

  const changeStage = async (deal: CrmDeal, stage: CrmStage) => {
    setUpdatingId(deal.id)
    setError(null)
    try {
      if (mode === "demo") {
        updateDemoCrmStage({
          externalId: deal.companyExternalId,
          name: deal.companyName,
          city: deal.companyCity,
          state: deal.companyState,
          phone: deal.companyPhone,
          estimatedValue: deal.estimatedValue,
        }, stage)
        setDeals(getAllDemoDeals())
      } else {
        const response = await fetch(`/api/crm/company/${encodeURIComponent(deal.companyExternalId)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_stage", stage }),
        })
        const payload = (await response.json()) as { deal?: CrmDeal; error?: string }
        if (!response.ok) throw new Error(payload.error || "Não foi possível alterar a etapa.")
        if (payload.deal) {
          setDeals((current) => current.map((item) => item.id === deal.id ? payload.deal! : item))
        } else {
          await load()
        }
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Não foi possível alterar a etapa.")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[34px] border bg-white p-7 shadow-sm shadow-zinc-950/[0.03] sm:p-9">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-violet-50 text-violet-700 hover:bg-violet-50"><Bot className="mr-1.5 h-3.5 w-3.5" />CRM com IA</Badge>
              <Badge variant="outline">{mode === "demo" ? "Demonstração" : "Workspace real"}</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Cada conversa vira uma próxima ação.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              O pipeline se atualiza a partir das interações registradas nas empresas encontradas pelas missões. O relatório continua limpo; o CRM concentra histórico, tarefas e próximas ações.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" disabled={loading} onClick={() => void load()} className="h-11 rounded-xl px-4"><RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />Atualizar</Button>
            <Link href="/companies" className={buttonVariants({ className: "h-11 rounded-xl px-5" })}><Building2 className="mr-2 h-4 w-4" />Escolher empresa</Link>
          </div>
        </div>

        <div className="mt-9 grid gap-5 border-t pt-7 sm:grid-cols-3">
          <div><p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Pipeline aberto</p><p className="mt-2 text-3xl font-semibold">{openPipeline.length}</p></div>
          <div><p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Potencial estimado</p><p className="mt-2 text-3xl font-semibold">{money(totalPotential)}</p></div>
          <div><p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Com próxima ação</p><p className="mt-2 text-3xl font-semibold">{needingAction}</p></div>
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      {loading ? (
        <div className="grid min-h-80 place-items-center rounded-[30px] border bg-white"><LoaderCircle className="h-7 w-7 animate-spin text-violet-500" /></div>
      ) : deals.length === 0 ? (
        <Card className="rounded-[30px] p-10 text-center shadow-none sm:p-14">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600"><Sparkles className="h-6 w-6" /></span>
          <h2 className="mt-5 text-2xl font-semibold">Seu CRM começa na primeira conversa</h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">Abra uma empresa, clique em “Iniciar abordagem” e registre o resultado. Ela aparecerá aqui com etapa, tarefa e recomendação da IA.</p>
          <Link href="/companies" className={buttonVariants({ className: "mt-6 h-11 rounded-xl px-5" })}>Abrir empresas <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Card>
      ) : (
        <section className="overflow-x-auto pb-4">
          <div className="grid min-w-[1320px] grid-cols-5 gap-4">
            {grouped.map((column) => (
              <div key={column.id} className="rounded-[28px] border bg-zinc-50/80 p-3.5">
                <div className="flex items-start justify-between gap-3 px-1 py-2">
                  <div><h2 className="font-semibold">{column.title}</h2><p className="mt-1 text-xs text-muted-foreground">{column.hint}</p></div>
                  <Badge variant="outline" className="bg-white">{column.deals.length}</Badge>
                </div>
                <div className="mt-3 space-y-3">
                  {column.deals.map((deal) => (
                    <Card key={deal.id} className="rounded-2xl p-4 shadow-none transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", stageAccent[deal.stage])} />
                        <select aria-label={`Etapa de ${deal.companyName}`} value={deal.stage} disabled={updatingId === deal.id} onChange={(event) => void changeStage(deal, event.target.value as CrmStage)} className="h-8 max-w-36 rounded-lg border bg-white px-2 text-xs outline-none focus:border-violet-400">
                          {CRM_STAGES.map((stage) => <option key={stage} value={stage}>{CRM_STAGE_LABELS[stage]}</option>)}
                        </select>
                      </div>
                      <Link href={`/company/${encodeURIComponent(deal.companyExternalId)}`} className="mt-4 block group">
                        <h3 className="font-semibold leading-6 group-hover:text-violet-700">{deal.companyName}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{[deal.companyCity, deal.companyState].filter(Boolean).join(", ")}</p>
                      </Link>
                      <div className="mt-4 rounded-xl bg-zinc-50 p-3">
                        <div className="flex items-center gap-2 text-xs font-medium"><Bot className="h-3.5 w-3.5 text-violet-600" />Próxima ação</div>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">{deal.nextAction || "Registrar o primeiro contato"}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-semibold"><CircleDollarSign className="h-3.5 w-3.5 text-emerald-600" />{money(deal.estimatedValue)}</span>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" />{dateLabel(deal.nextActionAt)}</span>
                      </div>
                      <Link href={`/company/${encodeURIComponent(deal.companyExternalId)}?crm=1`} className="mt-3 flex items-center justify-between rounded-xl px-2 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-50">Registrar interação <ChevronRight className="h-3.5 w-3.5" /></Link>
                    </Card>
                  ))}
                  {column.deals.length === 0 ? <div className="rounded-2xl border border-dashed bg-white/60 px-4 py-8 text-center text-xs text-muted-foreground">Nenhuma empresa nesta etapa.</div> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
