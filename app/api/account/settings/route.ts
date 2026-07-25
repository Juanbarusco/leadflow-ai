import { NextResponse } from "next/server"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createOptionalClient } from "@/lib/supabase/server"

type SettingsPayload = {
  fullName?: string
  jobTitle?: string
  phone?: string
  organizationName?: string
  defaultSegment?: string
  defaultLocation?: string
}

function clean(value: unknown, max = 120) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export async function PATCH(request: Request) {
  const input = (await request.json()) as SettingsPayload
  const payload = {
    fullName: clean(input.fullName),
    jobTitle: clean(input.jobTitle, 80),
    phone: clean(input.phone, 32),
    organizationName: clean(input.organizationName),
    defaultSegment: clean(input.defaultSegment),
    defaultLocation: clean(input.defaultLocation),
  }

  if (payload.fullName.length < 3 || payload.organizationName.length < 2) {
    return NextResponse.json({ error: "Nome e empresa precisam ser preenchidos." }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    const response = NextResponse.json({ saved: true, mode: "demo" })
    response.cookies.set("leadflow_demo_profile", encodeURIComponent(JSON.stringify(payload)), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })
    return response
  }

  const supabase = await createOptionalClient()
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) || { data: { user: null } }

  if (!supabase || !user) {
    return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 })
  }

  const { data: profile, error: profileReadError } = await supabase
    .from("profiles")
    .select("active_organization_id")
    .eq("user_id", user.id)
    .single()

  if (profileReadError) {
    return NextResponse.json({ error: "Não foi possível localizar seu perfil." }, { status: 500 })
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: payload.fullName,
      job_title: payload.jobTitle || "Membro",
      phone: payload.phone || null,
      default_segment: payload.defaultSegment || null,
      default_location: payload.defaultLocation ? { label: payload.defaultLocation } : {},
    })
    .eq("user_id", user.id)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  if (profile.active_organization_id && payload.organizationName) {
    const { error: organizationError } = await supabase
      .from("organizations")
      .update({ name: payload.organizationName })
      .eq("id", profile.active_organization_id)

    if (organizationError) {
      return NextResponse.json({ error: organizationError.message }, { status: 403 })
    }
  }

  await supabase.auth.updateUser({ data: { full_name: payload.fullName } })
  return NextResponse.json({ saved: true, mode: "live" })
}
