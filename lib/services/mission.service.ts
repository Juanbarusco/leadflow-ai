import type { Mission } from "@/lib/engines/mission-engine"
import type { MissionBrief } from "@/lib/mission/brief"
import { dashboardData } from "@/lib/mock/dashboard"

type MissionApiResponse = {
  mission?: Mission
  error?: string
  code?: string
  retryable?: boolean
}

export class MissionService {
  async getDashboard() {
    return dashboardData
  }

  async createMission(brief: MissionBrief) {
    if (!brief.objective.trim()) {
      throw new Error("A missão precisa ter uma descrição.")
    }

    const response = await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief }),
    })

    const payload = (await response.json()) as MissionApiResponse
    if (!response.ok || !payload.mission) {
      throw new Error(payload.error || "Não foi possível executar a missão.")
    }

    return payload.mission
  }
}

export const missionService = new MissionService()
