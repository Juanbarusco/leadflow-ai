"use client";

import {
  ArrowLeft,
  Bot,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  ExternalLink,
  Gauge,
  Globe2,
  Lightbulb,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MissionCompany } from "@/lib/engines/mission-engine";
import { Badge } from "@/components/ui/badge";
import { CompanyRelationship } from "@/components/crm/company-relationship";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { InteractionChannel } from "@/lib/crm/types";

interface Props {
  company: MissionCompany;
}

type Area = {
  id: string;
  label: string;
  icon: typeof Globe2;
  score: number;
  status: string;
  summary: string;
  problems: string[];
  opportunities: string[];
  accent: string;
  soft: string;
  bar: string;
};

const sections = [
  ["contact", "Contato"],
  ["summary", "Resumo"],
  ["diagnosis", "Diagnóstico"],
  ["opportunities", "Oportunidades"],
  ["plan", "Plano"],
  ["outreach", "Abordagem"],
] as const;

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const priorityLabel = (value: MissionCompany["leadScore"]["priority"]) =>
  value === "high" ? "Alta" : value === "medium" ? "Média" : "Baixa";

const closingChance = (company: MissionCompany) =>
  Math.min(
    96,
    Math.max(
      35,
      Math.round((company.leadScore.score + company.leadScore.confidence) / 2),
    ),
  );

function buildAreas(company: MissionCompany): Area[] {
  const reputation = Math.min(
    100,
    Math.round(company.rating * 16 + Math.min(company.reviews, 300) / 8),
  );

  return [
    {
      id: "website",
      label: "Website",
      icon: Globe2,
      score: company.websiteAnalysis.score,
      status: company.websiteAnalysis.scoreLabel,
      summary: company.websiteAnalysis.commercialDiagnosis,
      problems: company.websiteAnalysis.commercialProblems,
      opportunities: company.websiteAnalysis.recommendedServices,
      accent: "text-sky-600",
      soft: "border-sky-500/20 bg-sky-500/[0.045]",
      bar: "bg-sky-500",
    },
    {
      id: "seo",
      label: "SEO local",
      icon: Search,
      score: company.seoAnalysis.score,
      status: company.seoAnalysis.scoreLabel,
      summary: `Posição local estimada: ${company.seoAnalysis.estimatedLocalPosition}ª. ${company.seoAnalysis.hasLocalPresence ? "Já existe presença local, mas ainda há espaço para dominar a região." : "A empresa ainda não ocupa uma posição forte nas buscas locais."}`,
      problems: company.seoAnalysis.problems,
      opportunities: company.seoAnalysis.opportunities,
      accent: "text-indigo-600",
      soft: "border-indigo-500/20 bg-indigo-500/[0.045]",
      bar: "bg-indigo-500",
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Camera,
      score: company.instagramAnalysis.score,
      status: company.instagramAnalysis.scoreLabel,
      summary: company.instagramAnalysis.commercialDiagnosis,
      problems: company.instagramAnalysis.commercialProblems,
      opportunities: company.instagramAnalysis.recommendedServices,
      accent: "text-fuchsia-600",
      soft: "border-fuchsia-500/20 bg-fuchsia-500/[0.045]",
      bar: "bg-fuchsia-500",
    },
    {
      id: "google",
      label: "Google",
      icon: Star,
      score: reputation,
      status: reputation >= 75 ? "Forte" : reputation >= 50 ? "Regular" : "Fraca",
      summary: `${company.rating.toFixed(1)} estrelas em ${company.reviews} avaliações públicas.`,
      problems:
        company.reviews < 50
          ? ["Baixo volume de avaliações para dominar a busca local"]
          : ["A reputação positiva ainda pode ser melhor usada na jornada de venda"],
      opportunities: [
        "Prova social no site e nas propostas",
        "Campanha contínua de avaliações",
        "Respostas estratégicas no Google",
      ],
      accent: "text-emerald-600",
      soft: "border-emerald-500/20 bg-emerald-500/[0.045]",
      bar: "bg-emerald-500",
    },
  ];
}

function ScoreRing({ value }: { value: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgb(63 63 70)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgb(139 92 246)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-semibold text-white">{value}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">de 100</p>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}

function AreaDiagnosticBlock({ area, index }: { area: Area; index: number }) {
  const Icon = area.icon;

  return (
    <article
      id={`diagnosis-${area.id}`}
      className="scroll-mt-44 overflow-hidden rounded-[32px] border bg-background shadow-sm"
    >
      <div className={`border-b p-6 sm:p-8 ${area.soft}`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border bg-background text-sm font-semibold shadow-sm">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl border bg-background shadow-sm">
                  <Icon className={`h-5 w-5 ${area.accent}`} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Canal analisado
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">{area.label}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-2xl border bg-background/85 p-4 sm:w-56">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Situação atual
                </p>
                <p className="mt-1 font-semibold">{area.status}</p>
              </div>
              <p className="text-3xl font-semibold tracking-tight">{area.score}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${area.bar}`} style={{ width: `${area.score}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-600">
            1. O que a missão encontrou
          </p>
          <p className="mt-3 text-base leading-8 text-muted-foreground">{area.summary}</p>
        </div>

        <div className="my-8 h-px bg-border" />

        <div className="max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <TriangleAlert className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                2. O que está prejudicando a empresa
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Problemas encontrados neste canal.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {area.problems.slice(0, 3).map((item, itemIndex) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-amber-500/15 bg-amber-500/[0.035] p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-500/10 text-xs font-semibold text-amber-700">
                  {itemIndex + 1}
                </span>
                <p className="pt-0.5 text-sm leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-8 h-px bg-border" />

        <div className="max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                3. O que você pode oferecer
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Ações comerciais indicadas pela análise.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {area.opportunities.slice(0, 3).map((item, itemIndex) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-700">
                  {itemIndex + 1}
                </span>
                <p className="pt-0.5 text-sm leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function CompanyIntelligenceReport({ company }: Props) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("summary");
  const [copied, setCopied] = useState<string | null>(null);
  const [approachOpen, setApproachOpen] = useState(false);
  const [approachChannel, setApproachChannel] = useState<InteractionChannel>("whatsapp");

  const reportAreas = useMemo(() => buildAreas(company), [company]);
  const topServices = useMemo(
    () =>
      Array.from(
        new Set([
          ...company.websiteAnalysis.recommendedServices,
          ...company.instagramAnalysis.recommendedServices,
          ...company.seoAnalysis.opportunities,
        ]),
      ).slice(0, 4),
    [company],
  );

  const closeChance = closingChance(company);
  const urgency = company.leadScore.score >= 80 ? "Crítica" : company.leadScore.score >= 65 ? "Alta" : "Moderada";
  const maxTicket = company.websiteAnalysis.estimatedSaleMax;
  const minTicket = company.websiteAnalysis.estimatedSaleMin;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("crm") === "1") setApproachOpen(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const openApproach = (channel: InteractionChannel = company.whatsappUrl || company.phone ? "whatsapp" : "email") => {
    setApproachChannel(channel);
    setApproachOpen(true);
  };

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt("Copie a mensagem:", text);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-[72px] z-40 -mx-4 border-y bg-background/95 backdrop-blur-xl sm:-mx-6 lg:-mx-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/mission")} className="shrink-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Missão
          </Button>
          <div className="mx-1 h-5 w-px shrink-0 bg-border" />
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`shrink-0 rounded-xl px-3 py-2 text-sm transition ${activeSection === id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-14 px-4 pt-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[34px] border border-zinc-800 bg-zinc-950 text-white shadow-2xl shadow-violet-500/10">
          <div className="relative p-7 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_88%_8%,rgba(139,92,246,.34),transparent_28%),radial-gradient(circle_at_8%_100%,rgba(14,165,233,.13),transparent_30%)]" />
            <div className="relative grid gap-10 xl:grid-cols-[1fr_420px] xl:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-violet-400/20 bg-violet-400/10 text-violet-200 hover:bg-violet-400/10">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Commercial Intelligence
                  </Badge>
                  <Badge className={company.source === "google_places" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10" : "border-amber-400/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10"}>
                    {company.source === "google_places" ? "Dados reais" : "Dados de demonstração"}
                  </Badge>
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{company.name}</h1>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{company.city}</span>
                  <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{company.rating > 0 ? `${company.rating.toFixed(1)} (${company.reviews})` : "Sem avaliações públicas"}</span>
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" />Confiança IA {company.leadScore.confidence}%</span>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  <Badge className="bg-red-500/15 text-red-200 hover:bg-red-500/15"><Zap className="mr-1.5 h-3.5 w-3.5" />Urgência {urgency}</Badge>
                  <Badge className="bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/15">Potencial {money(maxTicket)}</Badge>
                  <Badge className="bg-white/10 text-zinc-200 hover:bg-white/10">Prioridade {priorityLabel(company.leadScore.priority)}</Badge>
                </div>

                <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300">
                  {company.leadScore.reasons[0] ?? "Lead com sinais claros de oportunidade comercial e presença digital abaixo do potencial."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button onClick={() => openApproach()}>
                    <Target className="mr-2 h-4 w-4" />
                    Iniciar abordagem
                  </Button>
                  {company.website ? (
                    <Button
                      variant="outline"
                      className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                      onClick={() => window.open(company.website, "_blank", "noopener,noreferrer")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Abrir site
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur">
                <div className="flex flex-col items-center gap-5 sm:flex-row xl:flex-col">
                  <ScoreRing value={company.leadScore.score} />
                  <div className="text-center sm:text-left xl:text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">Opportunity Score</p>
                    <p className="mt-2 text-lg font-medium">Lead extremamente qualificado</p>
                    <p className="mt-1 text-sm text-zinc-500">Priorize esta conta na fila comercial.</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Metric label="Chance" value={`${closeChance}%`} hint="estimativa de fechamento" />
                  <Metric label="Ticket" value={money(maxTicket)} hint="potencial máximo" />
                  <Metric label="Confiança" value={`${company.leadScore.confidence}%`} hint="qualificação da IA" />
                  <Metric label="Prioridade" value={priorityLabel(company.leadScore.priority)} hint="ordem de ataque" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-40">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Contato e localização</p>
              <h2 className="mt-2 text-3xl font-semibold">Pronto para iniciar a conversa</h2>
            </div>
            {company.source === "demo" ? (
              <Badge variant="outline" className="w-fit border-amber-300 bg-amber-50 text-amber-800">
                Estes contatos são ilustrativos até a chave do Google ser ativada
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="rounded-[28px] p-6 shadow-none sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-muted/20 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600"><Phone className="h-5 w-5" /></span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Telefone</p>
                      <p className="mt-1 font-semibold">{company.phone || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" disabled={!company.phone} onClick={() => openApproach("call")}>
                      <Phone className="mr-2 h-3.5 w-3.5" />Ligar
                    </Button>
                    <Button size="sm" variant="outline" disabled={!company.whatsappUrl && !company.phone} onClick={() => openApproach("whatsapp")}>
                      <MessageSquareText className="mr-2 h-3.5 w-3.5" />WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border bg-muted/20 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10 text-sky-600"><Globe2 className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Website</p>
                      <p className="mt-1 truncate font-semibold">{company.website || "Não encontrado"}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-4" disabled={!company.website} onClick={() => company.website && window.open(company.website, "_blank", "noopener,noreferrer")}>
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />Abrir website
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-600"><MapPin className="h-5 w-5" /></span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Endereço completo</p>
                      <p className="mt-1 font-semibold leading-6">{company.address}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{[company.city, company.stateCode, company.postalCode].filter(Boolean).join(" · ")}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="shrink-0" disabled={!company.mapsUrl} onClick={() => company.mapsUrl && window.open(company.mapsUrl, "_blank", "noopener,noreferrer")}>
                    <MapPin className="mr-2 h-4 w-4" />Abrir no Maps
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-[28px] p-6 shadow-none sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-violet-500" /><h3 className="font-semibold">Horário de funcionamento</h3></div>
                {typeof company.openingHours?.openNow === "boolean" ? (
                  <Badge className={company.openingHours.openNow ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10" : "bg-red-500/10 text-red-700 hover:bg-red-500/10"}>
                    {company.openingHours.openNow ? "Aberto agora" : "Fechado agora"}
                  </Badge>
                ) : null}
              </div>
              {company.openingHours?.weekdayDescriptions.length ? (
                <div className="mt-5 space-y-2.5">
                  {company.openingHours.weekdayDescriptions.map((description) => (
                    <p key={description} className="rounded-xl bg-muted/35 px-3 py-2.5 text-sm text-muted-foreground">{description}</p>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Horário não informado pela empresa.
                </div>
              )}
              <div className="mt-5 border-t pt-4 text-xs leading-5 text-muted-foreground">
                Fonte: {company.source === "google_places" ? "Google Places" : "modo demonstração"}. Dados ausentes aparecem como não informados, sem serem inventados em produção.
              </div>
            </Card>
          </div>
        </section>

        <CompanyRelationship
          company={company}
          open={approachOpen}
          onOpenChange={setApproachOpen}
          initialChannel={approachChannel}
          showSummary={false}
        />

        <section id="summary" className="scroll-mt-40 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="rounded-[28px] border-violet-500/20 bg-violet-500/[0.045] p-7 shadow-none sm:p-8">
              <div className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-500/20"><Bot className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Recomendação da IA</p>
                  <h2 className="mt-2 text-2xl font-semibold">O melhor caminho para fechar esta conta</h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    A entrada recomendada é <strong className="font-semibold text-foreground">{topServices[0]?.toLowerCase() ?? "uma solução digital orientada à conversão"}</strong>, usando a reputação de {company.rating.toFixed(1)} estrelas como prova de valor. Trabalhe uma proposta entre {money(minTicket)} e {money(maxTicket)}.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-[28px] p-7 shadow-none sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3"><Gauge className="h-5 w-5 text-violet-500" /><h3 className="font-semibold">Leitura em 5 segundos</h3></div>
                <Badge variant="outline">4 sinais</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  company.websiteAnalysis.hasWebsite ? "Website encontrado, mas ainda há espaço para conversão" : "Sem website: oportunidade imediata",
                  company.instagramAnalysis.profileFound ? "Instagram localizado no website" : "Instagram ainda não verificado",
                  company.rating >= 4.5 ? "Google forte e com prova social" : "Reputação precisa ser fortalecida",
                  `${company.leadScore.confidence}% de confiança na qualificação`,
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-muted/40 px-3 py-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportAreas.map((area) => {
              const Icon = area.icon;
              return (
                <a key={area.id} href="#diagnosis" className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${area.soft}`}>
                  <div className="flex items-center justify-between"><Icon className={`h-5 w-5 ${area.accent}`} /><span className="text-2xl font-semibold">{area.score}</span></div>
                  <p className="mt-4 font-semibold">{area.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{area.status}</p>
                </a>
              );
            })}
          </div>
        </section>

        <section id="diagnosis" className="scroll-mt-40">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Diagnóstico por canal</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Entenda exatamente o que foi encontrado</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              A análise agora está organizada em blocos completos. Em cada canal, leia na ordem: situação atual, problemas encontrados e solução que você pode oferecer.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {reportAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <a
                    key={area.id}
                    href={`#diagnosis-${area.id}`}
                    className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <Icon className={`h-4 w-4 ${area.accent}`} />
                    {area.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-violet-500/15 bg-violet-500/[0.035] p-5 sm:p-6">
            <div className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-500 text-white">
                <Lightbulb className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Como interpretar esta parte</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Não compare tudo ao mesmo tempo. Analise um canal por vez e avance para o próximo somente depois de entender o problema e a oportunidade daquele bloco.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-10">
            {reportAreas.map((area, index) => (
              <AreaDiagnosticBlock key={area.id} area={area} index={index} />
            ))}
          </div>
        </section>

        <section id="opportunities" className="scroll-mt-40">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div className="lg:sticky lg:top-40 lg:self-start">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10"><CircleDollarSign className="h-6 w-6 text-emerald-600" /></div>
              <h2 className="mt-5 text-3xl font-semibold">Oportunidades priorizadas</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Serviços ordenados por impacto, facilidade de abertura e potencial de receita.</p>
              <div className="mt-6 rounded-2xl border bg-muted/30 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Faixa recomendada</p>
                <p className="mt-2 text-2xl font-semibold">{money(minTicket)}–{money(maxTicket)}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {topServices.map((service, index) => {
                const estimated = Math.round(minTicket + ((maxTicket - minTicket) * (4 - index)) / 4);
                return (
                  <Card key={service} className="group rounded-[28px] p-6 shadow-none transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-foreground font-semibold text-background">{index + 1}</div>
                      <Badge variant={index === 0 ? "default" : "outline"}>{index === 0 ? "Prioridade máxima" : "Complementar"}</Badge>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{service}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{index === 0 ? "Melhor porta de entrada para demonstrar valor e abrir a negociação." : "Eleva ticket, retenção e percepção de solução completa."}</p>
                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                      <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Potencial</span>
                      <span className="font-semibold">{money(estimated)}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="plan" className="scroll-mt-40 space-y-6">
          <Card className="rounded-[30px] p-7 shadow-none sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-violet-500" /><h2 className="text-xl font-semibold">Cadência de fechamento</h2></div>
              <Badge variant="outline">Ciclo de 8 dias</Badge>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                ["Hoje", "Contato inicial", "Abra com a dor principal e um insight específico."],
                ["D+2", "Prova de valor", "Envie uma oportunidade visual e objetiva."],
                ["D+5", "Reunião", "Apresente escopo, prazo e faixa de investimento."],
                ["D+8", "Fechamento", "Trate objeções e proponha o próximo passo."],
              ].map(([day, title, text], index) => (
                <div key={day} className="relative rounded-2xl border bg-muted/20 p-5">
                  <div className="flex items-center justify-between"><span className="grid h-8 min-w-8 place-items-center rounded-full bg-violet-500 px-2 text-xs font-semibold text-white">{index + 1}</span><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">{day}</p></div>
                  <p className="mt-4 font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  {index < 3 ? <ChevronRight className="absolute -right-4 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground md:block" /> : null}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Dor principal", company.leadScore.reasons[0] ?? "Presença digital abaixo do potencial"],
              ["Oferta de entrada", topServices[0] ?? "Diagnóstico e otimização digital"],
              ["Melhor canal", company.instagramAnalysis.profileFound ? "Instagram + WhatsApp" : "Telefone + WhatsApp"],
            ].map(([label, value]) => (
              <Card key={label} className="rounded-2xl p-5 shadow-none"><p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p><p className="mt-3 font-semibold leading-6">{value}</p></Card>
            ))}
          </div>
        </section>

        <section id="outreach" className="scroll-mt-40">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Kit comercial</p>
            <h2 className="mt-2 text-3xl font-semibold">Abordagens prontas para usar</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { id: "whatsapp", title: "WhatsApp", icon: MessageSquareText, text: company.outreach.message, accent: "text-emerald-600", soft: "bg-emerald-500/10" },
              { id: "email", title: "E-mail", icon: ExternalLink, text: `Assunto: ${company.outreach.subject}\n\n${company.outreach.message}`, accent: "text-sky-600", soft: "bg-sky-500/10" },
              { id: "call", title: "Ligação", icon: Phone, text: company.outreach.callOpening, accent: "text-violet-600", soft: "bg-violet-500/10" },
            ].map((item) => {
              const Icon = item.icon;
              const isCopied = copied === item.id;
              return (
                <Card key={item.id} className="flex min-h-[330px] flex-col rounded-[28px] p-6 shadow-none">
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl ${item.soft}`}><Icon className={`h-5 w-5 ${item.accent}`} /></div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-6 text-muted-foreground">{item.text}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button variant={isCopied ? "default" : "outline"} onClick={() => copyText(item.id, item.text)}>
                      {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      {isCopied ? "Copiado" : "Copiar"}
                    </Button>
                    <Button onClick={() => openApproach(item.id as InteractionChannel)}>
                      <ExternalLink className="mr-2 h-4 w-4" /> Usar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <Card className="overflow-hidden rounded-[30px] border-zinc-800 bg-zinc-950 p-7 text-white shadow-none sm:p-8">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="pointer-events-none absolute -right-12 -top-24 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-400/10"><Lightbulb className="h-6 w-6 text-amber-300" /></div>
              <div><p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Próxima melhor ação</p><h2 className="mt-2 max-w-2xl text-xl font-semibold">Comece oferecendo {topServices[0]?.toLowerCase() ?? "uma solução orientada à conversão"} e use a reputação atual como prova de valor.</h2></div>
            </div>
            <Button className="relative shrink-0" onClick={() => openApproach()}><Target className="mr-2 h-4 w-4" />Abrir abordagem</Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
