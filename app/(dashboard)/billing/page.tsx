import { redirect } from "next/navigation"
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Coins,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { getCurrentAccount } from "@/lib/auth/session"

const creditRules = [
  ["Descoberta de empresa", "1 crédito", "Busca inicial e inclusão no workspace"],
  ["Enriquecimento completo", "3 créditos", "Telefone, endereço, website e dados do Google"],
  ["Análise comercial com IA", "2 créditos", "Score, diagnóstico e oportunidades"],
  ["Nova abordagem com IA", "1 crédito", "Mensagem personalizada por canal"],
]

export default async function BillingPage() {
  const account = await getCurrentAccount()
  if (!account) redirect("/login")

  return (
    <div className="mx-auto max-w-6xl pb-20 pt-3 sm:pt-7">
      <header className="grid gap-7 border-b border-zinc-200 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Plano e consumo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">Créditos sem surpresa.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">A estrutura de saldo e extrato já está preparada. O checkout e a recorrência entram na etapa de pagamentos.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <Clock3 className="h-3.5 w-3.5" /> Cobrança ainda não ativada
        </span>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="overflow-hidden rounded-[30px] border border-zinc-800 bg-zinc-950 p-7 text-white shadow-2xl shadow-zinc-950/10 sm:p-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-violet-200"><Sparkles className="h-3.5 w-3.5" /> Plano Fundador Beta</span>
              <h2 className="mt-5 text-3xl font-semibold">{account.workspace.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">Acesso completo ao produto durante a construção.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:min-w-48">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Saldo de demonstração</p>
              <p className="mt-2 text-4xl font-semibold">1.240</p>
              <p className="mt-1 text-xs text-zinc-500">créditos para validar a interface</p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [ShieldCheck, "Sem cobrança", "Nenhum cartão vinculado"],
              [Coins, "Extrato preparado", "Ledger seguro no banco"],
              [CreditCard, "Checkout pendente", "Mercado Pago na Release 0.13"],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof ShieldCheck
              return (
                <div key={String(title)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <ItemIcon className="h-5 w-5 text-violet-300" />
                  <p className="mt-3 text-sm font-semibold">{String(title)}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{String(text)}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><CircleDollarSign className="h-5 w-5" /></span>
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">Como a cobrança funcionará</h2>
              <p className="mt-1 text-sm text-zinc-500">Reserva, débito e estorno automáticos.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {[
              "O sistema mostra o custo estimado antes da missão.",
              "Os créditos são reservados para impedir saldo negativo.",
              "Após o sucesso, o débito é confirmado no extrato.",
              "Em caso de falha, a reserva é estornada automaticamente.",
            ].map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-6 text-zinc-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{item}</div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-7 rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Tabela inicial</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Consumo previsto por ação</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-500">Estes valores são configuráveis e serão recalibrados depois dos testes reais das APIs.</p>
        </div>
        <div className="mt-7 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200">
          {creditRules.map(([action, cost, description]) => (
            <div key={action} className="grid gap-2 bg-white px-5 py-4 sm:grid-cols-[1fr_140px_1.3fr] sm:items-center">
              <p className="text-sm font-semibold text-zinc-950">{action}</p>
              <p className="text-sm font-semibold text-violet-700">{cost}</p>
              <p className="text-sm text-zinc-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-7 flex items-center justify-between rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-4 text-sm text-zinc-600">
        <span>Checkout, assinatura e compra avulsa serão ativados somente após a medição dos custos reais.</span>
        <span className="hidden items-center gap-1 font-semibold text-zinc-950 sm:inline-flex">Release 0.13 <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </div>
  )
}
