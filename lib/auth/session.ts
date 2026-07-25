import { cookies } from "next/headers"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createOptionalClient } from "@/lib/supabase/server"

export type AccountUser = {
  id: string
  email: string
  fullName: string
  jobTitle: string
  phone?: string
  avatarUrl?: string
  initials: string
}

export type AccountWorkspace = {
  id: string
  name: string
  slug: string
  role: "owner" | "admin" | "member"
}

export type CurrentAccount = {
  user: AccountUser
  workspace: AccountWorkspace
  preferences: {
    defaultSegment: string
    defaultLocation: string
  }
  isDemo: boolean
}

type DemoCookie = {
  fullName?: string
  jobTitle?: string
  phone?: string
  organizationName?: string
  defaultSegment?: string
  defaultLocation?: string
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "LF"
}

async function getDemoAccount(): Promise<CurrentAccount> {
  const cookieStore = await cookies()
  const raw = cookieStore.get("leadflow_demo_profile")?.value
  let saved: DemoCookie = {}

  if (raw) {
    try {
      saved = JSON.parse(decodeURIComponent(raw)) as DemoCookie
    } catch {
      saved = {}
    }
  }

  const fullName = saved.fullName?.trim() || "Juan Barusco"
  const organizationName = saved.organizationName?.trim() || "LeadFlow AI"

  return {
    isDemo: true,
    user: {
      id: "demo-user",
      email: "demo@leadflow.ai",
      fullName,
      jobTitle: saved.jobTitle?.trim() || "Founder",
      phone: saved.phone,
      initials: initialsFromName(fullName),
    },
    preferences: {
      defaultSegment: saved.defaultSegment?.trim() || "Clínicas odontológicas",
      defaultLocation: saved.defaultLocation?.trim() || "São Carlos, SP",
    },
    workspace: {
      id: "demo-workspace",
      name: organizationName,
      slug: "leadflow-demo",
      role: "owner",
    },
  }
}

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  if (!isSupabaseConfigured()) return getDemoAccount()

  const supabase = await createOptionalClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id, full_name, job_title, phone, avatar_url, active_organization_id, default_segment, default_location")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("organization_members")
      .select("role, organization:organizations(id, name, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const fullName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null) ||
    user.email?.split("@")[0] ||
    "Usuário"

  const organization = Array.isArray(membership?.organization)
    ? membership?.organization[0]
    : membership?.organization

  return {
    isDemo: false,
    user: {
      id: user.id,
      email: user.email || "",
      fullName,
      jobTitle: profile?.job_title || "Membro",
      phone: profile?.phone || undefined,
      avatarUrl: profile?.avatar_url || undefined,
      initials: initialsFromName(fullName),
    },
    preferences: {
      defaultSegment: profile?.default_segment || "",
      defaultLocation:
        typeof profile?.default_location === "object" && profile?.default_location
          ? String((profile.default_location as { label?: string }).label || "")
          : "",
    },
    workspace: {
      id: organization?.id || profile?.active_organization_id || "",
      name: organization?.name || "Meu workspace",
      slug: organization?.slug || "workspace",
      role: (membership?.role as AccountWorkspace["role"] | undefined) || "member",
    },
  }
}
