"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Camera,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  MapPin,
  MessageSquareText,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { AiDiagnosis } from "@/components/mission/AiDiagnosis";
import { CompanyFooter } from "@/components/mission/CompanyFooter";
import { ExecutiveCard } from "@/components/mission/ExecutiveCard";
import { InstagramSection } from "@/components/mission/InstagramSection";
import { UnifiedProblems } from "@/components/mission/UnifiedProblems";
import { UnifiedServices } from "@/components/mission/UnifiedServices";
import { WebsiteSection } from "@/components/mission/WebsiteSection";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


type MissionCompany = Mission["companies"][number];

type CompanyOpportunityCardProps = {
  company: MissionCompany;
  onOpenWebsite?: (company: MissionCompany) => void;
  onOpenInstagram?: (company: MissionCompany) => void;
  onOpenMaps?: (company: MissionCompany) => void;
  onGenerateOutreach?: (company: MissionCompany) => void;
  rank?: number;
  isBestOpportunity?: boolean;
};

type LeadTemperature = "Quente" | "Morno" | "Nutrição";

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function getTemperatureLabel(temperature: LeadTemperature) {
  if (temperature === "Quente") return "Lead quente";
  if (temperature === "Morno") return "Lead morno";
  return "Nutrição";
}

function getTemperatureClasses(temperature: LeadTemperature) {
  if (temperature === "Quente") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }

  if (temperature === "Morno") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }

  return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400";
}

function getProgressClasses(value: number) {
  if (value >= 78) return "bg-emerald-500";
  if (value >= 55) return "bg-amber-500";
  return "bg-sky-500";
}

function buildCompactAnalysis(company: MissionCompany) {
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

  const problems = [
    ...(website.commercialProblems ?? []),
    ...(instagram?.commercialProblems ?? []),
  ];

  const temperature: LeadTemperature =
    closingChance >= 78
      ? "Quente"
      : closingChance >= 55
        ? "Morno"
        : "Nutrição";

  return {
    generalScore,
    closingChance,
    probableSale,
    problems,
    temperature,
  };
}

function CompactMetric({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border bg-background/75 px-3.5 py-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="truncate">{label}</span>
      </div>

      <p className="mt-1.5 truncate text-lg font-semibold tracking-tight">
        {value}
      </p>

      {helper ? (
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export function CompanyOpportunityCard({
  company,
  onOpenWebsite,
  onOpenInstagram,
  onOpenMaps,
  onGenerateOutreach,
  rank,
  isBestOpportunity = false,
}: CompanyOpportunityCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const website = company.websiteAnalysis;
  const instagram = company.instagramAnalysis;

  const analysis = useMemo(() => buildCompactAnalysis(company), [company]);

  const visibleProblems = analysis.problems.slice(0, 2);
  const hiddenProblemsCount = Math.max(
    analysis.problems.length - visibleProblems.length,
    0,
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`group overflow-hidden rounded-[26px] border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isBestOpportunity ? "border-violet-500/35 ring-1 ring-violet-500/15" : ""}`}
    >
      <div className="p-4 sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {rank ? (
                <Badge variant="secondary" className="rounded-lg px-2 py-1 text-xs font-semibold">#{rank}</Badge>
              ) : null}
              {isBestOpportunity ? (
                <Badge className="border-violet-500/20 bg-violet-500/10 text-violet-700 hover:bg-violet-500/10 dark:text-violet-300">
                  <Sparkles className="mr-1 h-3 w-3" /> Melhor oportunidade
                </Badge>
              ) : null}
              <h3 className="truncate text-lg font-semibold tracking-tight">
                {company.name}
              </h3>

              <Badge
                variant="outline"
                className={getTemperatureClasses(analysis.temperature)}
              >
                {analysis.temperature === "Quente" ? "🔥" : analysis.temperature === "Morno" ? "🟡" : "🔵"}
                <span className="ml-1">{getTemperatureLabel(analysis.temperature)}</span>
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">
                  {company.rating.toFixed(1)}
                </span>
                <span>({company.reviews})</span>
              </span>

              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {company.address}, {company.city}
                </span>
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={
                  website.hasWebsite
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
                }
              >
                <Globe2 className="mr-1.5 h-3.5 w-3.5" />
                {website.hasWebsite ? "Site encontrado" : "Sem site"}
              </Badge>

              <Badge
                variant="outline"
                className={
                  instagram?.profileFound
                    ? "border-pink-500/20 bg-pink-500/10 text-pink-700 dark:text-pink-400"
                    : "border-muted-foreground/20 bg-muted text-muted-foreground"
                }
              >
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                {instagram?.profileFound ? "Instagram ativo" : "Sem Instagram"}
              </Badge>

              <Badge variant="outline" className="bg-muted/40 text-muted-foreground">
                <Bot className="mr-1.5 h-3.5 w-3.5" />
                3 agentes analisaram
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <CompactMetric
              icon={Target}
              label="Score"
              value={`${analysis.generalScore}`}
              helper="de 100"
            />

            <CompactMetric
              icon={TrendingUp}
              label="Fechamento"
              value={`${analysis.closingChance}%`}
              helper="chance estimada"
            />

            <CompactMetric
              icon={CircleDollarSign}
              label="Ticket"
              value={formatCurrency(analysis.probableSale)}
              helper="venda provável"
            />

            <CompactMetric
              icon={Sparkles}
              label="Oportunidade"
              value={`${website.opportunityScore}%`}
              helper={website.scoreLabel}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="rounded-2xl border bg-muted/25 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <TriangleAlert className="h-4 w-4 shrink-0 text-amber-600" />

                <span className="text-sm font-medium">
                  {analysis.problems.length} {analysis.problems.length === 1 ? "problema encontrado" : "problemas encontrados"}
                </span>
              </div>

              <div className="hidden min-w-[180px] flex-1 sm:block sm:max-w-[280px]">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressClasses(
                      analysis.closingChance,
                    )}`}
                    style={{ width: `${analysis.closingChance}%` }}
                  />
                </div>
              </div>
            </div>

            {visibleProblems.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {visibleProblems.map((problem, index) => (
                  <span
                    key={`${company.id}-problem-${index}`}
                    className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {problem}
                  </span>
                ))}

                {hiddenProblemsCount > 0 ? (
                  <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                    +{hiddenProblemsCount}
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Nenhum problema relevante identificado.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onGenerateOutreach?.(company)}
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              Abordagem IA
            </Button>

            <CollapsibleTrigger className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              <span>{isOpen ? "Fechar detalhes" : "Ver detalhes"}</span>

              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
          </div>
        </div>
      </div>

      <CollapsibleContent>
        <div className="border-t bg-muted/10">
          <ExecutiveCard
            company={company}
            onGenerateOutreach={onGenerateOutreach}
          />

          <WebsiteSection company={company} onOpenWebsite={onOpenWebsite} />

          <InstagramSection
            company={company}
            onOpenInstagram={onOpenInstagram}
          />

          <UnifiedProblems company={company} />

          <UnifiedServices company={company} />

          <AiDiagnosis
            company={company}
            onGenerateOutreach={onGenerateOutreach}
          />

          <CompanyFooter company={company} onOpenMaps={onOpenMaps} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}