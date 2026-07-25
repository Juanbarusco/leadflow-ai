import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Building2,
  CircleHelp,
  Mail,
  MapPin,
  MessageSquareText,
  Search,
  Sparkles,
  Target,
} from "lucide-react"

const steps = [
  [Sparkles, "Crie uma prospecção", "Descreva o que você vende, selecione segmento e região."],
  [Search, "Acompanhe a missão", "A IA encontra, enriquece e prioriza as empresas."],
  [Building2, "Abra o relatório", "Revise contato, diagnóstico, oportunidades e abordagem."],
  [Target, "Execute a próxima ação", "Copie a mensagem e registre o contato quando o CRM estiver ativo."],
]

const faqs = [
  ["Posso buscar em qualquer cidade?", "Sim. A localização é separada do objetivo e aceita cidade, estado, região ou Brasil inteiro."],
  ["Os dados já são reais?", "O modo demonstração usa dados ilustrativos. Ao ativar o Google Places, telefone, endereço, site e avaliações passam a vir da fonte real."],
  ["Onde ficam minhas missões?", "Com Supabase configurado, ficam salvas no workspace. Sem ele, a última missão permanece apenas neste navegador."],
  ["Como funcionam os créditos?", "A carteira e o extrato estão preparados. A cobrança real será ativada depois da medição dos custos das APIs."],
]

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-6xl pb-20 pt-3 sm:pt-7">
      <header className="overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 p-7 text-white shadow-2xl shadow-zinc-950/10 sm:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-violet-200"><CircleHelp className="h-3.5 w-3.5" /> Central de ajuda</span>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Aprenda o fluxo em poucos minutos.</h1>
          <p className="mt-4 text-base leading-7 text-zinc-400">Esta primeira central já cobre o caminho principal. Tutoriais em vídeo, chamados e acompanhamento de suporte entram na etapa final de lançamento.</p>
        </div>
      </header>

      <section className="mt-8">
        <div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-violet-600" /><h2 className="text-2xl font-semibold text-zinc-950">Primeiros passos</h2></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(([Icon, title, description], index) => {
            const StepIcon = Icon as typeof Sparkles
            return (
              <div key={String(title)} className="rounded-[26px] border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><StepIcon className="h-5 w-5" /></span><span className="text-xs font-semibold text-zinc-300">0{index + 1}</span></div>
                <h3 className="mt-5 font-semibold text-zinc-950">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{String(description)}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-9 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-zinc-950">Perguntas frequentes</h2>
          <div className="mt-6 divide-y divide-zinc-100">
            {faqs.map(([question, answer]) => (
              <div key={question} className="py-5 first:pt-0 last:pb-0">
                <h3 className="text-sm font-semibold text-zinc-950">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600"><MessageSquareText className="h-5 w-5" /></span>
            <h2 className="mt-5 text-xl font-semibold text-zinc-950">Encontrou um problema?</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">Durante a construção, envie o print e descreva o clique que causou o erro. O painel de chamados será integrado antes do lançamento.</p>
          </div>
          <div className="rounded-[30px] border border-violet-200 bg-violet-50 p-6 sm:p-8">
            <MapPin className="h-5 w-5 text-violet-600" />
            <h2 className="mt-4 text-xl font-semibold text-zinc-950">Teste o fluxo principal</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Faça uma busca em outra região e confirme se missão, empresas e relatório permanecem conectados.</p>
            <Link href="/prospecting" className="mt-5 inline-flex items-center text-sm font-semibold text-violet-700">Nova prospecção <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
          <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-4 text-xs leading-5 text-zinc-500"><Mail className="mr-2 inline h-4 w-4" />E-mail e WhatsApp de suporte serão publicados somente quando os canais oficiais estiverem ativos.</div>
        </div>
      </section>
    </div>
  )
}
