export default function Home() {
  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(39,222,193,0.10),transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 font-black text-black">
              LF
            </div>

            <div>
              <p className="text-lg font-semibold">
                LeadFlow <span className="text-emerald-400">AI</span>
              </p>
              <p className="text-xs text-zinc-500">
                AI Sales Operating System
              </p>
            </div>
          </div>

          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur hover:bg-white/10">
            Entrar
          </button>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300">
            Seu funcionário comercial com inteligência artificial
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
            A IA trabalha.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Você apenas fecha.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Encontre empresas, analise oportunidades, gere abordagens,
            organize leads e transforme prospecção em vendas.
          </p>

          <div className="mt-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-violet-950/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
              <input
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                placeholder="Ex.: encontre 20 clínicas em São Carlos sem site..."
              />

              <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200">
                Executar
              </button>
            </div>
          </div>

          <div className="mt-8 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-3">
            {[
              "Encontrar empresas",
              "Analisar oportunidades",
              "Gerar abordagem",
            ].map((item, index) => (
              <button
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 transition hover:border-violet-400/40 hover:bg-white/[0.06]"
              >
                <span className="mb-3 block text-xs text-zinc-600">
                  0{index + 1}
                </span>
                {item}
              </button>
            ))}
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-white/5 pt-6 text-xs text-zinc-600">
          <span>LeadFlow AI</span>
          <span>Construído para vender serviços</span>
        </footer>
      </div>
    </main>
  );
}