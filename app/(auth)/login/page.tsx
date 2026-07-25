import Link from "next/link"
import { ArrowRight, LockKeyhole, Mail } from "lucide-react"

import { loginAction } from "@/app/(auth)/actions"
import { AuthNotice, AuthShell } from "@/components/auth/auth-shell"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>
}) {
  const params = await searchParams

  return (
    <AuthShell
      eyebrow="Acesso seguro"
      title="Bem-vindo de volta"
      description="Entre para continuar suas missões, empresas e configurações."
    >
      <AuthNotice message={params.error} />
      <AuthNotice message={params.message} tone="success" />

      <form action={loginAction} className="space-y-4">
        <input type="hidden" name="next" value={params.next || "/dashboard"} />
        <label className="block">
          <span className="text-xs font-semibold text-zinc-700">E-mail</span>
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="voce@empresa.com"
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </span>
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3 text-xs font-semibold text-zinc-700">
            Senha
            <Link href="/forgot-password" className="font-medium text-violet-600 hover:text-violet-700">Esqueci minha senha</Link>
          </span>
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </span>
        </label>

        <button type="submit" className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
          Entrar no LeadFlow
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </form>

      <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs leading-5 text-violet-700">
        Sem Supabase configurado, este formulário abre automaticamente o modo demonstração para você validar toda a interface.
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="font-semibold text-zinc-950 hover:text-violet-700">Criar conta</Link>
      </p>
    </AuthShell>
  )
}
