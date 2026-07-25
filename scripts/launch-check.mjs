const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const checks = [
  ["GOOGLE_PLACES_API_KEY", process.env.GOOGLE_PLACES_API_KEY],
  ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
  ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ou ANON_KEY)", supabaseKey],
  ["NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL],
]

let failed = false

console.log("\nLeadFlow AI · verificação de lançamento\n")

for (const [name, value] of checks) {
  const configured = Boolean(value?.trim())
  console.log(`${configured ? "✓" : "✗"} ${name}`)
  if (!configured) failed = true
}

const mode = process.env.LEADFLOW_DATA_MODE || "auto"
console.log(`\nFonte configurada: ${mode}`)
console.log(`Resultados por missão: ${process.env.GOOGLE_PLACES_MAX_RESULTS || "8"}`)
console.log(`Empresas enriquecidas: ${process.env.GOOGLE_PLACES_ENRICH_LIMIT || "8"}`)

if (failed) {
  console.error("\nLançamento bloqueado: configure Google Places, Supabase e a URL pública do produto.")
  process.exit(1)
}

console.log("\nBase de autenticação, persistência e dados reais pronta para homologação.")
