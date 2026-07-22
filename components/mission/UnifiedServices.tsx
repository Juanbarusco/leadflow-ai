"use client";

import {
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Globe2,
  PackageCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";

type MissionCompany = Mission["companies"][number];

type UnifiedServicesProps = {
  company: MissionCompany;
};

type ServiceItem = {
  id: string;
  source: "Website" | "Instagram";
  name: string;
  priority: "high" | "medium" | "low";
};

function inferPriority(service: string): ServiceItem["priority"] {
  const normalized = service.toLowerCase();

  const highSignals = [
    "site institucional",
    "landing page",
    "whatsapp",
    "criação de site",
    "desenvolvimento de site",
    "implantação do instagram",
    "criação de instagram",
  ];

  const mediumSignals = [
    "gestão de instagram",
    "bio",
    "destaques",
    "conteúdo",
    "identidade visual",
    "otimização",
    "conversão",
    "social media",
  ];

  if (highSignals.some((signal) => normalized.includes(signal))) {
    return "high";
  }

  if (mediumSignals.some((signal) => normalized.includes(signal))) {
    return "medium";
  }

  return "low";
}

function buildServices(company: MissionCompany): ServiceItem[] {
  const websiteServices = company.websiteAnalysis.recommendedServices.map(
    (service, index) => ({
      id: `${company.id}-website-service-${index}`,
      source: "Website" as const,
      name: service,
      priority: inferPriority(service),
    }),
  );

  const instagramServices =
    company.instagramAnalysis?.recommendedServices.map((service, index) => ({
      id: `${company.id}-instagram-service-${index}`,
      source: "Instagram" as const,
      name: service,
      priority: inferPriority(service),
    })) ?? [];

  const combined = [...websiteServices, ...instagramServices];

  const uniqueServices = combined.filter(
    (service, index, array) =>
      array.findIndex(
        (item) =>
          item.name.trim().toLowerCase() ===
          service.name.trim().toLowerCase(),
      ) === index,
  );

  return uniqueServices.sort((a, b) => {
    const weight = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return weight[b.priority] - weight[a.priority];
  });
}

function PriorityBadge({
  priority,
}: {
  priority: ServiceItem["priority"];
}) {
  const label =
    priority === "high"
      ? "Principal"
      : priority === "medium"
        ? "Complementar"
        : "Expansão";

  const className =
    priority === "high"
      ? "border-violet-500/20 bg-violet-500/10 text-violet-600"
      : priority === "medium"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
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
  source: ServiceItem["source"];
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

export function UnifiedServices({
  company,
}: UnifiedServicesProps) {
  const services = buildServices(company);

  const primaryServices = services.filter(
    (service) => service.priority === "high",
  );

  const secondaryServices = services.filter(
    (service) => service.priority !== "high",
  );

  const recommendedBundle = services.slice(0, 4);

  return (
    <section className="border-t p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
            <BriefcaseBusiness className="h-5 w-5 text-violet-600" />
          </div>

          <div>
            <h4 className="text-sm font-semibold">
              Oportunidades comerciais unificadas
            </h4>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              Serviços indicados com base nos problemas encontrados e no
              potencial de geração de resultado para a empresa.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border-violet-500/20 bg-violet-500/10 text-violet-600"
          >
            {primaryServices.length} principais
          </Badge>

          <Badge variant="secondary">
            {services.length} serviços sugeridos
          </Badge>
        </div>
      </div>

      {recommendedBundle.length > 0 ? (
        <div className="mt-5 rounded-[24px] border border-violet-500/15 bg-violet-500/[0.04] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                <PackageCheck className="h-5 w-5 text-violet-600" />
              </div>

              <div>
                <p className="text-sm font-semibold">Pacote recomendado pela IA</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Combinação de maior impacto comercial para esta empresa.
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="w-fit border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
            >
              <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
              Maior potencial
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {recommendedBundle.map((service, index) => (
              <div
                key={`bundle-${service.id}`}
                className="rounded-2xl border bg-background p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-600">
                    {index + 1}
                  </span>

                  <PriorityBadge priority={service.priority} />
                </div>

                <p className="mt-4 text-sm font-semibold leading-6">
                  {service.name}
                </p>

                <div className="mt-3">
                  <SourceBadge source={service.source} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {services.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {[...primaryServices, ...secondaryServices].map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border bg-card p-4 transition hover:border-foreground/15 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SourceBadge source={service.source} />

                <PriorityBadge priority={service.priority} />
              </div>

              <div className="mt-4 flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-semibold leading-6">
                    {service.name}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Serviço sugerido a partir dos sinais encontrados pelo{" "}
                    {service.source} Agent.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed bg-muted/20 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-sm font-semibold">
                Nenhum serviço recomendado
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Os agentes ainda não registraram oportunidades comerciais para
                esta empresa.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}