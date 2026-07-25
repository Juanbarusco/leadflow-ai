"use server"

import { redirect } from "next/navigation"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

function withMessage(path: string, key: "error" | "message", message: string) {
  const params = new URLSearchParams({ [key]: message })
  return `${path}?${params.toString()}`
}

function safeNext(raw: string) {
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard"
}

export async function loginAction(formData: FormData) {
  const email = value(formData, "email")
  const password = value(formData, "password")
  const next = safeNext(value(formData, "next"))

  if (!email || !password) {
    redirect(withMessage("/login", "error", "Preencha e-mail e senha."))
  }

  if (!isSupabaseConfigured()) {
    redirect(`${next}${next.includes("?") ? "&" : "?"}demo=1`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(withMessage("/login", "error", "E-mail ou senha inválidos."))
  }

  redirect(next)
}

export async function signupAction(formData: FormData) {
  const fullName = value(formData, "fullName")
  const organizationName = value(formData, "organizationName")
  const email = value(formData, "email")
  const password = value(formData, "password")

  if (fullName.length < 3 || organizationName.length < 2 || !email || password.length < 8) {
    redirect(withMessage("/signup", "error", "Revise os dados. A senha precisa ter pelo menos 8 caracteres."))
  }

  if (!isSupabaseConfigured()) {
    redirect("/dashboard?demo=1")
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
      data: { full_name: fullName, organization_name: organizationName },
    },
  })

  if (error) {
    redirect(withMessage("/signup", "error", error.message))
  }

  if (data.session) redirect("/dashboard")

  redirect(withMessage("/login", "message", "Conta criada. Confirme o e-mail para entrar."))
}

export async function forgotPasswordAction(formData: FormData) {
  const email = value(formData, "email")
  if (!email) redirect(withMessage("/forgot-password", "error", "Informe seu e-mail."))

  if (!isSupabaseConfigured()) {
    redirect(withMessage("/forgot-password", "message", "Modo demonstração: nenhuma recuperação é necessária."))
  }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  })

  if (error) redirect(withMessage("/forgot-password", "error", error.message))
  redirect(withMessage("/forgot-password", "message", "Enviamos as instruções de recuperação para seu e-mail."))
}

export async function resetPasswordAction(formData: FormData) {
  const password = value(formData, "password")
  const confirmation = value(formData, "confirmation")

  if (password.length < 8 || password !== confirmation) {
    redirect(withMessage("/reset-password", "error", "As senhas precisam ser iguais e ter pelo menos 8 caracteres."))
  }

  if (!isSupabaseConfigured()) redirect("/dashboard?demo=1")

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) redirect(withMessage("/reset-password", "error", error.message))

  redirect(withMessage("/login", "message", "Senha atualizada. Entre novamente."))
}
