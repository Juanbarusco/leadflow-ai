import { getWorkspaceContext } from "@/lib/auth/workspace-context"
import { analyzeInteraction } from "@/lib/crm/assistant"
import type {
  CrmDeal,
  CrmInteraction,
  CrmSnapshot,
  CrmStage,
  CrmTask,
  RegisterInteractionInput,
} from "@/lib/crm/types"

const nowIso = () => new Date().toISOString()

type CompanyRecord = {
  id: string
  external_id: string
  name: string
  city: string
  state: string | null
  phone: string | null
  payload: Record<string, unknown> | null
}

type DealRow = {
  id: string
  organization_id: string
  company_id: string
  stage: CrmStage
  estimated_value: number | string | null
  probability: number
  next_action: string | null
  next_action_at: string | null
  ai_summary: string | null
  last_interaction_at: string | null
  loss_reason: string | null
  created_at: string
  updated_at: string
}

type InteractionRow = {
  id: string
  channel: CrmInteraction["channel"]
  outcome: CrmInteraction["outcome"]
  notes: string
  message_used: string | null
  ai_objection: string | null
  ai_recommendation: string | null
  stage_before: CrmStage
  stage_after: CrmStage
  occurred_at: string
  created_at: string
}

type TaskRow = {
  id: string
  title: string
  description: string | null
  due_at: string
  status: CrmTask["status"]
  source: CrmTask["source"]
  interaction_id: string | null
  completed_at: string | null
  created_at: string
}

function estimatedValueFromCompany(company: CompanyRecord) {
  const website = company.payload?.websiteAnalysis
  if (website && typeof website === "object") {
    const max = (website as { estimatedSaleMax?: unknown }).estimatedSaleMax
    if (typeof max === "number" && Number.isFinite(max)) return Math.round(max)
  }
  return 2500
}

function mapDeal(row: DealRow, company: CompanyRecord): CrmDeal {
  return {
    id: row.id,
    organizationId: row.organization_id,
    companyId: row.company_id,
    companyExternalId: company.external_id,
    companyName: company.name,
    companyCity: company.city,
    companyState: company.state || undefined,
    companyPhone: company.phone || undefined,
    stage: row.stage,
    estimatedValue: Number(row.estimated_value || 0),
    probability: row.probability,
    nextAction: row.next_action || undefined,
    nextActionAt: row.next_action_at || undefined,
    aiSummary: row.ai_summary || undefined,
    lastInteractionAt: row.last_interaction_at || undefined,
    lossReason: row.loss_reason || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapInteraction(row: InteractionRow, externalId: string): CrmInteraction {
  return {
    id: row.id,
    companyExternalId: externalId,
    channel: row.channel,
    outcome: row.outcome,
    notes: row.notes,
    messageUsed: row.message_used || undefined,
    aiObjection: row.ai_objection || undefined,
    aiRecommendation: row.ai_recommendation || undefined,
    stageBefore: row.stage_before,
    stageAfter: row.stage_after,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
  }
}

function mapTask(row: TaskRow, externalId: string): CrmTask {
  return {
    id: row.id,
    companyExternalId: externalId,
    title: row.title,
    description: row.description || undefined,
    dueAt: row.due_at,
    status: row.status,
    source: row.source,
    interactionId: row.interaction_id || undefined,
    completedAt: row.completed_at || undefined,
    createdAt: row.created_at,
  }
}

async function findCompany(externalId: string) {
  const context = await getWorkspaceContext()
  if (!context) return null

  const { data, error } = await context.supabase
    .from("companies")
    .select("id, external_id, name, city, state, phone, payload")
    .eq("organization_id", context.organizationId)
    .eq("external_id", externalId)
    .maybeSingle()

  if (error) throw error
  if (!data) return { ...context, company: null }

  return { ...context, company: data as CompanyRecord }
}

async function ensureDealForCompany(
  context: NonNullable<Awaited<ReturnType<typeof findCompany>>>,
  estimatedValue?: number,
) {
  if (!context.company) throw new Error("Empresa não encontrada no workspace.")

  const { data: existing, error: existingError } = await context.supabase
    .from("crm_deals")
    .select("*")
    .eq("organization_id", context.organizationId)
    .eq("company_id", context.company.id)
    .maybeSingle()

  if (existingError) throw existingError
  if (existing) return existing as DealRow

  const { data, error } = await context.supabase
    .from("crm_deals")
    .insert({
      organization_id: context.organizationId,
      company_id: context.company.id,
      owner_id: context.user.id,
      stage: "new",
      estimated_value:
        typeof estimatedValue === "number" && Number.isFinite(estimatedValue)
          ? Math.max(0, Math.round(estimatedValue))
          : estimatedValueFromCompany(context.company),
      probability: 15,
      ai_summary: "Empresa adicionada ao CRM. Registre a primeira interação para receber orientação.",
    })
    .select("*")
    .single()

  if (error) throw error
  return data as DealRow
}

export async function getCrmSnapshot(externalId: string): Promise<CrmSnapshot | null> {
  const context = await findCompany(externalId)
  if (!context) return null
  if (!context.company) throw new Error("Empresa não encontrada no workspace.")

  const { data: dealData, error: dealError } = await context.supabase
    .from("crm_deals")
    .select("*")
    .eq("organization_id", context.organizationId)
    .eq("company_id", context.company.id)
    .maybeSingle()

  if (dealError) throw dealError
  if (!dealData) {
    return { mode: "live", deal: null, interactions: [], tasks: [] }
  }

  const [interactionResult, taskResult] = await Promise.all([
    context.supabase
      .from("crm_interactions")
      .select("*")
      .eq("deal_id", dealData.id)
      .order("occurred_at", { ascending: false })
      .limit(50),
    context.supabase
      .from("crm_tasks")
      .select("*")
      .eq("deal_id", dealData.id)
      .order("status", { ascending: false })
      .order("due_at", { ascending: true })
      .limit(50),
  ])

  if (interactionResult.error) throw interactionResult.error
  if (taskResult.error) throw taskResult.error

  return {
    mode: "live",
    deal: mapDeal(dealData as DealRow, context.company),
    interactions: ((interactionResult.data || []) as InteractionRow[]).map((row) =>
      mapInteraction(row, externalId),
    ),
    tasks: ((taskResult.data || []) as TaskRow[]).map((row) => mapTask(row, externalId)),
  }
}

export async function ensureCrmDeal(externalId: string, estimatedValue?: number) {
  const context = await findCompany(externalId)
  if (!context) return null
  if (!context.company) throw new Error("Empresa não encontrada no workspace.")

  await ensureDealForCompany(context, estimatedValue)
  return getCrmSnapshot(externalId)
}

export async function registerCrmInteraction(
  externalId: string,
  input: RegisterInteractionInput,
) {
  const context = await findCompany(externalId)
  if (!context) return null
  if (!context.company) throw new Error("Empresa não encontrada no workspace.")

  const deal = await ensureDealForCompany(context, input.estimatedValue)
  const advice = analyzeInteraction({
    currentStage: deal.stage,
    channel: input.channel,
    outcome: input.outcome,
    notes: input.notes,
    requestedFollowUpAt: input.requestedFollowUpAt,
  })
  const occurredAt = input.occurredAt || nowIso()

  const { data: interactionData, error: interactionError } = await context.supabase
    .from("crm_interactions")
    .insert({
      organization_id: context.organizationId,
      company_id: context.company.id,
      deal_id: deal.id,
      created_by: context.user.id,
      channel: input.channel,
      outcome: input.outcome,
      notes: input.notes,
      message_used: input.messageUsed || null,
      ai_objection: advice.objection,
      ai_recommendation: advice.recommendation,
      stage_before: deal.stage,
      stage_after: advice.stageAfter,
      occurred_at: occurredAt,
    })
    .select("id")
    .single()

  if (interactionError) throw interactionError

  const updatePayload: Record<string, unknown> = {
    stage: advice.stageAfter,
    probability: advice.probability,
    ai_summary: advice.summary,
    next_action: advice.nextAction || null,
    next_action_at: advice.nextActionAt || null,
    last_interaction_at: occurredAt,
  }

  if (advice.stageAfter === "lost") updatePayload.loss_reason = input.notes
  if (advice.stageAfter !== "lost") updatePayload.loss_reason = null

  const { error: dealError } = await context.supabase
    .from("crm_deals")
    .update(updatePayload)
    .eq("id", deal.id)

  if (dealError) throw dealError

  if (advice.task) {
    const { error: taskError } = await context.supabase.from("crm_tasks").insert({
      organization_id: context.organizationId,
      company_id: context.company.id,
      deal_id: deal.id,
      assigned_to: context.user.id,
      title: advice.task.title,
      description: advice.task.description,
      due_at: advice.task.dueAt,
      source: "ai",
      interaction_id: interactionData.id,
    })

    if (taskError) throw taskError
  }

  return getCrmSnapshot(externalId)
}

export async function updateCrmStage(externalId: string, stage: CrmStage) {
  const context = await findCompany(externalId)
  if (!context) return null
  if (!context.company) throw new Error("Empresa não encontrada no workspace.")

  const deal = await ensureDealForCompany(context)
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

  const { error } = await context.supabase
    .from("crm_deals")
    .update({
      stage,
      probability: probability[stage],
      next_action: stage === "won" || stage === "lost" ? null : deal.next_action,
      next_action_at: stage === "won" || stage === "lost" ? null : deal.next_action_at,
    })
    .eq("id", deal.id)

  if (error) throw error
  return getCrmSnapshot(externalId)
}

export async function createCrmTask(
  externalId: string,
  input: { title: string; description?: string; dueAt: string },
) {
  const context = await findCompany(externalId)
  if (!context) return null
  if (!context.company) throw new Error("Empresa não encontrada no workspace.")

  const deal = await ensureDealForCompany(context)
  const { error } = await context.supabase.from("crm_tasks").insert({
    organization_id: context.organizationId,
    company_id: context.company.id,
    deal_id: deal.id,
    assigned_to: context.user.id,
    title: input.title,
    description: input.description || null,
    due_at: input.dueAt,
    source: "manual",
  })

  if (error) throw error
  return getCrmSnapshot(externalId)
}

export async function completeCrmTask(externalId: string, taskId: string) {
  const context = await findCompany(externalId)
  if (!context) return null
  if (!context.company) throw new Error("Empresa não encontrada no workspace.")

  const { error } = await context.supabase
    .from("crm_tasks")
    .update({ status: "done", completed_at: nowIso() })
    .eq("id", taskId)
    .eq("organization_id", context.organizationId)
    .eq("company_id", context.company.id)

  if (error) throw error
  return getCrmSnapshot(externalId)
}

export async function getCrmBoard(): Promise<CrmDeal[] | null> {
  const context = await getWorkspaceContext()
  if (!context) return null

  const { data, error } = await context.supabase
    .from("crm_deals")
    .select("*, company:companies(id, external_id, name, city, state, phone, payload)")
    .eq("organization_id", context.organizationId)
    .order("updated_at", { ascending: false })

  if (error) throw error

  return (data || []).flatMap((item) => {
    const companyValue = Array.isArray(item.company) ? item.company[0] : item.company
    if (!companyValue) return []
    return [mapDeal(item as DealRow, companyValue as CompanyRecord)]
  })
}
