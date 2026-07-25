"use client";

import {
  Activity,
  Camera,
  ExternalLink,
  FileText,
  Link2,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type MissionCompany = Mission["companies"][number];

type InstagramSectionProps = {
  company: MissionCompany;
  onOpenInstagram?: (company: MissionCompany) => void;
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function translateActivity(activity: string) {
  if (activity === "active") return "Ativa";
  if (activity === "irregular") return "Irregular";
  if (activity === "inactive") return "Inativa";
  return "Não verificada";
}

function translateEngagement(engagement: string) {
  if (engagement === "high") return "Alto";
  if (engagement === "medium") return "Médio";
  if (engagement === "low") return "Baixo";
  return "Não verificado";
}

function InstagramMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Camera;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function ProfileSignal({
  icon: Icon,
  label,
  available,
  positiveLabel,
  negativeLabel,
  verified = true,
}: {
  icon: typeof Link2;
  label: string;
  available: boolean;
  positiveLabel: string;
  negativeLabel: string;
  verified?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p
        className={`mt-2 text-sm font-semibold ${
          !verified ? "text-muted-foreground" : available ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {!verified ? "Não verificado" : available ? positiveLabel : negativeLabel}
      </p>
    </div>
  );
}

export function InstagramSection({
  company,
  onOpenInstagram,
}: InstagramSectionProps) {
  const instagram = company.instagramAnalysis;

  return (
    <section className="border-t p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10">
            <Camera className="h-4 w-4 text-pink-600" />
          </div>

          <div>
            <h4 className="text-sm font-semibold">Instagram e autoridade</h4>

            <p className="mt-1 text-xs text-muted-foreground">
              Presença, audiência, frequência, bio e sinais de conversão.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={
              instagram?.profileFound
                ? "border-pink-500/20 bg-pink-500/10 text-pink-600"
                : "border-amber-500/20 bg-amber-500/10 text-amber-600"
            }
          >
            {instagram?.profileFound
              ? "Perfil localizado"
              : "Perfil não localizado"}
          </Badge>

          {instagram?.profileFound && instagram.profileUrl ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onOpenInstagram?.(company)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              @{instagram.username}
            </Button>
          ) : null}
        </div>
      </div>

      {instagram?.profileFound ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InstagramMetric
              icon={Users}
              label="Seguidores"
              value={instagram.metricsVerified ? formatCompactNumber(instagram.followers) : "Não verificado"}
            />

            <InstagramMetric
              icon={FileText}
              label="Publicações"
              value={instagram.metricsVerified ? String(instagram.posts) : "Não verificado"}
            />

            <InstagramMetric
              icon={Activity}
              label="Atividade"
              value={translateActivity(instagram.activity)}
            />

            <InstagramMetric
              icon={TrendingUp}
              label="Engajamento"
              value={translateEngagement(instagram.engagement)}
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileSignal
              icon={Link2}
              label="Link na bio"
              available={instagram.hasBioLink}
              positiveLabel="Configurado"
              negativeLabel="Não configurado"
              verified={instagram.signalsVerified}
            />

            <ProfileSignal
              icon={MessageCircle}
              label="WhatsApp no perfil"
              available={instagram.hasWhatsapp}
              positiveLabel="Encontrado"
              negativeLabel="Não encontrado"
              verified={instagram.signalsVerified}
            />

            <ProfileSignal
              icon={FileText}
              label="Bio profissional"
              available={instagram.hasProfessionalBio}
              positiveLabel="Otimizada"
              negativeLabel="Precisa melhorar"
              verified={instagram.signalsVerified}
            />

            <ProfileSignal
              icon={Sparkles}
              label="Destaques"
              available={instagram.hasHighlights}
              positiveLabel="Organizados"
              negativeLabel="Não encontrados"
              verified={instagram.signalsVerified}
            />
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-600" />

                <p className="text-sm font-semibold">
                  Leitura do Instagram Agent
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {instagram.commercialDiagnosis}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-pink-600" />

                <p className="text-sm font-semibold">Sinais observados</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {instagram.observations.length > 0 ? (
                  instagram.observations.map((observation, index) => (
                    <Badge
                      key={`${company.id}-instagram-observation-${index}`}
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

              <p className="mt-4 text-xs text-muted-foreground">
                {instagram.metricsVerified && instagram.daysSinceLastPost >= 0
                  ? `Última publicação há ${instagram.daysSinceLastPost} dias.`
                  : "Data da última publicação não verificada."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed bg-muted/20 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <Camera className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Instagram não localizado
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Nenhum link verificável foi localizado nas fontes atuais. Isso não confirma ausência do perfil; indica apenas que o canal ainda precisa de validação manual antes da abordagem.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}