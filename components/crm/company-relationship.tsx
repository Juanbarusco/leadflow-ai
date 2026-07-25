"use client"

import Link from "next/link"
import {
  ArrowRight,
  Bot,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Copy,
  ExternalLink,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  Plus,
  Sparkles,
  Target,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { MissionCompany } from "@/lib/engines/mission-engine"
import {
  CHANNEL_LABELS,
  CRM_STAGE_LABELS,
  CRM_STAGES,
  OUTCOME_LABELS,
  type CrmSnapshot,
  type CrmStage,
  type InteractionChannel,
  type InteractionOutcome,
} from "@/lib/crm/types"
import {
  CRM_DEMO_EVENT,
  completeDemoCrmTask,
  createDemoCrmTask,
  ensureDemoCrmDeal,
  getDemoCrmSnapshot,
  registerDemoCrmInteraction,
  updateDemoCrmStage,
  type DemoCompanyIdentity,
} from "@/lib/crm/demo-store"
import { cn } from "@/lib/utils"

const channelIcons: Record<InteractionChannel, typeof Phone> = {
  call: Phone,
  whatsapp: MessageSquareText,
  email: Mail,
  meeting: CalendarClock,
  note: ClipboardCheck,
}

const stageStyles: Record<CrmStage, string> = {
  new: "border-zinc-200 bg-zinc-50 text-zinc-700",
  contacted: "border-sky-200 bg-sky-50 text-sky-700",
  follow_up: "border-amber-200 bg-amber-50 text-amber-800",
  meeting: "border-violet-200 bg-violet-50 text-violet-700",
  proposal: "border-indigo-200 bg-indigo-50 text-indigo-700",
  negotiation: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  won: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lost: "border-red-200 bg-red-50 text-red-700",
}

function formatDate(value?: string, includeTime = true) {
  if (!value) return "Não agendado"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Data inválida"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date)
}

function localDateTimeValue(date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)) {
  const copy = new Date(date)
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset())
  return copy.toISOString().slice(0, 16)
}

function estimatedValue(company: MissionCompany) {
  return Math.max(0, Math.round(company.websiteAnalysis.estimatedSaleMax || 2500))
}

function companyIdentity(company: MissionCompany): DemoCompanyIdentity {
  return {
    externalId: company.id,
    name: company.name,
    city: company.city,
    state: company.stateCode || company.state,
    phone: company.phone || company.internationalPhone,
    estimatedValue: estimatedValue(company),
  }
}

function getChannelMessage(company: MissionCompany, channel: InteractionChannel) {
  if (channel === "email") {
    return `Assunto: ${company.outreach.subject}\n\n${company.outreach.message}`
  }
  if (channel === "call") return company.outreach.callOpening
  if (channel === "meeting") {
    return `Reunião com ${company.name}: validar a principal dor digital, apresentar ${company.websiteAnalysis.recommendedServices[0]?.toLowerCase() || "a oportunidade prioritária"} e combinar o próximo passo.`
  }
  if (channel === "note") return ""
  return company.outreach.message
}

function buildWhatsAppUrl(company: MissionCompany, message: string) {
  const explicit = company.whatsappUrl
  if (explicit) {
    const separator = explicit.includes("?") ? "&" : "?"
    return `${explicit}${separator}text=${encodeURIComponent(message)}`
  }
  const digits = (company.internationalPhone || company.phone || "").replace(/\D/g, "")
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    window.prompt("Copie o conteúdo:", text)
    return false
  }
}

export function CompanyRelationship({
  company,
  open,
  onOpenChange,
  initialChannel = "whatsapp",
  showSummary = true,
}: {
  company: MissionCompany
  open: boolean
  onOpenChange: (open: boolean) => void
  initialChannel?: InteractionChannel
  showSummary?: boolean
}) {
  const identity = useMemo(() => companyIdentity(company), [company])
  const [snapshot, setSnapshot] = useState<CrmSnapshot>({
    mode: "demo",
    deal: null,
    interactions: [],
    tasks: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [channel, setChannel] = useState<InteractionChannel>(initialChannel)
  const [message, setMessage] = useState(getChannelMessage(company, initialChannel))
  const [outcome, setOutcome] = useState<InteractionOutcome>("completed")
  const [notes, setNotes] = useState("")
  const [followUpAt, setFollowUpAt] = useState("")
  const [copied, setCopied] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDueAt, setTaskDueAt] = useState(localDateTimeValue())

  const loadSnapshot = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/crm/company/${encodeURIComponent(company.id)}`, {
        cache: "no-store",
      })
      const payload = (await response.json()) as CrmSnapshot & { error?: string }
      if (!response.ok) throw new Error(payload.error || "Não foi possível carregar o CRM.")
      if (payload.mode === "demo") {
        setSnapshot(getDemoCrmSnapshot(identity))
      } else {
        setSnapshot(payload)
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar o CRM.")
    } finally {
      setLoading(false)
    }
  }, [company.id, identity])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadSnapshot(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadSnapshot])

  useEffect(() => {
    const handleDemoUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ externalId?: string }>).detail
      if (detail?.externalId === company.id) setSnapshot(getDemoCrmSnapshot(identity))
    }
    window.addEventListener(CRM_DEMO_EVENT, handleDemoUpdate)
    return () => window.removeEventListener(CRM_DEMO_EVENT, handleDemoUpdate)
  }, [company.id, identity])

  useEffect(() => {
    if (!open) return
    const timeoutId = window.setTimeout(() => {
      setChannel(initialChannel)
      setMessage(getChannelMessage(company, initialChannel))
      setNotice(null)
      setError(null)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [company, initialChannel, open])

  const postLive = useCallback(
    async (body: Record<string, unknown>) => {
      const response = await fetch(`/api/crm/company/${encodeURIComponent(company.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const payload = (await response.json()) as CrmSnapshot & { error?: string; mode?: "demo" | "live" }
      if (!response.ok) throw new Error(payload.error || "Não foi possível salvar a ação.")
      return payload
    },
    [company.id],
  )

  const ensureDeal = async () => {
    setSaving(true)
    setError(null)
    try {
      const next = snapshot.mode === "demo"
        ? ensureDemoCrmDeal(identity)
        : await postLive({ action: "ensure_deal", estimatedValue: estimatedValue(company) })
      setSnapshot(next as CrmSnapshot)
      setNotice("Empresa adicionada ao CRM.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível adicionar ao CRM.")
    } finally {
      setSaving(false)
    }
  }

  const changeStage = async (stage: CrmStage) => {
    setSaving(true)
    setError(null)
    try {
      const next = snapshot.mode === "demo"
        ? updateDemoCrmStage(identity, stage)
        : await postLive({ action: "update_stage", stage })
      setSnapshot(next as CrmSnapshot)
      setNotice(`Etapa alterada para ${CRM_STAGE_LABELS[stage]}.`)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível alterar a etapa.")
    } finally {
      setSaving(false)
    }
  }

  const registerInteraction = async () => {
    const cleanNotes = notes.trim()
    if (!cleanNotes) {
      setError("Conte em uma frase o que aconteceu. A IA usa isso para sugerir o próximo passo.")
      return
    }

    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const input = {
        channel,
        outcome,
        notes: cleanNotes,
        messageUsed: message.trim() || undefined,
        requestedFollowUpAt: followUpAt ? new Date(followUpAt).toISOString() : undefined,
        estimatedValue: estimatedValue(company),
      }
      const next = snapshot.mode === "demo"
        ? registerDemoCrmInteraction(identity, input)
        : await postLive({ action: "register_interaction", ...input })
      setSnapshot(next as CrmSnapshot)
      setNotes("")
      setFollowUpAt("")
      setNotice("Interação registrada. O CRM, a etapa e a próxima ação foram atualizados.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível registrar a interação.")
    } finally {
      setSaving(false)
    }
  }

  const addTask = async () => {
    if (!taskTitle.trim() || !taskDueAt) {
      setError("Informe o título e a data da tarefa.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const input = {
        title: taskTitle.trim(),
        dueAt: new Date(taskDueAt).toISOString(),
      }
      const next = snapshot.mode === "demo"
        ? createDemoCrmTask(identity, input)
        : await postLive({ action: "create_task", ...input })
      setSnapshot(next as CrmSnapshot)
      setTaskTitle("")
      setTaskDueAt(localDateTimeValue())
      setNotice("Tarefa criada.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível criar a tarefa.")
    } finally {
      setSaving(false)
    }
  }

  const completeTask = async (taskId: string) => {
    setSaving(true)
    setError(null)
    try {
      const next = snapshot.mode === "demo"
        ? completeDemoCrmTask(identity, taskId)
        : await postLive({ action: "complete_task", taskId })
      setSnapshot(next as CrmSnapshot)
      setNotice("Tarefa concluída.")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível concluir a tarefa.")
    } finally {
      setSaving(false)
    }
  }

  const openChannel = async () => {
    if (channel === "whatsapp") {
      const url = buildWhatsAppUrl(company, message)
      if (!url) {
        setError("Esta empresa não possui telefone disponível para abrir o WhatsApp.")
        return
      }
      window.open(url, "_blank", "noopener,noreferrer")
      return
    }
    if (channel === "email") {
      const subject = company.outreach.subject
      const body = message.replace(/^Assunto:.*\n\n/, "")
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      return
    }
    if (channel === "call") {
      const phone = company.internationalPhone || company.phone
      if (!phone) {
        setError("Esta empresa não possui telefone disponível.")
        return
      }
      window.location.href = `tel:${phone}`
      return
    }
    await copyToClipboard(message)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const latestInteraction = snapshot.interactions[0]
  const pendingTasks = snapshot.tasks.filter((task) => task.status === "pending")

  return (
    <>
      {showSummary ? (
      <section id="relationship" className="scroll-mt-40">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Relacionamento comercial</p>
              <h2 className="mt-2 text-3xl font-semibold">CRM que orienta a próxima ação</h2>
              <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
                Registre o que aconteceu. A IA identifica a objeção, atualiza a etapa e cria o follow-up.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/crm" className={buttonVariants({ variant: "outline", className: "h-10 rounded-xl px-4" })}>
                Ver CRM completo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Button className="h-10 rounded-xl px-4" onClick={() => onOpenChange(true)}>
                <Plus className="mr-2 h-4 w-4" /> Registrar interação
              </Button>
            </div>
          </div>
  
          <Card className="overflow-hidden rounded-[30px] p-0 shadow-none">
            {loading ? (
              <div className="grid min-h-56 place-items-center"><LoaderCircle className="h-6 w-6 animate-spin text-violet-500" /></div>
            ) : !snapshot.deal ? (
              <div className="grid gap-7 p-7 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/10 text-violet-600"><Bot className="h-5 w-5" /></span>
                    <div><p className="font-semibold">Relacionamento ainda não iniciado</p><p className="text-sm text-muted-foreground">Adicione a empresa ao CRM ou registre o primeiro contato.</p></div>
                  </div>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                    Depois do primeiro registro, o histórico deixa de depender da memória do vendedor e o LeadFlow passa a recomendar o próximo movimento.
                  </p>
                </div>
                <Button disabled={saving} className="h-11 rounded-xl px-5" onClick={() => void ensureDeal()}>
                  {saving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
                  Adicionar ao CRM
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[.78fr_1.22fr]">
                <div className="border-b bg-zinc-950 p-7 text-white lg:border-b-0 lg:border-r lg:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-500">Etapa atual</p>
                      <Badge className={cn("mt-3 border px-3 py-1.5 hover:bg-inherit", stageStyles[snapshot.deal.stage])}>
                        {CRM_STAGE_LABELS[snapshot.deal.stage]}
                      </Badge>
                    </div>
                    <select
                      aria-label="Alterar etapa do CRM"
                      value={snapshot.deal.stage}
                      disabled={saving}
                      onChange={(event) => void changeStage(event.target.value as CrmStage)}
                      className="h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-violet-400"
                    >
                      {CRM_STAGES.map((stage) => <option key={stage} value={stage} className="text-zinc-950">{CRM_STAGE_LABELS[stage]}</option>)}
                    </select>
                  </div>
  
                  <div className="mt-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-500">Próxima melhor ação</p>
                    <p className="mt-3 text-xl font-semibold leading-8">{snapshot.deal.nextAction || "Registrar o primeiro contato"}</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{snapshot.deal.aiSummary}</p>
                  </div>
  
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Probabilidade</p><p className="mt-2 text-2xl font-semibold">{snapshot.deal.probability}%</p></div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Follow-up</p><p className="mt-2 text-sm font-semibold">{formatDate(snapshot.deal.nextActionAt)}</p></div>
                  </div>
                </div>
  
                <div className="grid gap-7 p-7 sm:p-8 xl:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Próximas tarefas</h3><Badge variant="outline">{pendingTasks.length}</Badge></div>
                    <div className="mt-4 space-y-3">
                      {pendingTasks.length ? pendingTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-start gap-3 rounded-2xl border p-4">
                          <button disabled={saving} onClick={() => void completeTask(task.id)} className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-muted-foreground transition hover:border-emerald-400 hover:text-emerald-600" aria-label={`Concluir ${task.title}`}><Check className="h-3.5 w-3.5" /></button>
                          <div className="min-w-0"><p className="font-medium leading-6">{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(task.dueAt)} · {task.source === "ai" ? "Criada pela IA" : "Manual"}</p></div>
                        </div>
                      )) : <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">Nenhuma tarefa pendente.</div>}
                    </div>
                  </div>
  
                  <div>
                    <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Histórico recente</h3><Badge variant="outline">{snapshot.interactions.length}</Badge></div>
                    <div className="mt-4 space-y-3">
                      {snapshot.interactions.length ? snapshot.interactions.slice(0, 3).map((interaction) => {
                        const Icon = channelIcons[interaction.channel]
                        return (
                          <div key={interaction.id} className="flex gap-3 rounded-2xl bg-muted/35 p-4">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-background shadow-sm"><Icon className="h-4 w-4" /></span>
                            <div className="min-w-0"><p className="text-sm font-medium">{CHANNEL_LABELS[interaction.channel]} · {OUTCOME_LABELS[interaction.outcome]}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{interaction.notes}</p><p className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{formatDate(interaction.occurredAt)}</p></div>
                          </div>
                        )
                      }) : <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">O histórico começa no primeiro contato registrado.</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
  
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {notice ? <p className="mt-3 text-sm text-emerald-700">{notice}</p> : null}
        </section>
      ) : null}

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl" side="right">
          <SheetHeader className="border-b p-6 pr-14">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-500/10 text-violet-600"><Sparkles className="h-5 w-5" /></span>
              <div>
                <SheetTitle className="text-xl">Abordar {company.name}</SheetTitle>
                <SheetDescription className="mt-1">Abra o canal, registre o resultado e deixe a IA reorganizar o CRM.</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-7 p-6">
            {snapshot.mode === "demo" ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Modo demonstração: histórico e tarefas ficam salvos neste navegador.</div> : null}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">1. Escolha o canal</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(Object.keys(channelIcons) as InteractionChannel[]).map((item) => {
                  const Icon = channelIcons[item]
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setChannel(item); setMessage(getChannelMessage(company, item)); setError(null) }}
                      className={cn("flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-medium transition", channel === item ? "border-zinc-950 bg-zinc-950 text-white shadow-lg" : "bg-white hover:border-zinc-300 hover:bg-zinc-50")}
                    >
                      <Icon className="h-4 w-4" />{CHANNEL_LABELS[item]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">2. Mensagem sugerida</p><button type="button" className="text-xs font-medium text-violet-600" onClick={() => setMessage(getChannelMessage(company, channel))}>Restaurar sugestão</button></div>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={8} className="mt-3 w-full resize-y rounded-2xl border bg-white p-4 text-sm leading-6 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="Escreva sua abordagem..." />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" onClick={async () => { const ok = await copyToClipboard(message); setCopied(ok); window.setTimeout(() => setCopied(false), 1600) }}>
                  {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? "Copiado" : "Copiar"}
                </Button>
                <Button onClick={() => void openChannel()}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {channel === "whatsapp" ? "Abrir WhatsApp" : channel === "email" ? "Abrir e-mail" : channel === "call" ? "Ligar agora" : "Usar conteúdo"}
                </Button>
              </div>
            </div>

            <div className="rounded-[26px] border bg-zinc-50 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">3. O que aconteceu?</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Resultado
                  <select value={outcome} onChange={(event) => setOutcome(event.target.value as InteractionOutcome)} className="mt-2 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-violet-400">
                    {(Object.keys(OUTCOME_LABELS) as InteractionOutcome[]).map((item) => <option key={item} value={item}>{OUTCOME_LABELS[item]}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium">Retorno combinado <span className="font-normal text-muted-foreground">(opcional)</span>
                  <input type="datetime-local" value={followUpAt} onChange={(event) => setFollowUpAt(event.target.value)} className="mt-2 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-violet-400" />
                </label>
              </div>
              <label className="mt-4 block text-sm font-medium">Resumo da conversa
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-2 w-full resize-y rounded-xl border bg-white p-3 text-sm leading-6 outline-none focus:border-violet-400" placeholder="Ex.: Liguei, mas a secretária disse que o dono estava sem tempo e pediu retorno na terça de manhã." />
              </label>
              <Button disabled={saving} className="mt-4 h-11 w-full rounded-xl" onClick={() => void registerInteraction()}>
                {saving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Registrar e atualizar CRM com IA
              </Button>
            </div>

            {latestInteraction?.aiRecommendation ? (
              <div className="rounded-[26px] border border-violet-200 bg-violet-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-600 text-white"><Bot className="h-5 w-5" /></span>
                  <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700">Leitura da IA</p><p className="mt-2 font-semibold">{latestInteraction.aiObjection}</p><p className="mt-2 text-sm leading-6 text-violet-950/75">{latestInteraction.aiRecommendation}</p></div>
                </div>
              </div>
            ) : null}

            <div className="rounded-[26px] border p-5 sm:p-6">
              <div className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-violet-600" /><div><p className="font-semibold">Criar tarefa manual</p><p className="text-sm text-muted-foreground">Para algo que não foi sugerido automaticamente.</p></div></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_190px]">
                <input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} className="h-11 rounded-xl border px-3 text-sm outline-none focus:border-violet-400" placeholder="Ex.: enviar exemplo de site" />
                <input type="datetime-local" value={taskDueAt} onChange={(event) => setTaskDueAt(event.target.value)} className="h-11 rounded-xl border px-3 text-sm outline-none focus:border-violet-400" />
              </div>
              <Button variant="outline" disabled={saving} className="mt-3" onClick={() => void addTask()}><Plus className="mr-2 h-4 w-4" />Adicionar tarefa</Button>
            </div>

            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
            {notice ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div> : null}
          </div>

          <SheetFooter className="border-t bg-white p-5">
            <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground"><span>{snapshot.interactions.length} interações · {pendingTasks.length} tarefas pendentes</span><span className="inline-flex items-center gap-1.5"><CircleDollarSign className="h-3.5 w-3.5" />Sem desconto de créditos nesta versão</span></div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
