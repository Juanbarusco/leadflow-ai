import { ProspectingCommand } from "@/components/prospecting/prospecting-command"

export default function ProspectingPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-150px)] w-full max-w-[1380px] items-center py-8 sm:py-12">
      <div className="w-full">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Nova prospecção</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
            Defina o objetivo. A IA cuida da busca.
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600">
            O segmento e a região ficam separados para você não precisar escrever comandos longos ou ambíguos.
          </p>
        </div>

        <ProspectingCommand variant="standalone" />
      </div>
    </div>
  )
}
