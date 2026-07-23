import { Camera, Globe2, Map, Search, Sparkles } from "lucide-react";

export const missionPrompt = "Encontrar clínicas odontológicas em São Carlos";

export const stageDefinitions = [
  { label: "Google Agent", short: "Google", description: "Buscando empresas no Google Maps", icon: Map },
  { label: "Website Agent", short: "Website", description: "Analisando sites e conversão", icon: Globe2 },
  { label: "Instagram Agent", short: "Instagram", description: "Verificando presença social", icon: Camera },
  { label: "SEO Agent", short: "SEO", description: "Mapeando oportunidades orgânicas", icon: Search },
  { label: "IA Comercial", short: "Comercial", description: "Priorizando leads e abordagem", icon: Sparkles },
] as const;

export const activityMessages = [
  { stage: 0, text: "Conectando ao Google Maps de São Carlos..." },
  { stage: 0, text: "Cruzando segmento, reputação e localização." },
  { stage: 0, text: "Empresas compatíveis encontradas." },
  { stage: 1, text: "Sites enviados para análise técnica." },
  { stage: 1, text: "Velocidade, landing page e WhatsApp verificados." },
  { stage: 2, text: "Perfis do Instagram localizados." },
  { stage: 2, text: "Atividade e engajamento social analisados." },
  { stage: 3, text: "Sinais de SEO e presença orgânica consolidados." },
  { stage: 4, text: "Calculando score e chance de fechamento." },
  { stage: 4, text: "Preparando abordagem comercial personalizada." },
  { stage: 4, text: "Ranking de oportunidades atualizado." },
] as const;

export const radarPoints = [
  { left: "21%", top: "31%", delay: "0ms" },
  { left: "67%", top: "24%", delay: "180ms" },
  { left: "43%", top: "61%", delay: "360ms" },
  { left: "77%", top: "69%", delay: "540ms" },
  { left: "29%", top: "76%", delay: "720ms" },
  { left: "55%", top: "43%", delay: "900ms" },
] as const;
