"use client";

import {
  Gauge,
  Globe2,
  LayoutTemplate,
  MessageCircle,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MissionCompany = Mission["companies"][number];

type WebsiteSectionProps = {
  company: MissionCompany;
  onOpenWebsite?: (company: MissionCompany) => void;
};

function translateSpeed(speed: string) {
  if (speed === "fast") {
    return "Rápida";
  }

  if (speed === "medium") {
    return "Moderada";
  }

  return "Lenta";
}

function WebsiteMetric({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: typeof Globe2;
  label: string;
  value: string;
  status: "positive" | "warning" | "negative" | "neutral";
}) {
  const valueClass =
    status === "positive"
      ? "text-emerald-600"
      : status === "warning"
        ? "text-amber-600"
        : status === "negative"
          ? "text-red-500"
          : "text-foreground";

  const iconClass =
    status === "positive"
      ? "text-emerald-600"
      : status === "warning"
        ? "text-amber-600"
        : status === "negative"
          ? "text-red-500"
          : "text-muted-foreground";

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className={`h-4 w-4 ${iconClass}`} />
        {label}
      </div>

      <p className={`mt-2 text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

export function WebsiteSection({
  company,
  onOpenWebsite,
}: WebsiteSectionProps) {
  const website = company.websiteAnalysis;

  const speedStatus =
    website.speed === "fast"
      ? "positive"
      : website.speed === "medium"
        ? "warning"
        : "negative";

  return (
    <section className="border-t p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <Globe2 className="h-4 w-4 text-emerald-600" />
            </div>

            <div>
              <h4 className="text-sm font-semibold">Website e conversão</h4>

              <p className="mt-1 text-xs text-muted-foreground">
                Estrutura, velocidade, jornada e capacidade de gerar contatos.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={
              website.hasWebsite
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                : "border-amber-500/20 bg-amber-500/10 text-amber-600"
            }
          >
            {website.hasWebsite ? "Website localizado" : "Sem website"}
          </Badge>

          {website.hasWebsite && company.website ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenWebsite?.(company)}
            >
              <MonitorSmartphone className="mr-2 h-4 w-4" />
              Abrir website
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <WebsiteMetric
          icon={Gauge}
          label="Velocidade"
          value={translateSpeed(website.speed)}
          status={speedStatus}
        />

        <WebsiteMetric
          icon={LayoutTemplate}
          label="Landing page"
          value={website.hasLandingPage ? "Encontrada" : "Não encontrada"}
          status={website.hasLandingPage ? "positive" : "negative"}
        />

        <WebsiteMetric
          icon={MessageCircle}
          label="WhatsApp"
          value={
            website.hasWhatsappButton
              ? "Botão encontrado"
              : "Botão não encontrado"
          }
          status={website.hasWhatsappButton ? "positive" : "negative"}
        />

        <WebsiteMetric
          icon={ShieldCheck}
          label="Maturidade digital"
          value={website.scoreLabel}
          status={
            website.score >= 70
              ? "positive"
              : website.score >= 45
                ? "warning"
                : "negative"
          }
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />

            <p className="text-sm font-semibold">Leitura do Website Agent</p>
          </div>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {website.commercialDiagnosis}
          </p>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-amber-600" />

            <p className="text-sm font-semibold">Sinais observados</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {website.observations.length > 0 ? (
              website.observations.map((observation, index) => (
                <Badge
                  key={`${company.id}-website-observation-${index}`}
                  variant="outline"
                  className="font-normal"
                >
                  {observation}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma observação adicional foi registrada.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}