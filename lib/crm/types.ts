export const CRM_STAGES = [
  "new",
  "contacted",
  "follow_up",
  "meeting",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const

export type CrmStage = (typeof CRM_STAGES)[number]

export const INTERACTION_CHANNELS = [
  "call",
  "whatsapp",
  "email",
  "meeting",
  "note",
] as const

export type InteractionChannel = (typeof INTERACTION_CHANNELS)[number]

export const INTERACTION_OUTCOMES = [
  "completed",
  "no_answer",
  "busy",
  "asked_return",
  "meeting_booked",
  "proposal_requested",
  "not_interested",
  "won",
  "lost",
] as const

export type InteractionOutcome = (typeof INTERACTION_OUTCOMES)[number]

export type CrmDeal = {
  id: string
  organizationId: string
  companyId: string
  companyExternalId: string
  companyName: string
  companyCity: string
  companyState?: string
  companyPhone?: string
  stage: CrmStage
  estimatedValue: number
  probability: number
  nextAction?: string
  nextActionAt?: string
  aiSummary?: string
  lastInteractionAt?: string
  lossReason?: string
  createdAt: string
  updatedAt: string
}

export type CrmInteraction = {
  id: string
  companyExternalId: string
  channel: InteractionChannel
  outcome: InteractionOutcome
  notes: string
  messageUsed?: string
  aiObjection?: string
  aiRecommendation?: string
  stageBefore: CrmStage
  stageAfter: CrmStage
  occurredAt: string
  createdAt: string
}

export type CrmTaskStatus = "pending" | "done" | "cancelled"

export type CrmTask = {
  id: string
  companyExternalId: string
  title: string
  description?: string
  dueAt: string
  status: CrmTaskStatus
  source: "manual" | "ai"
  interactionId?: string
  completedAt?: string
  createdAt: string
}

export type CrmSnapshot = {
  mode: "live" | "demo"
  deal: CrmDeal | null
  interactions: CrmInteraction[]
  tasks: CrmTask[]
}

export type RegisterInteractionInput = {
  channel: InteractionChannel
  outcome: InteractionOutcome
  notes: string
  messageUsed?: string
  occurredAt?: string
  requestedFollowUpAt?: string
  estimatedValue?: number
}

export type CrmAiAdvice = {
  objection: string
  recommendation: string
  summary: string
  nextAction?: string
  nextActionAt?: string
  stageAfter: CrmStage
  probability: number
  task?: {
    title: string
    description: string
    dueAt: string
  }
}

export const CRM_STAGE_LABELS: Record<CrmStage, string> = {
  new: "Novo",
  contacted: "Contato feito",
  follow_up: "Follow-up",
  meeting: "Reunião",
  proposal: "Proposta",
  negotiation: "Negociação",
  won: "Cliente",
  lost: "Perdido",
}

export const CHANNEL_LABELS: Record<InteractionChannel, string> = {
  call: "Ligação",
  whatsapp: "WhatsApp",
  email: "E-mail",
  meeting: "Reunião",
  note: "Anotação",
}

export const OUTCOME_LABELS: Record<InteractionOutcome, string> = {
  completed: "Contato realizado",
  no_answer: "Não respondeu",
  busy: "Estava sem tempo",
  asked_return: "Pediu retorno",
  meeting_booked: "Reunião marcada",
  proposal_requested: "Pediu proposta",
  not_interested: "Sem interesse agora",
  won: "Venda fechada",
  lost: "Oportunidade perdida",
}
