"use client";

import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  DollarSign,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MissionCompany = Mission["companies"][number];

type AiDiagnosisProps = {
  company: MissionCompany;
  onGenerateOutreach?: (company: MissionCompany) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function translateActivity(activity: string) {
  if (activity === "active") {
    return "ativa";
  }

  if (activity === "moderate") {
    return "moderada";
  }

  return "inativa";
}

function buildUnifiedDiagnosis(company: MissionCompany) {
  const website = company.websiteAnalysis;
  const instagram = company.instagramAnalysis;

  const googleScore = clamp(Math.round(company.rating * 20), 0, 100);
  const instagramScore = instagram?.score ?? 0;

  const opportunityScore = clamp(
    Math.round(
      googleScore * 0.2 +
        website.opportunityScore * 0.45 +
        (100 - instagramScore) * 0.35,
    ),
    0,
    100,
  );

  const estimatedSale =
    Math.round(
      (website.estimatedSaleMin + website.estimatedSaleMax) / 2 / 100,
    ) * 100;

  const websiteProblems = website.commercialProblems ?? [];
  const instagramProblems = instagram?.commercialProblems ?? [];

  const allProblems = [...websiteProblems, ...instagramProblems];

  const recommendedServices = Array.from(
    new Set([
      ...(website.recommendedServices ?? []),
      ...(instagram?.recommendedServices ?? []),
    ]),
  ).slice(0, 6);

  const mainProblem =
    allProblems[0] ??
    "A empresa ainda apresenta espaço para melhorar sua estrutura comercial digital.";

  const websiteStatus = website.hasWebsite
    ? "possui presença própria na internet"
    : "ainda não possui uma estrutura própria de website";

  const instagramStatus = instagram?.profileFound
    ? `possui Instagram com score ${instagram.score}/100 e atividade ${translateActivity(
        instagram.activity,
      )}`
    : "não possui um perfil de Instagram claramente localizado";

  const diagnosis = `${company.name} ${websiteStatus} e ${instagramStatus}. O principal ponto identificado foi: ${mainProblem}. A empresa possui reputação de ${company.rating.toFixed(
    1,
  )} estrelas no Google, com ${
    company.reviews
  } avaliações, o que demonstra existência de demanda e confiança pública. Porém, as falhas encontradas nos canais digitais indicam perda de contatos, dificuldade de conversão e menor aproveitamento da procura já existente.`;

  const strategy =
    opportunityScore >= 75
      ? "A abordagem recomendada é direta e consultiva, destacando perdas visíveis de conversão e apresentando uma solução integrada com resultado rápido."
      : opportunityScore >= 55
        ? "A abordagem recomendada deve combinar diagnóstico, educação comercial e uma proposta simples de evolução digital."
        : "A abordagem recomendada deve priorizar relacionamento, autoridade e uma oferta inicial de menor resistência.";

  const bestChannel =
    instagram?.hasWhatsapp || website.hasWhatsappButton
      ? "WhatsApp"
      : instagram?.profileFound
        ? "Instagram Direct"
        : "Ligação ou e-mail";

  return {
    opportunityScore,
    estimatedSale,
    diagnosis,
    strategy,
    bestChannel,
    recommendedServices,
    mainProblem,
  };
}

function InsightCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="mt-3 text-lg font-semibold tracking-tight">{value}</p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">{helper}</p>
    </div>
  );
}

export function AiDiagnosis({
  company,
  onGenerateOutreach,
}: AiDiagnosisProps) {
  const analysis = buildUnifiedDiagnosis(company);

  return (
    <section className="border-t bg-muted/20 p-5">
      <div className="overflow-hidden rounded-[28px] border bg-background">
        <div className="relative overflow-hidden border-b bg-zinc-950 p-5 text-white">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <BrainCircuit className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-semibold">
                    Diagnóstico unificado da IA
                  </h4>

                  <Badge
                    variant="outline"
                    className="border-violet-400/20 bg-violet-500/15 text-violet-200"
                  >
                    <Bot className="mr-1.5 h-3.5 w-3.5" />
                    AI Commercial Engine
                  </Badge>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                  Leitura consolidada da reputação, website, Instagram,
                  conversão e potencial comercial da empresa.
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="bg-white text-zinc-950 hover:bg-zinc-200"
              onClick={() => onGenerateOutreach?.(company)}
            >
              <WandSparkles className="mr-2 h-4 w-4" />
              Gerar abordagem IA
            </Button>
          </div>
        </div>

        <div className="grid gap-5 p-5 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border bg-muted/20 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />

                <p className="text-sm font-semibold">Parecer comercial</p>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {analysis.diagnosis}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />

                <p className="text-sm font-semibold">
                  Estratégia recomendada
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {analysis.strategy}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                <p className="text-sm font-semibold">
                  Solução indicada pela IA
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.recommendedServices.length > 0 ? (
                  analysis.recommendedServices.map((service) => (
                    <Badge
                      key={service}
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/5"
                    >
                      {service}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum serviço foi recomendado nesta análise.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <InsightCard
              icon={Target}
              label="Potencial comercial"
              value={`${analysis.opportunityScore}/100`}
              helper="Score consolidado dos agentes"
            />

            <InsightCard
              icon={DollarSign}
              label="Venda provável"
              value={formatCurrency(analysis.estimatedSale)}
              helper="Ticket médio sugerido"
            />

            <InsightCard
              icon={MessageSquareText}
              label="Melhor canal"
              value={analysis.bestChannel}
              helper="Canal inicial recomendado"
            />

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
                <Lightbulb className="h-4 w-4" />
                Principal argumento
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {analysis.mainProblem}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}