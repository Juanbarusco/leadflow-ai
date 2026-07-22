"use client";

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Globe2,
  TriangleAlert,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";

type MissionCompany = Mission["companies"][number];

type UnifiedProblemsProps = {
  company: MissionCompany;
};

type ProblemItem = {
  id: string;
  source: "Website" | "Instagram";
  text: string;
  severity: "high" | "medium" | "low";
};

function inferSeverity(problem: string): ProblemItem["severity"] {
  const normalized = problem.toLowerCase();

  const highSignals = [
    "sem site",
    "não possui site",
    "sem whatsapp",
    "não encontrado",
    "inativo",
    "sem perfil",
    "não localizado",
    "site lento",
    "sem landing page",
  ];

  const mediumSignals = [
    "precisa melhorar",
    "baixa",
    "fraca",
    "moderada",
    "desatualizado",
    "sem link",
    "pouco",
    "ausência",
  ];

  if (highSignals.some((signal) => normalized.includes(signal))) {
    return "high";
  }

  if (mediumSignals.some((signal) => normalized.includes(signal))) {
    return "medium";
  }

  return "low";
}

function buildProblems(company: MissionCompany): ProblemItem[] {
  const websiteProblems = company.websiteAnalysis.commercialProblems.map(
    (problem, index) => ({
      id: `${company.id}-website-problem-${index}`,
      source: "Website" as const,
      text: problem,
      severity: inferSeverity(problem),
    }),
  );

  const instagramProblems =
    company.instagramAnalysis?.commercialProblems.map((problem, index) => ({
      id: `${company.id}-instagram-problem-${index}`,
      source: "Instagram" as const,
      text: problem,
      severity: inferSeverity(problem),
    })) ?? [];

  return [...websiteProblems, ...instagramProblems];
}

function SeverityBadge({
  severity,
}: {
  severity: ProblemItem["severity"];
}) {
  const label =
    severity === "high"
      ? "Crítico"
      : severity === "medium"
        ? "Atenção"
        : "Oportunidade";

  const className =
    severity === "high"
      ? "border-red-500/20 bg-red-500/10 text-red-600"
      : severity === "medium"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
        : "border-sky-500/20 bg-sky-500/10 text-sky-600";

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

function SourceBadge({
  source,
}: {
  source: ProblemItem["source"];
}) {
  if (source === "Website") {
    return (
      <Badge variant="secondary">
        <Globe2 className="mr-1.5 h-3 w-3" />
        Website
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-pink-500/20 bg-pink-500/10 text-pink-600"
    >
      <Camera className="mr-1.5 h-3 w-3" />
      Instagram
    </Badge>
  );
}

export function UnifiedProblems({
  company,
}: UnifiedProblemsProps) {
  const problems = buildProblems(company);

  const criticalProblems = problems.filter(
    (problem) => problem.severity === "high",
  ).length;

  const attentionProblems = problems.filter(
    (problem) => problem.severity === "medium",
  ).length;

  return (
    <section className="border-t p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <TriangleAlert className="h-5 w-5 text-red-500" />
          </div>

          <div>
            <h4 className="text-sm font-semibold">
              Problemas comerciais unificados
            </h4>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              Pontos que reduzem autoridade, conversão, descoberta e capacidade
              de gerar novos contatos.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border-red-500/20 bg-red-500/10 text-red-600"
          >
            {criticalProblems} críticos
          </Badge>

          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 text-amber-600"
          >
            {attentionProblems} em atenção
          </Badge>

          <Badge variant="secondary">
            {problems.length} sinais encontrados
          </Badge>
        </div>
      </div>

      {problems.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {problems.map((problem) => (
            <article
              key={problem.id}
              className="rounded-2xl border bg-card p-4 transition hover:border-foreground/15 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SourceBadge source={problem.source} />

                <SeverityBadge severity={problem.severity} />
              </div>

              <div className="mt-4 flex items-start gap-3">
                <AlertCircle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    problem.severity === "high"
                      ? "text-red-500"
                      : problem.severity === "medium"
                        ? "text-amber-600"
                        : "text-sky-600"
                  }`}
                />

                <p className="text-sm leading-6 text-foreground/90">
                  {problem.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Nenhum problema relevante encontrado
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Os canais analisados não apresentaram falhas comerciais
                importantes nesta etapa.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}