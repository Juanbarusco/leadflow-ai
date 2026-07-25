"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LogOut,
  Plus,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { CurrentAccount } from "@/lib/auth/session"
import { cn } from "@/lib/utils"

function getPageContext(pathname: string) {
  if (pathname.startsWith("/mission")) return { eyebrow: "Operação", title: "Missão em andamento" }
  if (pathname.startsWith("/prospecting")) return { eyebrow: "Copiloto comercial", title: "Nova prospecção" }
  if (pathname.startsWith("/companies")) return { eyebrow: "Workspace", title: "Empresas" }
  if (pathname.startsWith("/crm")) return { eyebrow: "Relacionamento", title: "CRM com IA" }
  if (pathname.startsWith("/company/")) return { eyebrow: "Inteligência", title: "Relatório da empresa" }
  if (pathname.startsWith("/settings")) return { eyebrow: "Conta", title: "Configurações" }
  if (pathname.startsWith("/billing")) return { eyebrow: "Financeiro", title: "Plano e créditos" }
  if (pathname.startsWith("/help")) return { eyebrow: "Suporte", title: "Central de ajuda" }
  return { eyebrow: "Visão do dia", title: "Hoje" }
}

export function Topbar({ account }: { account: CurrentAccount }) {
  const pathname = usePathname()
  const context = getPageContext(pathname)
  const isProspecting = pathname.startsWith("/prospecting")

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/88 backdrop-blur-xl">
      <div className="flex min-h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="shrink-0 md:hidden" />

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {context.eyebrow}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-zinc-950 sm:text-base">
            {context.title}
          </p>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {!isProspecting ? (
            <Link
              href="/prospecting"
              className={cn(
                buttonVariants(),
                "h-10 rounded-xl bg-zinc-950 px-3.5 text-white shadow-lg shadow-zinc-950/10 hover:bg-zinc-800 sm:h-11 sm:px-5",
              )}
            >
              <Sparkles className="mr-2 h-4 w-4 text-violet-300" />
              <span className="hidden sm:inline">Nova prospecção</span>
              <span className="sm:hidden">Nova</span>
              <Plus className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Abrir menu do perfil"
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-1.5 text-left shadow-sm outline-none transition hover:border-zinc-300 focus-visible:ring-4 focus-visible:ring-violet-100 sm:pr-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-zinc-950 text-[11px] font-semibold text-white">
                  {account.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 leading-tight sm:block">
                <p className="max-w-32 truncate text-xs font-semibold text-zinc-950">{account.user.fullName}</p>
                <p className="max-w-32 truncate text-[10px] text-zinc-400">
                  {account.isDemo ? "Modo demonstração" : account.workspace.name}
                </p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-zinc-400 sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl p-2 shadow-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-3 py-2">
                  <span className="block truncate text-xs font-semibold text-zinc-950">{account.user.fullName}</span>
                  <span className="mt-0.5 block truncate text-[11px] font-normal text-zinc-400">{account.user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuItem render={<Link href="/settings" />} className="rounded-xl px-3 py-2.5">
                  <UserRound className="mr-2" /> Minha conta
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings#company" />} className="rounded-xl px-3 py-2.5">
                  <Building2 className="mr-2" /> Minha empresa
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/billing" />} className="rounded-xl px-3 py-2.5">
                  <CreditCard className="mr-2" /> Plano e créditos
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/help" />} className="rounded-xl px-3 py-2.5">
                  <CircleHelp className="mr-2" /> Central de ajuda
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href="/settings" />} className="rounded-xl px-3 py-2.5">
                  <Settings2 className="mr-2" /> Configurações
                </DropdownMenuItem>
                <form action="/auth/signout" method="post">
                  <DropdownMenuItem
                    render={<button type="submit" className="w-full" />}
                    variant="destructive"
                    className="w-full rounded-xl px-3 py-2.5 text-left"
                  >
                    <LogOut className="mr-2" /> Sair
                  </DropdownMenuItem>
                </form>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
