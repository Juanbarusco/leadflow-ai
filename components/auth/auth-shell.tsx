import Link from "next/link"
import { ArrowLeft, Command, ShieldCheck, Sparkles } from "lucide-react"
import type { ReactNode } from "react"

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="relative isolate min-h-svh overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_0%,rgba(124,58,237,.35),transparent_30%),radial-gradient(circle_at_90%_90%,rgba(14,165,233,.16),transparent_30%)]" />
      <div className="relative mx-auto flex min-h-[calc(100svh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-zinc-950">
              <Command className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">LeadFlow AI</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Copiloto comercial</p>
            </div>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_480px]">
          <section className="hidden max-w-xl lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Inteligência comercial em um único workspace
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.055em] text-white">
              Entre, encontre oportunidades e continue exatamente de onde parou.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Sua conta mantém missões, empresas e preferências protegidas dentro do workspace da sua operação.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-zinc-300">
              {[
                "Sessão protegida e persistente",
                "Dados separados por empresa",
                "Estrutura pronta para equipe e CRM",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-white p-6 shadow-2xl shadow-black/35 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>
            <div className="mt-7">{children}</div>
          </section>
        </div>
      </div>
    </div>
  )
}

export function AuthNotice({ message, tone = "error" }: { message?: string; tone?: "error" | "success" | "info" }) {
  if (!message) return null

  const styles = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-violet-200 bg-violet-50 text-violet-700",
  }

  return <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${styles[tone]}`}>{message}</div>
}
