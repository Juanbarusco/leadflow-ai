import type {
  CrmAiAdvice,
  CrmStage,
  InteractionChannel,
  InteractionOutcome,
} from "@/lib/crm/types"

const stageProbability: Record<CrmStage, number> = {
  new: 15,
  contacted: 28,
  follow_up: 38,
  meeting: 55,
  proposal: 68,
  negotiation: 80,
  won: 100,
  lost: 0,
}

function futureBusinessDate(days: number, hour = 9, minute = 30) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1)
  }
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function chooseStage(
  currentStage: CrmStage,
  outcome: InteractionOutcome,
  notes: string,
): CrmStage {
  if (outcome === "won") return "won"
  if (outcome === "lost") return "lost"
  if (outcome === "meeting_booked") return "meeting"
  if (outcome === "proposal_requested") return "proposal"
  if (outcome === "asked_return" || outcome === "busy" || outcome === "no_answer") return "follow_up"

  const normalized = notes.toLocaleLowerCase("pt-BR")
  if (/proposta|orçamento|orcamento|valor do projeto/.test(normalized)) return "proposal"
  if (/reuni[aã]o|agenda|videochamada|meet/.test(normalized)) return "meeting"
  if (/negocia|desconto|condi[cç][aã]o|contrato/.test(normalized)) return "negotiation"
  if (outcome === "not_interested") return "follow_up"
  if (currentStage === "new") return "contacted"
  return currentStage
}

export function analyzeInteraction(input: {
  currentStage: CrmStage
  channel: InteractionChannel
  outcome: InteractionOutcome
  notes: string
  requestedFollowUpAt?: string
}): CrmAiAdvice {
  const normalized = input.notes.toLocaleLowerCase("pt-BR")
  const stageAfter = chooseStage(input.currentStage, input.outcome, normalized)

  let objection = "Nenhuma objeção clara"
  let recommendation = "Confirme o interesse, recapitule a dor principal e termine com um próximo passo objetivo."
  let nextAction: string | undefined = "Fazer follow-up com uma mensagem curta e personalizada"
  let nextActionAt: string | undefined = input.requestedFollowUpAt || futureBusinessDate(2)

  if (/sem tempo|ocupad|correria|agora n[aã]o|depois eu vejo|momento ruim/.test(normalized) || input.outcome === "busy") {
    objection = "Falta de tempo"
    recommendation = "Não tente explicar toda a solução agora. Envie um insight em até três linhas, peça cinco minutos e ofereça dois horários específicos."
    nextAction = "Retornar com uma abordagem de 5 minutos"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(2, 9, 30)
  } else if (/j[aá] (tem|temos|possui|possuem)|ag[eê]ncia|fornecedor|freelancer|marketing interno/.test(normalized)) {
    objection = "Já possui fornecedor"
    recommendation = "Não ataque o fornecedor atual. Posicione sua oferta como diagnóstico ou serviço complementar para uma lacuna específica encontrada pela IA."
    nextAction = "Enviar comparação complementar sem pedir troca de fornecedor"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(3, 10, 0)
  } else if (/caro|pre[cç]o|valor alto|sem verba|or[cç]amento apertado|investimento/.test(normalized)) {
    objection = "Orçamento"
    recommendation = "Reduza o risco percebido: apresente uma primeira entrega menor, resultado esperado e possibilidade de expansão depois da validação."
    nextAction = "Reformular proposta com escopo de entrada"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(2, 14, 0)
  } else if (/secret[aá]ria|recep[cç][aã]o|s[oó]cio|dono|respons[aá]vel|decisor/.test(normalized)) {
    objection = "Acesso ao decisor"
    recommendation = "Peça o nome do responsável e envie um resumo que a recepção consiga encaminhar. Evite tentar vender para quem não decide."
    nextAction = "Identificar decisor e encaminhar resumo executivo"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(1, 9, 0)
  } else if (/n[aã]o tem interesse|n[aã]o quer|sem interesse|n[aã]o precisa/.test(normalized) || input.outcome === "not_interested") {
    objection = "Prioridade percebida baixa"
    recommendation = "Não pressione. Registre o motivo, envie apenas uma evidência concreta da oportunidade e programe uma retomada mais distante."
    nextAction = "Nutrir com um insight e retomar no próximo ciclo"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(21, 10, 0)
  }

  if (input.outcome === "no_answer") {
    objection = "Sem contato"
    recommendation = "Alterne o canal. Se ligou, tente WhatsApp; se enviou mensagem, faça uma ligação curta em outro horário."
    nextAction = "Tentar contato por outro canal"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(1, 9, 30)
  }

  if (input.outcome === "asked_return") {
    objection = "Retorno solicitado"
    recommendation = "Respeite o horário pedido e mencione que está retornando conforme combinado. Isso reduz resistência e aumenta a confiança."
    nextAction = "Retornar no horário combinado"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(2, 9, 30)
  }

  if (input.outcome === "meeting_booked") {
    objection = "Nenhuma objeção crítica"
    recommendation = "Prepare três pontos: problema observado, impacto comercial e proposta de primeiro passo. Leve exemplos do mesmo segmento."
    nextAction = "Preparar reunião comercial"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(1, 8, 30)
  }

  if (input.outcome === "proposal_requested") {
    objection = "Validação de investimento"
    recommendation = "Envie uma proposta curta, com escopo, prazo, resultado esperado e uma única chamada para ação. Já deixe o follow-up agendado."
    nextAction = "Enviar proposta e agendar revisão"
    nextActionAt = input.requestedFollowUpAt || futureBusinessDate(1, 10, 0)
  }

  if (input.outcome === "won") {
    objection = "Venda concluída"
    recommendation = "Confirme próximos passos, responsáveis, prazo inicial e materiais necessários para o onboarding."
    nextAction = undefined
    nextActionAt = undefined
  }

  if (input.outcome === "lost") {
    objection = "Oportunidade encerrada"
    recommendation = "Registre o motivo real da perda. Use esse dado para melhorar oferta, qualificação e abordagem das próximas empresas."
    nextAction = undefined
    nextActionAt = undefined
  }

  const summary = `${objection}. ${recommendation}`
  const task = nextAction && nextActionAt
    ? {
        title: nextAction,
        description: recommendation,
        dueAt: nextActionAt,
      }
    : undefined

  return {
    objection,
    recommendation,
    summary,
    nextAction,
    nextActionAt,
    stageAfter,
    probability: stageProbability[stageAfter],
    task,
  }
}
