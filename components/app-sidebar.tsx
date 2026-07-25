"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bot,
  Building2,
  ChevronRight,
  CircleHelp,
  Command,
  CreditCard,
  LayoutDashboard,
  Search,
  Settings2,
  Sparkles,
  Target,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { CurrentAccount } from "@/lib/auth/session"

const mainItems = [
  { title: "Hoje", href: "/dashboard", icon: LayoutDashboard },
  { title: "Nova prospecção", href: "/prospecting", icon: Sparkles, emphasized: true },
  { title: "Missão atual", href: "/mission", icon: Target, status: true },
  { title: "Empresas", href: "/companies", icon: Building2 },
  { title: "CRM com IA", href: "/crm", icon: Bot },
]

function isItemActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  if (href === "/companies") return pathname.startsWith("/companies") || pathname.startsWith("/company/")
  return pathname.startsWith(href)
}

export function AppSidebar({ account }: { account: CurrentAccount }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200/80 bg-white">
      <SidebarHeader className="border-b border-zinc-200/80 px-3 py-4">
        <Link href="/dashboard" className="flex items-center gap-3 px-1">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/15">
            <Command className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold tracking-tight text-zinc-950">LeadFlow AI</p>
              <span className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-600">Beta</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-zinc-400">{account.workspace.name}</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-zinc-400">Operação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {mainItems.map((item) => {
                const Icon = item.icon
                const active = isItemActive(pathname, item.href)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.title}
                      className={item.emphasized && !active
                        ? "h-11 rounded-xl bg-violet-50 px-3 text-violet-700 hover:bg-violet-100 hover:text-violet-800"
                        : "h-11 rounded-xl px-3 text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-950 data-active:bg-zinc-950 data-active:text-white data-active:shadow-md"}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                      {item.status && active ? (
                        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 group-data-[collapsible=icon]:hidden">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Ao vivo
                        </span>
                      ) : active ? (
                        <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60 group-data-[collapsible=icon]:hidden" />
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200/80 p-3">
        <Link href="/billing" className="mb-3 block rounded-2xl border border-zinc-200 bg-zinc-50 p-3 transition hover:border-zinc-300 hover:bg-white group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm"><Search className="h-4 w-4" /></span>
              <div>
                <p className="text-xs font-semibold text-zinc-950">1.240 créditos {account.isDemo ? "demo" : ""}</p>
                <p className="text-[10px] text-zinc-400">Ver uso e regras</p>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200"><div className="h-full w-[72%] rounded-full bg-zinc-950" /></div>
        </Link>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/settings" />} isActive={pathname.startsWith("/settings")} tooltip="Configurações" className="h-10 rounded-xl px-3 text-zinc-500 data-active:bg-zinc-950 data-active:text-white">
              <Settings2 className="h-4 w-4" /><span className="font-medium">Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/billing" />} isActive={pathname.startsWith("/billing")} tooltip="Plano e cobrança" className="h-10 rounded-xl px-3 text-zinc-500 data-active:bg-zinc-950 data-active:text-white">
              <CreditCard className="h-4 w-4" /><span className="font-medium">Plano e cobrança</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/help" />} isActive={pathname.startsWith("/help")} tooltip="Central de ajuda" className="h-10 rounded-xl px-3 text-zinc-500 data-active:bg-zinc-950 data-active:text-white">
              <CircleHelp className="h-4 w-4" /><span className="font-medium">Ajuda</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
