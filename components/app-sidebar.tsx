"use client"

import {
  BarChart3,
  Bot,
  Building2,
  ChevronRight,
  CircleDollarSign,
  Command,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Search,
  Settings2,
  Sparkles,
  Target,
  Users,
  Workflow,
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

const mainItems = [
  {
    title: "Central",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Radar",
    icon: Target,
  },
  {
    title: "Empresas",
    icon: Building2,
  },
  {
    title: "Prospecções",
    icon: Search,
  },
  {
    title: "Agentes IA",
    icon: Bot,
    badge: "6",
  },
]

const workspaceItems = [
  {
    title: "Pipeline",
    icon: Workflow,
  },
  {
    title: "Campanhas",
    icon: Megaphone,
  },
  {
    title: "Insights",
    icon: BarChart3,
  },
  {
    title: "Financeiro",
    icon: CircleDollarSign,
  },
  {
    title: "Equipe",
    icon: Users,
  },
]

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-200/80 bg-white"
    >
      <SidebarHeader className="border-b border-zinc-200/80 px-3 py-4">
        <div className="flex items-center gap-3 px-1">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/15">
            <Command className="h-5 w-5" />

            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold tracking-tight">
                LeadFlow AI
              </p>

              <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-600">
                Beta
              </span>
            </div>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Commercial Intelligence OS
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Operação
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={item.active}
                      tooltip={item.title}
                      className="h-10 rounded-xl px-3 text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-950 data-[active=true]:bg-zinc-950 data-[active=true]:text-white data-[active=true]:shadow-md"
                    >
                      <Icon className="h-4 w-4" />

                      <span className="font-medium">{item.title}</span>

                      {item.badge && (
                        <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </span>
                      )}

                      {!item.badge && item.active && (
                        <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60 group-data-[collapsible=icon]:hidden" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {workspaceItems.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="h-10 rounded-xl px-3 text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-950"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200/80 p-3">
        <div className="mb-2 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="rounded-full bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-indigo-600 shadow-sm">
              Founder
            </span>
          </div>

          <p className="mt-3 text-sm font-semibold">1.240 créditos de IA</p>

          <p className="mt-1 text-xs text-muted-foreground">
            72% disponíveis neste ciclo
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-indigo-100">
            <div className="h-full w-[72%] rounded-full bg-indigo-600" />
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Configurações"
              className="h-10 rounded-xl px-3 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            >
              <Settings2 className="h-4 w-4" />
              <span className="font-medium">Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Plano e cobrança"
              className="h-10 rounded-xl px-3 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            >
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Plano e cobrança</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}