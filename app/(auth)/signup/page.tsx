import Link from "next/link"
import { ArrowRight, Building2, LockKeyhole, Mail, UserRound } from "lucide-react"

import { signupAction } from "@/app/(auth)/actions"
import { AuthNotice, AuthShell } from "@/components/auth/auth-shell"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <AuthShell
      eyebrow="Criar workspace"
      title="Comece sua operação"
      description="Crie sua conta e o primeiro workspace comercial da equipe."
    >
      <AuthNotice message={params.error} />
      <form action={signupAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-zinc-700">Seu nome</span>
            <span className="relative mt-2 block">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input required name="fullName" autoComplete="name" placeholder="Nome completo" className="h-12 w-full rounded-2xl border border-zinc-200 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </span>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-zinc-700">Empresa</span>
            <span className="relative mt-2 block">
              <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input required name="organizationName" autoComplete="organization" placeholder="Nome da empresa" className="h-12 w-full rounded-2xl border border-zinc-200 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
            </span>
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-zinc-700">E-mail profissional</span>
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input required type="email" name="email" autoComplete="email" placeholder="voce@empresa.com" className="h-12 w-full rounded-2xl border border-zinc-200 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </span>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-zinc-700">Senha</span>
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input required minLength={8} type="password" name="password" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" className="h-12 w-full rounded-2xl border border-zinc-200 pl-11 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
          </span>
        </label>

        <button type="submit" className="flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
          Criar conta
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Já possui conta?{" "}
        <Link href="/login" className="font-semibold text-zinc-950 hover:text-violet-700">Entrar</Link>
      </p>
    </AuthShell>
  )
}
