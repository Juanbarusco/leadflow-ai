import type { ReactNode } from "react"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentAccount } from "@/lib/auth/session"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const account = await getCurrentAccount()
  if (!account) redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebar account={account} />
      <SidebarInset className="bg-[#fbfbfc]">
        <Topbar account={account} />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1780px]">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
