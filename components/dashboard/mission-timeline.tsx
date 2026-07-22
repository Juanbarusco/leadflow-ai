"use client"

import {
  Camera,
  CheckCircle2,
  Clock3,
  Globe,
  Search,
  Sparkles,
} from "lucide-react"

const events = [
  {
    icon: Search,
    title: "Google Maps conectado",
    time: "10:31:02",
  },
  {
    icon: Globe,
    title: "348 empresas encontradas",
    time: "10:31:04",
  },
  {
    icon: Camera,
    title: "Instagram analisado",
    time: "10:31:08",
  },
  {
    icon: Search,
    title: "SEO verificado",
    time: "10:31:12",
  },
  {
    icon: Sparkles,
    title: "IA calculando potencial",
    time: "10:31:18",
  },
  {
    icon: CheckCircle2,
    title: "Missão concluída",
    time: "10:31:29",
  },
]

export function MissionTimeline() {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <Clock3 className="h-5 w-5 text-emerald-500" />

        <div>
          <h3 className="font-semibold">
            Linha do tempo da missão
          </h3>

          <p className="text-sm text-muted-foreground">
            Tudo que a IA executou durante a pesquisa.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = event.icon

          return (
            <div
              key={`${event.title}-${index}`}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Icon className="h-4 w-4" />
                </div>

                <span>{event.title}</span>
              </div>

              <span className="text-sm text-muted-foreground">
                {event.time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}