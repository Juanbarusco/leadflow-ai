import { createOptionalClient } from "@/lib/supabase/server"

export async function getWorkspaceContext() {
  const supabase = await createOptionalClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_organization_id")
    .eq("user_id", user.id)
    .maybeSingle()

  let organizationId = profile?.active_organization_id as string | null | undefined

  if (!organizationId) {
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    organizationId = membership?.organization_id as string | null | undefined
  }

  if (!organizationId) return null
  return { supabase, user, organizationId }
}
