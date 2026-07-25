import { ArrowRight, Building2, CheckCircle2, Clock3, Flame, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const columns = [
  {
    title: "Descobertos",
    count: 18,
    total: "R$ 21.400",
    cards: [
      ["Clínica Nobre", "Odontologia", "94", "Landing page"],
      ["Studio Aura", "Estética", "90", "Automação"],
    ],
  },
  {
    title: "Em contato",
    count: 9,
    total: "R$ 15.800",
    cards: [
      ["Odonto Life", "Odontologia", "88", "Site institucional"],
      ["Instituto Essenza", "Estética", "84", "Funil comercial"],
    ],
  },
  {
    title: "Proposta",
    count: 4,
    total: "R$ 8.640",
    cards: [
      ["Prime Sorriso", "Odontologia", "96", "Proposta enviada"],
      ["Bella Forma", "Estética", "87", "Aguardando retorno"],
    ],
  },
  {
    title: "Fechamento",
    count: 2,
    total: "R$ 4.800",
    cards: [
      ["Clínica Vitta", "Saúde", "98", "Contrato em análise"],
    ],
  },
]

export function PipelineCommand() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Pipeline inteligente</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Oportunidades em movimento</h2>
          <p className="mt-1 text-sm text-muted-foreground">Visão operacional dos leads com maior potencial de receita.</p>
        </div>
        <Button variant="outline">
          Abrir pipeline completo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column, columnIndex) => (
          <Card key={column.title} className="rounded-[26px] border bg-muted/15 p-4 shadow-none">
            <div className="flex items-center justify-between gap-3 px-1 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${columnIndex === 0 ? "bg-sky-500" : columnIndex === 1 ? "bg-indigo-500" : columnIndex === 2 ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <h3 className="font-semibold">{column.title}</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{column.count} leads · {column.total}</p>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              {column.cards.map(([company, segment, score, status]) => (
                <div key={company} className="rounded-2xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-zinc-950 text-white">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{company}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{segment}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{score}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {columnIndex === 0 ? <Flame className="h-3.5 w-3.5 text-orange-500" /> : columnIndex === 3 ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Clock3 className="h-3.5 w-3.5" />}
                      {status}
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
