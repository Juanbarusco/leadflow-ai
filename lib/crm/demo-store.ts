import { analyzeInteraction } from "@/lib/crm/assistant"
import type {
  CrmDeal,
  CrmSnapshot,
  CrmStage,
  CrmTask,
  RegisterInteractionInput,
} from "@/lib/crm/types"

export type DemoCompanyIdentity = {
  externalId: string
  name: string
  city: string
  state?: string
  phone?: string
  estimatedValue?: number
}

const STORE_PREFIX = "leadflow-crm-company:"
export const CRM_DEMO_EVENT = "leadflow:crm-demo-updated"

const nowIso = () => new Date().toISOString()

function storageKey(externalId: string) {
  return `${STORE_PREFIX}${externalId}`
}

function notify(externalId: string) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(CRM_DEMO_EVENT, { detail: { externalId } }))
}

function defaultDeal(company: DemoCompanyIdentity): CrmDeal {
  const now = nowIso()
  return {
    id: `demo-deal-${company.externalId}`,
    organizationId: "demo-workspace",
    companyId: `demo-company-${company.externalId}`,
    companyExternalId: company.externalId,
    companyName: company.name,
    companyCity: company.city,
    companyState: company.state,
    companyPhone: company.phone,
    stage: "new",
    estimatedValue: Math.max(0, Math.round(company.estimatedValue || 2500)),
    probability: 15,
    aiSummary: "Empresa pronta para o primeiro contato. Registre uma interação para receber orientação.",
    createdAt: now,
    updatedAt: now,
  }
}

export function getDemoCrmSnapshot(
  company: DemoCompanyIdentity,
  createIfMissing = false,
): CrmSnapshot {
  if (typeof window === "undefined") {
    return { mode: "demo", deal: createIfMissing ? defaultDeal(company) : null, interactions: [], tasks: [] }
  }

  const raw = window.localStorage.getItem(storageKey(company.externalId))
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as CrmSnapshot
      return { ...parsed, mode: "demo" }
    } catch {
      window.localStorage.removeItem(storageKey(company.externalId))
    }
  }

  const snapshot: CrmSnapshot = {
    mode: "demo",
    deal: createIfMissing ? defaultDeal(company) : null,
    interactions: [],
    tasks: [],
  }

  if (createIfMissing) saveDemoCrmSnapshot(company.externalId, snapshot)
  return snapshot
}

export function saveDemoCrmSnapshot(externalId: string, snapshot: CrmSnapshot) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(storageKey(externalId), JSON.stringify({ ...snapshot, mode: "demo" }))
  notify(externalId)
}

export function ensureDemoCrmDeal(company: DemoCompanyIdentity) {
  return getDemoCrmSnapshot(company, true)
}

export function registerDemoCrmInteraction(
  company: DemoCompanyIdentity,
  input: RegisterInteractionInput,
) {
  const snapshot = ensureDemoCrmDeal(company)
  const deal = snapshot.deal || defaultDeal(company)
  const advice = analyzeInteraction({
    currentStage: deal.stage,
    channel: input.channel,
    outcome: input.outcome,
    notes: input.notes,
    requestedFollowUpAt: input.requestedFollowUpAt,
  })
  const occurredAt = input.occurredAt || nowIso()
  const interactionId = crypto.randomUUID()
  const updatedAt = nowIso()

  const interaction = {
    id: interactionId,
    companyExternalId: company.externalId,
    channel: input.channel,
    outcome: input.outcome,
    notes: input.notes,
    messageUsed: input.messageUsed,
    aiObjection: advice.objection,
    aiRecommendation: advice.recommendation,
    stageBefore: deal.stage,
    stageAfter: advice.stageAfter,
    occurredAt,
    createdAt: updatedAt,
  }

  const tasks = [...snapshot.tasks]
  if (advice.task) {
    tasks.unshift({
      id: crypto.randomUUID(),
      companyExternalId: company.externalId,
      title: advice.task.title,
      description: advice.task.description,
      dueAt: advice.task.dueAt,
      status: "pending",
      source: "ai",
      interactionId,
      createdAt: updatedAt,
    })
  }

  const next: CrmSnapshot = {
    mode: "demo",
    deal: {
      ...deal,
      stage: advice.stageAfter,
      probability: advice.probability,
      estimatedValue:
        typeof input.estimatedValue === "number"
          ? Math.max(0, Math.round(input.estimatedValue))
          : deal.estimatedValue,
      aiSummary: advice.summary,
      nextAction: advice.nextAction,
      nextActionAt: advice.nextActionAt,
      lastInteractionAt: occurredAt,
      lossReason: advice.stageAfter === "lost" ? input.notes : undefined,
      updatedAt,
    },
    interactions: [interaction, ...snapshot.interactions],
    tasks,
  }

  saveDemoCrmSnapshot(company.externalId, next)
  return next
}

export function updateDemoCrmStage(company: DemoCompanyIdentity, stage: CrmStage) {
  const snapshot = ensureDemoCrmDeal(company)
  const probability: Record<CrmStage, number> = {
    new: 15,
    contacted: 28,
    follow_up: 38,
    meeting: 55,
    proposal: 68,
    negotiation: 80,
    won: 100,
    lost: 0,
  }
  const deal = snapshot.deal || defaultDeal(company)
  const next: CrmSnapshot = {
    ...snapshot,
    deal: {
      ...deal,
      stage,
      probability: probability[stage],
      nextAction: stage === "won" || stage === "lost" ? undefined : deal.nextAction,
      nextActionAt: stage === "won" || stage === "lost" ? undefined : deal.nextActionAt,
      updatedAt: nowIso(),
    },
  }
  saveDemoCrmSnapshot(company.externalId, next)
  return next
}

export function createDemoCrmTask(
  company: DemoCompanyIdentity,
  input: { title: string; description?: string; dueAt: string },
) {
  const snapshot = ensureDemoCrmDeal(company)
  const task: CrmTask = {
    id: crypto.randomUUID(),
    companyExternalId: company.externalId,
    title: input.title,
    description: input.description,
    dueAt: input.dueAt,
    status: "pending",
    source: "manual",
    createdAt: nowIso(),
  }
  const next = { ...snapshot, tasks: [task, ...snapshot.tasks] }
  saveDemoCrmSnapshot(company.externalId, next)
  return next
}

export function completeDemoCrmTask(company: DemoCompanyIdentity, taskId: string) {
  const snapshot = ensureDemoCrmDeal(company)
  const next: CrmSnapshot = {
    ...snapshot,
    tasks: snapshot.tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: "done", completedAt: nowIso() }
        : task,
    ),
  }
  saveDemoCrmSnapshot(company.externalId, next)
  return next
}

export function getAllDemoDeals() {
  if (typeof window === "undefined") return []

  const deals: CrmDeal[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(STORE_PREFIX)) continue
    const raw = window.localStorage.getItem(key)
    if (!raw) continue
    try {
      const snapshot = JSON.parse(raw) as CrmSnapshot
      if (snapshot.deal) deals.push(snapshot.deal)
    } catch {
      // Ignore invalid local demo entries.
    }
  }

  return deals.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}
