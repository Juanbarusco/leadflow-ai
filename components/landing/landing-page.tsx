"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Command,
  Layers3,
  LineChart,
  MapPin,
  MessageSquareText,
  Play,
  Radar,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  WandSparkles,
  Zap,
} from "lucide-react"

const suggestions = [
  "Clínicas sem site em São Carlos",
  "Academias com nota abaixo de 4,5",
  "Dentistas com Instagram ativo",
]

const flowCards = [
  {
    icon: Search,
    step: "01",
    title: "Encontre empresas",
    description: "A IA cruza região, segmento, reputação e presença digital em segundos.",
  },
  {
    icon: Radar,
    step: "02",
    title: "Priorize oportunidades",
    description: "Cada empresa recebe score, potencial de ticket, urgência e chance de fechamento.",
  },
  {
    icon: WandSparkles,
    step: "03",
    title: "Aborde com contexto",
    description: "WhatsApp, e-mail e roteiro de ligação prontos para iniciar a conversa certa.",
  },
]

const activity = [
  { label: "Empresa encontrada", value: "Clínica Prime", tone: "emerald" },
  { label: "Oportunidade", value: "Landing page", tone: "violet" },
  { label: "Lead score", value: "92/100", tone: "cyan" },
  { label: "Próxima ação", value: "Enviar WhatsApp", tone: "amber" },
]

const features = [
  {
    icon: Building2,
    title: "Prospecção inteligente",
    text: "Busque empresas por intenção comercial, não apenas por categoria.",
  },
  {
    icon: BarChart3,
    title: "Diagnóstico multicanal",
    text: "Website, SEO, Google e Instagram reunidos em uma única leitura.",
  },
  {
    icon: MessageSquareText,
    title: "Abordagens personalizadas",
    text: "Mensagens prontas com dor, oportunidade e contexto de cada empresa.",
  },
  {
    icon: Layers3,
    title: "Pipeline comercial",
    text: "Organize descoberta, contato, proposta e fechamento sem perder timing.",
  },
  {
    icon: Target,
    title: "Score de oportunidade",
    text: "Entenda rapidamente onde existe maior chance de receita agora.",
  },
  {
    icon: Bot,
    title: "Copiloto de vendas",
    text: "A IA recomenda o que vender, como vender e qual deve ser o próximo passo.",
  },
]

export function LandingPage() {
  const [command, setCommand] = useState("")

  function applySuggestion(value: string) {
    setCommand(value)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070c] text-white selection:bg-violet-500/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(45,212,191,0.10),transparent_27%),radial-gradient(circle_at_78%_13%,rgba(124,58,237,0.19),transparent_33%),radial-gradient(circle_at_50%_70%,rgba(37,99,235,0.09),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] shadow-[0_0_35px_rgba(45,212,191,0.12)] backdrop-blur-xl">
              <span className="bg-gradient-to-br from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-sm font-black text-transparent">LF</span>
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#07090f] bg-emerald-400" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">LeadFlow <span className="text-emerald-300">AI</span></p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600">Sales Operating System</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-zinc-400 lg:flex">
            <a href="#produto" className="transition hover:text-white">Produto</a>
            <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
            <a href="#recursos" className="transition hover:text-white">Recursos</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-xl px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white sm:inline-flex">Entrar</Link>
            <Link href="/signup" className="inline-flex items-center rounded-xl border border-white/15 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-100">
              Abrir cockpit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-96px)] items-center gap-16 pb-20 pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:pb-28 lg:pt-6">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2 text-xs font-medium text-emerald-200 shadow-[0_0_28px_rgba(52,211,153,0.06)]">
              <Sparkles className="h-3.5 w-3.5" />
              Seu funcionário comercial com inteligência artificial
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[78px]">
              A IA prospecta.
              <span className="mt-2 block bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">Você fecha.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Encontre empresas, identifique o que vender, priorize oportunidades e gere abordagens personalizadas em uma única operação comercial.
            </p>

            <div className="mt-9 rounded-[26px] border border-white/10 bg-white/[0.045] p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center rounded-[20px] border border-white/10 bg-black/35 p-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-cyan-300">
                  <Command className="h-5 w-5" />
                </div>
                <input
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                  placeholder="Ex.: encontre 20 clínicas em São Carlos sem site..."
                />
                <Link
                  href="/signup"
                  className="inline-flex h-11 shrink-0 items-center rounded-2xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 sm:px-5"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Executar missão</span>
                  <span className="sm:hidden">Executar</span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 px-1 pb-1 pt-3">
                <span className="px-2 py-1 text-[11px] text-zinc-600">Experimente:</span>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => applySuggestion(suggestion)}
                    className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-[11px] text-zinc-400 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-violet-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-zinc-500">
              {['Sem planilhas', 'Diagnóstico em segundos', 'Abordagens prontas'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><Check className="h-3 w-3" /></span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div id="produto" className="relative mx-auto w-full max-w-[760px] lg:ml-auto">
            <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-br from-violet-500/15 via-transparent to-emerald-400/10 blur-3xl" />
            <div className="landing-dashboard-float relative overflow-hidden rounded-[30px] border border-white/12 bg-[#0a0d14]/95 p-3 shadow-[0_55px_140px_rgba(0,0,0,0.62)] backdrop-blur-2xl">
              <div className="rounded-[23px] border border-white/8 bg-[#090b11]">
                <div className="flex h-14 items-center justify-between border-b border-white/8 px-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-[10px] font-black text-white">LF</div>
                    <div>
                      <p className="text-xs font-semibold">Cockpit comercial</p>
                      <p className="text-[9px] text-zinc-600">Operação ao vivo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-2.5 py-1 text-[9px] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> IA ativa
                  </div>
                </div>

                <div className="grid gap-3 p-3 sm:grid-cols-[0.72fr_1.28fr] sm:p-4">
                  <aside className="hidden rounded-2xl border border-white/7 bg-white/[0.025] p-3 sm:block">
                    <div className="space-y-2">
                      {[['Visão geral', LineChart], ['Missões', Radar], ['Empresas', Building2], ['Pipeline', Layers3]].map(([label, Icon], index) => {
                        const MenuIcon = Icon as typeof LineChart
                        return (
                          <div key={label as string} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[10px] ${index === 0 ? 'bg-white text-zinc-950' : 'text-zinc-500'}`}>
                            <MenuIcon className="h-3.5 w-3.5" /> {label as string}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-28 rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] p-3">
                      <p className="text-[9px] text-violet-200">Créditos de IA</p>
                      <p className="mt-1 text-lg font-semibold">1.240</p>
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-violet-400" /></div>
                    </div>
                  </aside>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">Receita em oportunidade</p>
                          <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">R$ 48.600</p>
                          <p className="mt-1 text-[10px] text-emerald-300">+18,4% nesta semana</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><TrendingUp className="h-5 w-5" /></div>
                      </div>
                      <div className="mt-5 flex h-20 items-end gap-1.5">
                        {[34, 48, 42, 57, 51, 70, 62, 82, 77, 93, 86, 100].map((height, index) => (
                          <div key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-500/30 to-cyan-300/80" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                        <div className="flex items-center justify-between"><span className="text-[9px] text-zinc-500">Leads quentes</span><Target className="h-3.5 w-3.5 text-orange-300" /></div>
                        <p className="mt-3 text-xl font-semibold">23</p>
                        <p className="mt-1 text-[9px] text-zinc-600">score acima de 85</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                        <div className="flex items-center justify-between"><span className="text-[9px] text-zinc-500">Confiança IA</span><Bot className="h-3.5 w-3.5 text-cyan-300" /></div>
                        <p className="mt-3 text-xl font-semibold">94%</p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[94%] rounded-full bg-cyan-300" /></div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] font-medium">Atividade da IA</p>
                        <span className="text-[9px] text-zinc-600">agora</span>
                      </div>
                      <div className="space-y-2">
                        {activity.map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2">
                            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-[9px] text-zinc-500">{item.label}</span></div>
                            <span className="text-[9px] font-medium text-zinc-300">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="landing-float-card absolute -left-5 top-[18%] hidden w-44 rounded-2xl border border-white/10 bg-[#10131b]/95 p-3 shadow-2xl backdrop-blur-xl sm:block">
              <div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300"><Target className="h-4 w-4" /></div><div><p className="text-[9px] text-zinc-500">Lead score</p><p className="text-sm font-semibold">92/100</p></div></div>
            </div>
            <div className="landing-float-card-delayed absolute -bottom-6 right-5 hidden w-56 rounded-2xl border border-white/10 bg-[#10131b]/95 p-3.5 shadow-2xl backdrop-blur-xl sm:block">
              <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Send className="h-4 w-4" /></div><div><p className="text-[9px] uppercase tracking-wider text-zinc-600">Próxima ação</p><p className="mt-1 text-xs font-medium">Enviar abordagem consultiva</p><p className="mt-1 text-[9px] text-zinc-600">Melhor horário: 14h30</p></div></div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-t border-white/7 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Da busca ao fechamento</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Uma operação comercial inteira em três comandos.</h2>
            <p className="mt-5 text-base leading-7 text-zinc-500">Menos tempo pesquisando. Mais tempo conversando com empresas que realmente têm potencial.</p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {flowCards.map((card) => {
              const Icon = card.icon
              return (
                <article key={card.title} className="group relative overflow-hidden rounded-[28px] border border-white/9 bg-white/[0.028] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-white/[0.045]">
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><Icon className="h-5 w-5" /></div>
                    <span className="text-xs font-medium text-zinc-700">{card.step}</span>
                  </div>
                  <h3 className="relative mt-8 text-xl font-semibold">{card.title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-zinc-500">{card.description}</p>
                  <div className="relative mt-7 flex items-center text-xs font-medium text-zinc-400 transition group-hover:text-white">Ver como funciona <ChevronRight className="ml-1 h-3.5 w-3.5" /></div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="recursos" className="grid gap-12 border-t border-white/7 py-24 sm:py-32 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Inteligência acionável</p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Não entregue dados. Entregue a próxima decisão.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">Cada análise transforma sinais digitais em argumento comercial, oferta recomendada e ação de fechamento.</p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                    <Icon className="h-5 w-5 text-violet-300" />
                    <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-zinc-600">{feature.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative rounded-[32px] border border-white/10 bg-white/[0.035] p-4 shadow-2xl">
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_60%)] blur-2xl" />
            <div className="relative rounded-[25px] border border-white/8 bg-[#090c12] p-5 sm:p-7">
              <div className="flex flex-col gap-5 border-b border-white/7 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500"><MapPin className="h-3.5 w-3.5" /> São Carlos, SP</div>
                  <h3 className="mt-3 text-2xl font-semibold">Clínica Odonto Prime</h3>
                  <p className="mt-2 text-sm text-zinc-500">Odontologia • 4,8 no Google • 126 avaliações</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-orange-400/15 bg-orange-400/[0.05] px-4 py-3">
                  <div><p className="text-[9px] uppercase tracking-wider text-orange-200/60">Opportunity score</p><p className="mt-1 text-2xl font-semibold text-orange-200">92</p></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[conic-gradient(#fb923c_0_92%,rgba(255,255,255,0.08)_92%_100%)]"><div className="h-9 w-9 rounded-full bg-[#0a0d13]" /></div>
                </div>
              </div>

              <div className="grid gap-3 py-5 sm:grid-cols-3">
                {[['Ticket sugerido', 'R$ 3.500', CircleDollarSign], ['Chance de fechar', '78%', Target], ['Urgência', 'Alta', Zap]].map(([label, value, Icon]) => {
                  const MetricIcon = Icon as typeof CircleDollarSign
                  return <div key={label as string} className="rounded-2xl border border-white/7 bg-white/[0.025] p-4"><MetricIcon className="h-4 w-4 text-cyan-300" /><p className="mt-4 text-[10px] text-zinc-600">{label as string}</p><p className="mt-1 text-lg font-semibold">{value as string}</p></div>
                })}
              </div>

              <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.055] p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-violet-200"><Bot className="h-4 w-4" /> Recomendação da IA</div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">Ofereça uma landing page focada em implantes, conectada ao WhatsApp e otimizada para buscas locais. Use a reputação de 4,8 estrelas como prova principal.</p>
                <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-white/5 px-3 py-1.5 text-[10px] text-zinc-400">Dor: site genérico</span><span className="rounded-full bg-white/5 px-3 py-1.5 text-[10px] text-zinc-400">Canal: WhatsApp</span><span className="rounded-full bg-white/5 px-3 py-1.5 text-[10px] text-zinc-400">Timing: hoje, 14h30</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/7 py-24 sm:py-32">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-violet-500/15 via-white/[0.035] to-emerald-400/10 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-emerald-300"><Sparkles className="h-6 w-6" /></div>
              <h2 className="mt-7 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Transforme prospecção em operação.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400">Abra o cockpit, dê uma missão para a IA e comece a trabalhar apenas nas oportunidades que merecem sua atenção.</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-100">Começar agora <ArrowRight className="ml-2 h-4 w-4" /></Link>
                <button type="button" className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"><Play className="mr-2 h-4 w-4" /> Ver demonstração</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-5 border-t border-white/7 py-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] text-[10px] font-bold text-zinc-300">LF</div><span>LeadFlow AI • Commercial Intelligence OS</span></div>
          <div className="flex items-center gap-5"><span>Privacidade</span><span>Termos</span><span>© 2026</span></div>
        </footer>
      </div>
    </main>
  )
}
