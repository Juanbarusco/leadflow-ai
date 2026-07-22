"use client"

import { useState } from "react"
import {
  Bell,
  Bot,
  Command,
  Mic,
  Rocket,
  Sparkles,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Topbar() {
  const [command, setCommand] = useState("")

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-3 px-4 lg:px-8">
        <SidebarTrigger className="shrink-0 md:hidden" />

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/10">
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Comando rápido
            </p>

            <p className="text-sm font-semibold text-zinc-950">
              O que você quer vender hoje?
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-4xl items-center gap-2">
          <div className="relative flex min-w-0 flex-1 items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-1.5 shadow-sm transition focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-500 shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>

            <Input
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="Ex.: encontre clínicas em Campinas com Instagram ativo e sem landing page..."
              className="h-11 min-w-0 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
            />

            <div className="hidden shrink-0 items-center gap-1 rounded-lg border bg-white px-2 py-1 text-[11px] text-muted-foreground md:flex">
              <Command className="h-3 w-3" />
              K
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="ml-1 shrink-0 rounded-xl text-zinc-500 hover:bg-white hover:text-zinc-950"
              aria-label="Comando por voz"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="h-13 shrink-0 rounded-2xl bg-zinc-950 px-5 text-white shadow-lg shadow-zinc-950/10 hover:bg-zinc-800"
            disabled={!command.trim()}
          >
            <Rocket className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Iniciar missão</span>
            <span className="sm:hidden">Iniciar</span>
          </Button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-xl border-zinc-200 bg-white"
          >
            <Bell className="h-4 w-4" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-emerald-500" />
          </Button>

          <div className="hidden items-center gap-3 rounded-2xl border border-zinc-200 bg-white py-1.5 pl-2 pr-3 shadow-sm sm:flex">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-zinc-950 text-xs text-white">
                JB
              </AvatarFallback>
            </Avatar>

            <div className="leading-tight">
              <p className="text-xs font-semibold">Juan</p>
              <p className="text-[10px] text-muted-foreground">
                Founder
              </p>
            </div>
          </div>

          <Avatar className="h-9 w-9 sm:hidden">
            <AvatarFallback className="bg-zinc-950 text-xs text-white">
              JB
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}