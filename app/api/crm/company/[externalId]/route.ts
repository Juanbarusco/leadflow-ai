import { NextResponse } from "next/server"

import {
  CRM_STAGES,
  INTERACTION_CHANNELS,
  INTERACTION_OUTCOMES,
  type CrmStage,
  type InteractionChannel,
  type InteractionOutcome,
} from "@/lib/crm/types"
import {
  completeCrmTask,
  createCrmTask,
  ensureCrmDeal,
  getCrmSnapshot,
  registerCrmInteraction,
  updateCrmStage,
} from "@/lib/repositories/crm.repository"
import { isSupabaseConfigured } from "@/lib/supabase/config"

function friendlyCrmError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Não foi possível salvar a ação comercial."
  if (/crm_deals|crm_interactions|crm_tasks|relation .* does not exist/i.test(message)) {
    return "O CRM ainda não foi instalado no Supabase. Execute a migration da Release 0.12."
  }
  return message
}

function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ externalId: string }> },
) {
  const { externalId } = await params

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ mode: "demo", deal: null, interactions: [], tasks: [] })
  }

  try {
    const snapshot = await getCrmSnapshot(decodeURIComponent(externalId))
    if (!snapshot) return apiError("Sessão ou workspace indisponível.", 401)
    return NextResponse.json(snapshot)
  } catch (error) {
    const message = friendlyCrmError(error)
    return apiError(message, message.includes("não encontrada") ? 404 : 500)
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ externalId: string }> },
) {
  const { externalId } = await params
  const companyExternalId = decodeURIComponent(externalId)

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ mode: "demo" })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return apiError("Corpo da requisição inválido.")
  }

  try {
    if (body.action === "ensure_deal") {
      const estimatedValue = typeof body.estimatedValue === "number" ? body.estimatedValue : undefined
      const snapshot = await ensureCrmDeal(companyExternalId, estimatedValue)
      if (!snapshot) return apiError("Sessão ou workspace indisponível.", 401)
      return NextResponse.json(snapshot)
    }

    if (body.action === "register_interaction") {
      const channel = body.channel as InteractionChannel
      const outcome = body.outcome as InteractionOutcome
      const notes = typeof body.notes === "string" ? body.notes.trim() : ""

      if (!INTERACTION_CHANNELS.includes(channel)) return apiError("Canal inválido.")
      if (!INTERACTION_OUTCOMES.includes(outcome)) return apiError("Resultado inválido.")
      if (!notes) return apiError("Descreva o que aconteceu no contato.")

      const snapshot = await registerCrmInteraction(companyExternalId, {
        channel,
        outcome,
        notes,
        messageUsed: typeof body.messageUsed === "string" ? body.messageUsed : undefined,
        occurredAt: typeof body.occurredAt === "string" ? body.occurredAt : undefined,
        requestedFollowUpAt:
          typeof body.requestedFollowUpAt === "string" && body.requestedFollowUpAt
            ? body.requestedFollowUpAt
            : undefined,
        estimatedValue: typeof body.estimatedValue === "number" ? body.estimatedValue : undefined,
      })

      if (!snapshot) return apiError("Sessão ou workspace indisponível.", 401)
      return NextResponse.json(snapshot)
    }

    if (body.action === "update_stage") {
      const stage = body.stage as CrmStage
      if (!CRM_STAGES.includes(stage)) return apiError("Etapa inválida.")
      const snapshot = await updateCrmStage(companyExternalId, stage)
      if (!snapshot) return apiError("Sessão ou workspace indisponível.", 401)
      return NextResponse.json(snapshot)
    }

    if (body.action === "create_task") {
      const title = typeof body.title === "string" ? body.title.trim() : ""
      const dueAt = typeof body.dueAt === "string" ? body.dueAt : ""
      if (!title || !dueAt) return apiError("Informe título e vencimento da tarefa.")
      const snapshot = await createCrmTask(companyExternalId, {
        title,
        description: typeof body.description === "string" ? body.description.trim() : undefined,
        dueAt,
      })
      if (!snapshot) return apiError("Sessão ou workspace indisponível.", 401)
      return NextResponse.json(snapshot)
    }

    if (body.action === "complete_task") {
      const taskId = typeof body.taskId === "string" ? body.taskId : ""
      if (!taskId) return apiError("Tarefa inválida.")
      const snapshot = await completeCrmTask(companyExternalId, taskId)
      if (!snapshot) return apiError("Sessão ou workspace indisponível.", 401)
      return NextResponse.json(snapshot)
    }

    return apiError("Ação não reconhecida.")
  } catch (error) {
    const message = friendlyCrmError(error)
    return apiError(message, message.includes("não encontrada") ? 404 : 500)
  }
}
