"use client"

import { useState } from "react"
import { Building2, CheckCircle2, LoaderCircle, MapPin, Save, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import type { CurrentAccount } from "@/lib/auth/session"

export function AccountSettings({ account }: { account: CurrentAccount }) {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: account.user.fullName,
    jobTitle: account.user.jobTitle,
    phone: account.user.phone || "",
    organizationName: account.workspace.name,
    defaultSegment: account.preferences.defaultSegment,
    defaultLocation: account.preferences.defaultLocation,
  })
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [message, setMessage] = useState("")

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setStatus("idle")
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("saving")
    setMessage("")

    try {
      const response = await fetch("/api/account/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(payload.error || "Não foi possível salvar.")

      setStatus("saved")
      setMessage(account.isDemo ? "Preferências salvas neste navegador em modo demonstração." : "Configurações atualizadas.")
      router.refresh()
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar.")
    }
  }

  const inputClass = "mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"

  return (
    <form onSubmit={submit} className="space-y-7">
      {account.isDemo ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700">
          Modo demonstração ativo. Ao conectar o Supabase, estes campos passam a ser salvos no perfil real e protegidos por workspace.
        </div>
      ) : null}

      <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><UserRound className="h-5 w-5" /></span>
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">Perfil</h2>
            <p className="mt-1 text-sm text-zinc-500">Informações exibidas no workspace e usadas nas comunicações.</p>
          </div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-semibold text-zinc-700">Nome completo<input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} required /></label>
          <label className="text-xs font-semibold text-zinc-700">Cargo<input value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} className={inputClass} placeholder="Founder, SDR, Comercial..." /></label>
          <label className="text-xs font-semibold text-zinc-700">E-mail<input value={account.user.email} disabled className={`${inputClass} bg-zinc-50 text-zinc-400`} /></label>
          <label className="text-xs font-semibold text-zinc-700">Telefone<input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="(16) 99999-9999" /></label>
        </div>
      </section>

      <section id="company" className="scroll-mt-28 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600"><Building2 className="h-5 w-5" /></span>
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">Empresa e workspace</h2>
            <p className="mt-1 text-sm text-zinc-500">Dados compartilhados com os membros da operação.</p>
          </div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-semibold text-zinc-700 sm:col-span-2">Nome da empresa<input value={form.organizationName} onChange={(e) => update("organizationName", e.target.value)} className={inputClass} required /></label>
          <label className="text-xs font-semibold text-zinc-700">Segmento padrão<input value={form.defaultSegment} onChange={(e) => update("defaultSegment", e.target.value)} className={inputClass} placeholder="Clínicas odontológicas" /></label>
          <label className="text-xs font-semibold text-zinc-700">Região padrão<input value={form.defaultLocation} onChange={(e) => update("defaultLocation", e.target.value)} className={inputClass} placeholder="São Carlos, SP" /></label>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500"><MapPin className="h-4 w-4 text-zinc-400" />Esses padrões serão usados para acelerar novas prospecções.</div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>
          {message ? <span className="inline-flex items-center gap-2">{status === "saved" ? <CheckCircle2 className="h-4 w-4" /> : null}{message}</span> : "As alterações só entram em vigor após salvar."}
        </div>
        <Button type="submit" disabled={status === "saving"} className="h-11 rounded-xl px-5">
          {status === "saving" ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar configurações
        </Button>
      </div>
    </form>
  )
}
