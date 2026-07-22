import { ArrowUpRight, Building2, Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Discovery = {
  niche: string
  opportunities: number
  score: number
  reason: string
}

type AiDiscoveriesProps = {
  discoveries: Discovery[]
}

export function AiDiscoveries({
  discoveries,
}: AiDiscoveriesProps) {
  const totalOpportunities = discoveries.reduce(
    (total, item) => total + item.opportunities,
    0
  )

  return (
    <section className="space-y-4">
      <div>
        <Badge variant="outline">Descobertas da IA</Badge>

        <h2 className="mt-2 text-2xl font-bold">
          O que o LeadFlow descobriu hoje
        </h2>

        <p className="text-muted-foreground">
          A IA cruzou milhares de sinais e encontrou os melhores mercados para
          atacar agora.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {discoveries.map((item) => (
          <Card
            key={item.niche}
            className="rounded-3xl"
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="rounded-xl border p-2">
                  <Building2 className="h-5 w-5" />
                </div>

                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <Badge variant="secondary">
                  {item.niche}
                </Badge>

                <CardTitle className="mt-4 text-3xl">
                  {item.opportunities} oportunidades
                </CardTitle>

                <p className="mt-3 text-sm text-muted-foreground">
                  {item.reason}
                </p>
              </div>
            </CardHeader>

            <CardContent className="flex items-center justify-between border-t pt-5">
              <div>
                <p className="text-xs text-muted-foreground">
                  Score LeadFlow
                </p>

                <p className="text-2xl font-bold">
                  {item.score}
                </p>
              </div>

              <Button variant="ghost">
                Explorar
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-2xl border bg-black px-5 py-4 text-white">
        <Flame className="h-5 w-5 text-orange-500" />

        <div className="flex-1">
          <p className="font-medium">
            A IA encontrou {totalOpportunities} oportunidades.
          </p>

          <p className="text-sm text-zinc-400">
            Mercados priorizados automaticamente pela inteligência comercial.
          </p>
        </div>

        <Button variant="secondary">
          Ver critérios da IA
        </Button>
      </div>
    </section>
  )
}