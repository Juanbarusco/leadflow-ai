import { missionEngine } from "@/lib/engines/mission-engine"
import { dashboardData } from "@/lib/mock/dashboard"

export class MissionService {
  async getDashboard() {
    return dashboardData
  }

  async createMission(prompt: string) {
    if (!prompt.trim()) {
      throw new Error("A missão precisa ter uma descrição.")
    }

    return missionEngine.create(prompt)
  }
}

export const missionService = new MissionService()