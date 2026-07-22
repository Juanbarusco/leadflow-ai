import {
  Activity,
  Brain,
  CheckCircle2,
  Search,
  Send,
  Globe,
  Clock,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const events = [
  {
    icon: Search,
    title: "Analisando Clínica Sorriso Prime",
    time: "Agora",
  },
  {
    icon: Globe,
    title: "Instagram encontrado",
    time: "19:42",
  },
  {
    icon: Globe,
    title: "Google Business encontrado",
    time: "19:42",
  },
  {
    icon: Brain,
    title: "SEO fraco detectado",
    time: "19:43",
  },
  {
    icon: Activity,
    title: "Site lento identificado",
    time: "19:43",
  },
  {
    icon: Brain,
    title: "Gerando abordagem personalizada",
    time: "19:44",
  },
  {
    icon: Send,
    title: "Lead enviado ao Pipeline",
    time: "19:44",
  },
]

export function LiveActivity() {
  return (
    <Card className="rounded-3xl p-6">

      <div className="flex items-center justify-between">

        <div>
          <Badge className="mb-3 bg-emerald-500 hover:bg-emerald-500">
            IA ONLINE
          </Badge>

          <h2 className="text-2xl font-bold">
            Atividade em tempo real
          </h2>

          <p className="text-muted-foreground mt-1">
            Acompanhe a IA trabalhando neste exato momento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Processando
          </span>
        </div>

      </div>

      <div className="mt-8 space-y-5">

        {events.map((event) => {
          const Icon = event.icon

          return (
            <div
              key={event.title}
              className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">
                    {event.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                </div>

              </div>

              <CheckCircle2 className="h-5 w-5 text-emerald-500" />

            </div>
          )
        })}

      </div>

    </Card>
  )
}