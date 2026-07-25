import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

import { forgotPasswordAction } from "@/app/(auth)/actions"
import { AuthNotice, AuthShell } from "@/components/auth/auth-shell"

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams

  return (
    <AuthShell eyebrow="Recuperar acesso" title="Redefina sua senha" description="Informe seu e-mail e enviaremos um link seguro para criar uma nova senha.">
      <AuthNotice message={params.error} />
      <AuthNotice message={params.message} tone="success" />
      <form action={forgotPasswordAction} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-zinc-700">E-mail</span>
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input required type="email" name="email" autoComplete="email" placeholder="voce@empresa.com" className="h-12 w-full rounded-2xl border border-zinc-200 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </span>
        </label>
        <button type="submit" className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
          Enviar instruções <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500"><Link href="/login" className="font-semibold text-zinc-950 hover:text-violet-700">Voltar para o login</Link></p>
    </AuthShell>
  )
}
