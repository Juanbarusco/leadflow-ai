import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Topbar />

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1780px]">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}