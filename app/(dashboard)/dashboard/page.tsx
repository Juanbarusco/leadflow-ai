import { AiDiscoveries } from "@/components/dashboard/ai-discoveries"
import { CommercialRadar } from "@/components/dashboard/commercial-radar"
import { DashboardHero } from "@/components/dashboard/dashboard-hero"
import { MissionControl } from "@/components/dashboard/mission-control"

import { missionService } from "@/lib/services/mission.service"

export default async function DashboardPage() {
  const data = await missionService.getDashboard()

  return (
    <div className="space-y-8">
      <DashboardHero />
      <MissionControl />
      <AiDiscoveries discoveries={data.discoveries} />
      <CommercialRadar />
    </div>
  )
}