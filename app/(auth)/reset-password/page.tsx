import { ArrowRight, LockKeyhole } from "lucide-react"

import { resetPasswordAction } from "@/app/(auth)/actions"
import { AuthNotice, AuthShell } from "@/components/auth/auth-shell"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <AuthShell eyebrow="Nova senha" title="Proteja sua conta" description="Crie uma nova senha com pelo menos oito caracteres.">
      <AuthNotice message={params.error} />
      <form action={resetPasswordAction} className="space-y-4">
        {[
          ["password", "Nova senha"],
          ["confirmation", "Confirmar senha"],
        ].map(([name, label]) => (
          <label key={name} className="block">
            <span className="text-xs font-semibold text-zinc-700">{label}</span>
            <span className="relative mt-2 block">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input required minLength={8} type="password" name={name} autoComplete="new-password" className="h-12 w-full rounded-2xl border border-zinc-200 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </span>
          </label>
        ))}
        <button type="submit" className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
          Salvar nova senha <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  )
}
