import { NextResponse } from "next/server"

import { missionEngine } from "@/lib/engines/mission-engine"
import { normalizeMissionBrief, type MissionBrief } from "@/lib/mission/brief"
import { GooglePlacesError } from "@/lib/places/google-places.provider"
import { persistMission } from "@/lib/repositories/mission.repository"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function validateBrief(value: unknown) {
  if (!value || typeof value !== "object") {
    return { valid: false as const, message: "Briefing da missão não informado." }
  }

  const brief = normalizeMissionBrief(value as Partial<MissionBrief>)
  if (brief.objective.trim().length < 12) {
    return { valid: false as const, message: "Descreva o objetivo da prospecção com mais detalhes." }
  }

  if (!brief.segment.trim()) {
    return { valid: false as const, message: "Selecione um segmento." }
  }

  if (brief.location.scope === "city" && !brief.location.city?.trim()) {
    return { valid: false as const, message: "Informe a cidade da prospecção." }
  }

  return { valid: true as const, brief }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { brief?: unknown }
    const validation = validateBrief(payload.brief)

    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    const mission = await missionEngine.create(validation.brief)
    const persistence = await persistMission(mission)
    return NextResponse.json({ mission, persistence })
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined
    const placesError = cause instanceof GooglePlacesError ? cause : error instanceof GooglePlacesError ? error : null

    if (placesError) {
      const status = placesError.status >= 400 && placesError.status < 600 ? placesError.status : 502
      return NextResponse.json(
        {
          error: placesError.message,
          code: placesError.code,
          retryable: status >= 500 || status === 429,
        },
        { status },
      )
    }

    console.error("Falha na API de missões.", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Não foi possível executar a missão." },
      { status: 500 },
    )
  }
}
