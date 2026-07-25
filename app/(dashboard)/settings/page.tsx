import { redirect } from "next/navigation"

import { AccountSettings } from "@/components/settings/account-settings"
import { getCurrentAccount } from "@/lib/auth/session"

export default async function SettingsPage() {
  const account = await getCurrentAccount()
  if (!account) redirect("/login")

  return (
    <div className="mx-auto max-w-5xl pb-20 pt-3 sm:pt-7">
      <header className="mb-9 border-b border-zinc-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Conta e workspace</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-zinc-950 sm:text-5xl">Configurações</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">Mantenha seu perfil, empresa e preferências de prospecção organizados em um só lugar.</p>
      </header>
      <AccountSettings account={account} />
    </div>
  )
}
