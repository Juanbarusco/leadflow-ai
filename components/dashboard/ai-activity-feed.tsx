import {
  Building2,
  Clock3,
  MessageSquareText,
  Search,
  Sparkles,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const activities = [
  {
    icon: Search,
    title: "Pesquisa concluída",
    description: "Analisei 382 clínicas odontológicas em Campinas.",
    time: "há 2 min",
  },
  {
    icon: Building2,
    title: "Nova oportunidade",
    description: "Clínica Sorriso possui site desatualizado e SEO fraco.",
    time: "há 8 min",
  },
  {
    icon: MessageSquareText,
    title: "Abordagem criada",
    description: "Mensagem personalizada pronta para WhatsApp.",
    time: "há 15 min",
  },
  {
    icon: Sparkles,
    title: "Estratégia definida",
    description: "Landing Page possui maior chance de conversão.",
    time: "há 24 min",
  },
]

export function AIActivityFeed() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Enquanto você estava fora...</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon

          return (
            <div
              key={activity.title}
              className="flex gap-4 rounded-2xl border p-4 transition hover:bg-muted/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {activity.title}
                  </h3>

                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3 w-3" />
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}