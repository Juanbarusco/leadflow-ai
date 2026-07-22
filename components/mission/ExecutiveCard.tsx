"use client";

import {
  Bot,
  Clock3,
  DollarSign,
  Flame,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  WandSparkles,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MissionCompany = Mission["companies"][number];

type ExecutiveCardProps = {
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

function translateInstagramActivity(activity: string) {
  if (activity === "active") {
    return "ativa";
  }

  if (activity === "moderate") {
    return "moderada";
  }

  return "inativa";
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function buildExecutiveOpportunity(company: MissionCompany) {
  const website = company.websiteAnalysis;
  const instagram = company.instagramAnalysis;

  const googleScore = clamp(Math.round(company.rating * 20), 0, 100);
  const instagramScore = instagram?.score ?? 0;

  const generalScore = clamp(
    Math.round(
      googleScore * 0.2 +
        website.opportunityScore * 0.45 +
        (100 - instagramScore) * 0.35,
    ),
    0,
    100,
  );

  const closingChance = clamp(
    Math.round(
      generalScore * 0.72 +
        (company.reviews >= 100 ? 8 : 3) +
        (!website.hasLandingPage ? 6 : 0) +
        (!instagram?.hasWhatsapp ? 5 : 0),
    ),
    18,
    96,
  );

  const probableSale =
    Math.round(
      (website.estimatedSaleMin + website.estimatedSaleMax) / 2 / 100,
    ) * 100;

  const leadTemperature =
    closingChance >= 78
      ? "Lead quente"
      : closingChance >= 55
        ? "Lead morno"
        : "Lead em nutrição";

  const responseWindow =
    closingChance >= 78
      ? "Até 24h"
      : closingChance >= 55
        ? "Até 48h"
        : "Até 7 dias";

  const badgeClass =
    closingChance >= 78
      ? "border-red-400/20 bg-red-500/15 text-red-300"
      : closingChance >= 55
        ? "border-amber-400/20 bg-amber-500/15 text-amber-300"
        : "border-cyan-400/20 bg-cyan-500/15 text-cyan-300";

  const closingLabel =
    closingChance >= 78
      ? "Alta probabilidade"
      : closingChance >= 55
        ? "Probabilidade moderada"
        : "Exige aquecimento";

  const websiteGap = website.hasWebsite
    ? "possui site, mas ainda perde conversões por falhas na jornada digital"
    : "não possui uma estrutura própria de aquisição e conversão";

  const instagramGap = instagram?.profileFound
    ? `mantém Instagram com score ${
        instagram.score
      }/100 e atividade ${translateInstagramActivity(instagram.activity)}`
    : "não possui um perfil de Instagram localizado";

  const executiveSummary = `${company.name} tem reputação relevante no Google, mas apresenta lacunas digitais que justificam uma abordagem comercial consultiva.`;

  const fullDiagnosis = `${company.name} ${websiteGap}. A empresa ${instagramGap}. A combinação entre reputação pública, ausência de elementos de conversão e oportunidades identificadas gera score geral de ${generalScore}/100 e chance estimada de fechamento de ${closingChance}%. A abordagem deve destacar perda de contatos, facilidade de atendimento pelo WhatsApp e um plano integrado para website e Instagram.`;

  const recommendedBundle = Array.from(
    new Set([
      ...website.recommendedServices.slice(0, 3),
      ...(instagram?.recommendedServices.slice(0, 3) ?? []),
    ]),
  ).slice(0, 5);

  return {
    generalScore,
    closingChance,
    probableSale,
    leadTemperature,
    responseWindow,
    badgeClass,
    closingLabel,
    approachMinutes: closingChance >= 78 ? 3 : 5,
    executiveSummary,
    fullDiagnosis,
    recommendedBundle,
  };
}

function ExecutiveMetric({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.08]">
      <div className="flex items-center gap-2 text-zinc-400">
        <Icon className="h-4 w-4" />

        <p className="text-xs">{label}</p>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500">{helper}</p>
    </div>
  );
}

export function ExecutiveCard({
  company,
  onGenerateOutreach,
}: ExecutiveCardProps) {
  const executive = buildExecutiveOpportunity(company);

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-zinc-950 px-5 py-6 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative grid gap-6 xl:grid-cols-[1.05fr_1.95fr]">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                <Bot className="h-4 w-4 text-violet-300" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Inteligência executiva
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-200">
                  Prioridade comercial calculada pela IA
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={executive.badgeClass}
            >
              <Flame className="mr-1.5 h-3.5 w-3.5" />

              {executive.leadTemperature}
            </Badge>
          </div>

          <div className="mt-7 flex items-end justify-between gap-5">
            <div>
              <p className="text-sm text-zinc-400">Score geral</p>

              <div className="mt-1 flex items-end gap-2">
                <p className="text-6xl font-semibold tracking-[-0.06em]">
                  {executive.generalScore}
                </p>

                <p className="pb-2 text-sm text-zinc-500">/100</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-zinc-500">Janela ideal</p>

              <p className="mt-1 text-sm font-semibold text-white">
                {executive.responseWindow}
              </p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 transition-all duration-700"
              style={{
                width: `${executive.generalScore}%`,
              }}
            />
          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-400">
            {executive.executiveSummary}
          </p>

          <Button
            type="button"
            className="mt-5 w-full bg-white text-zinc-950 hover:bg-zinc-200"
            onClick={() => onGenerateOutreach?.(company)}
          >
            <WandSparkles className="mr-2 h-4 w-4" />

            Gerar abordagem IA
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ExecutiveMetric
              icon={Target}
              label="Chance de fechamento"
              value={`${executive.closingChance}%`}
              helper={executive.closingLabel}
            />

            <ExecutiveMetric
              icon={DollarSign}
              label="Venda provável"
              value={formatCurrency(executive.probableSale)}
              helper="Ticket recomendado"
            />

            <ExecutiveMetric
              icon={Timer}
              label="Tempo de abordagem"
              value={`${executive.approachMinutes} min`}
              helper="Mensagem personalizada"
            />

            <ExecutiveMetric
              icon={Clock3}
              label="Resposta recomendada"
              value={executive.responseWindow}
              helper="Prioridade de contato"
            />
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-300" />

              <p className="text-sm font-semibold">
                Diagnóstico executivo
              </p>
            </div>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {executive.fullDiagnosis}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {executive.recommendedBundle.map((service) => (
                <Badge
                  key={service}
                  variant="outline"
                  className="border-white/10 bg-white/[0.04] text-zinc-300"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}