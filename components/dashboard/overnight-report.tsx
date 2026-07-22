import { Brain, Sparkles, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function OvernightReport() {
  return (
    <Card className="rounded-3xl border bg-black text-white overflow-hidden">
      <div className="p-8">

        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <Brain className="h-4 w-4" />
          Enquanto você dormia...
        </div>

        <h2 className="mt-4 text-3xl font-bold">
          A IA trabalhou por você.
        </h2>

        <p className="mt-2 text-zinc-400 max-w-2xl">
          O LeadFlow analisou empresas, descartou negócios sem potencial,
          encontrou novas oportunidades e preparou abordagens prontas.
        </p>

        <div className="mt-8 space-y-5">

          <div className="flex justify-between">
            <span>Analisou empresas</span>
            <span className="font-semibold">1.284</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800">
            <div className="h-full w-[94%] rounded-full bg-emerald-400" />
          </div>

          <div className="flex justify-between">
            <span>Descartou empresas sem potencial</span>
            <span className="font-semibold">1.061</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800">
            <div className="h-full w-[82%] rounded-full bg-zinc-400" />
          </div>

          <div className="flex justify-between">
            <span>Novas oportunidades</span>
            <span className="font-semibold text-emerald-400">
              23
            </span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800">
            <div className="h-full w-[36%] rounded-full bg-violet-500" />
          </div>

          <div className="flex justify-between">
            <span>Mensagens preparadas</span>
            <span className="font-semibold">
              14
            </span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800">
            <div className="h-full w-[24%] rounded-full bg-cyan-400" />
          </div>

        </div>

        <div className="mt-8 flex gap-3">

          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Ver relatório completo
          </Button>

          <Button variant="secondary">
            <Send className="mr-2 h-4 w-4" />
            Executar nova missão
          </Button>

        </div>

      </div>
    </Card>
  )
}