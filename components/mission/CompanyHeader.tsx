"use client";

import {
  Camera,
  CheckCircle2,
  ExternalLink,
  Gauge,
  MapPin,
  Star,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MissionCompany = Mission["companies"][number];

type CompanyHeaderProps = {
  company: MissionCompany;
  onViewCompany?: (company: MissionCompany) => void;
};

function translatePriority(priority: "high" | "medium" | "low") {
  if (priority === "high") {
    return "Alta prioridade";
  }

  if (priority === "medium") {
    return "Média prioridade";
  }

  return "Baixa prioridade";
}

function PriorityBadge({
  priority,
}: {
  priority: "high" | "medium" | "low";
}) {
  const className =
    priority === "high"
      ? "border-red-500/20 bg-red-500/10 text-red-600"
      : priority === "medium"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

  return (
    <Badge variant="outline" className={className}>
      {translatePriority(priority)}
    </Badge>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: "success" | "warning";
  label: string;
}) {
  if (status === "success") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
      >
        <CheckCircle2 className="mr-1.5 h-3 w-3" />
        {label}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-amber-500/20 bg-amber-500/10 text-amber-600"
    >
      <TriangleAlert className="mr-1.5 h-3 w-3" />
      {label}
    </Badge>
  );
}

function ScoreBlock({
  label,
  value,
  description,
  icon: Icon,
  type,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof Star;
  type: "google" | "website" | "instagram" | "opportunity";
}) {
  const valueClass =
    type === "google"
      ? "text-foreground"
      : type === "website"
        ? "text-emerald-600"
        : type === "instagram"
          ? "text-pink-600"
          : "text-violet-600";

  return (
    <div className="min-w-[90px]">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <p className={`mt-1 text-xl font-semibold ${valueClass}`}>{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function CompanyHeader({
  company,
  onViewCompany,
}: CompanyHeaderProps) {
  const website = company.websiteAnalysis;
  const instagram = company.instagramAnalysis;

  return (
    <header className="p-5">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">
              {company.name}
            </h3>

            <Badge variant="secondary">Google Agent</Badge>

            <Badge variant="outline">Website Agent</Badge>

            <Badge
              variant="outline"
              className="border-pink-500/20 bg-pink-500/10 text-pink-600"
            >
              Instagram Agent
            </Badge>

            <PriorityBadge priority={website.opportunityPriority} />
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />

            <p className="truncate">
              {company.address}, {company.city}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {website.hasWebsite ? (
              <StatusBadge status="success" label="Site encontrado" />
            ) : (
              <StatusBadge status="warning" label="Sem site" />
            )}

            {website.hasLandingPage ? (
              <StatusBadge status="success" label="Possui landing page" />
            ) : (
              <StatusBadge status="warning" label="Sem landing page" />
            )}

            {website.hasWhatsappButton ? (
              <StatusBadge status="success" label="WhatsApp presente" />
            ) : (
              <StatusBadge status="warning" label="Sem WhatsApp" />
            )}

            {instagram?.profileFound ? (
              <StatusBadge status="success" label="Instagram encontrado" />
            ) : (
              <StatusBadge status="warning" label="Instagram não localizado" />
            )}

            {instagram?.hasBioLink ? (
              <StatusBadge status="success" label="Link na bio" />
            ) : (
              <StatusBadge status="warning" label="Sem link na bio" />
            )}
          </div>

          <div className="mt-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onViewCompany?.(company)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver empresa
            </Button>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-5 sm:grid-cols-4">
          <ScoreBlock
            label="Google"
            value={company.rating.toFixed(1)}
            description={`${company.reviews} avaliações`}
            icon={Star}
            type="google"
          />

          <ScoreBlock
            label="Website"
            value={String(website.score)}
            description={website.scoreLabel}
            icon={Gauge}
            type="website"
          />

          <ScoreBlock
            label="Instagram"
            value={instagram ? String(instagram.score) : "—"}
            description={instagram?.scoreLabel ?? "Aguardando análise"}
            icon={Camera}
            type="instagram"
          />

          <ScoreBlock
            label="Oportunidade"
            value={`${website.opportunityScore}%`}
            description={translatePriority(website.opportunityPriority)}
            icon={TrendingUp}
            type="opportunity"
          />
        </div>
      </div>
    </header>
  );
}