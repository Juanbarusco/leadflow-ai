"use client";

import {
  ArrowRight,
  Bell,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  Settings2,
  Sparkles,
  Timer,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import type { Mission } from "@/lib/engines/mission-engine";
import { radarPoints, stageDefinitions } from "@/lib/mission/config";
import type { MissionPreferences, SimulationSpeed } from "@/lib/mission/types";
import { formatCurrency, formatTime } from "@/lib/mission/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MissionFocusOverlay({
  mission,
  runId,
  progress,
  activeStage,
  elapsedSeconds,
  visibleActivities,
  visibleCompanies,
  currentActivity,
  companies,
  isFinished,
  preferences,
  settingsOpen,
  onToggleSettings,
  onPreferencesChange,
  onClose,
}: {
  mission: Mission | null;
  runId: number;
  progress: number;
  activeStage: number;
  elapsedSeconds: number;
  visibleActivities: number;
  visibleCompanies: number;
  currentActivity: string;
  companies: Mission["companies"];
  isFinished: boolean;
  preferences: MissionPreferences;
  settingsOpen: boolean;
  onToggleSettings: () => void;
  onPreferencesChange: (preferences: MissionPreferences) => void;
  onClose: () => void;
}) {
  const stage = stageDefinitions[activeStage];
  const StageIcon = stage.icon;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-zinc-950 px-4 py-5 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                LeadFlow AI · Missão #{String(runId).padStart(3, "0")}
              </p>
              <p className="mt-1 text-sm text-zinc-300">{mission?.city ?? "Preparando região"} · {mission?.niche ?? "Segmento selecionado"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleSettings}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Preferências
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Segundo plano
            </Button>
          </div>
        </div>

        {settingsOpen ? (
          <div className="mt-5">
            <MissionPreferencesPanel
              dark
              preferences={preferences}
              onChange={onPreferencesChange}
              onClose={onToggleSettings}
            />
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
          <div className="space-y-6">
            <div>
              <Badge className="border-violet-400/20 bg-violet-500/10 text-violet-200 hover:bg-violet-500/10">
                {isFinished ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {isFinished ? "Missão concluída" : "IA executando agora"}
              </Badge>
              <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {mission?.prompt ?? "Preparando agentes de inteligência comercial..."}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Acompanhe cada decisão enquanto os agentes encontram, analisam e priorizam oportunidades reais.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                    <StageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Agente ativo</p>
                    <p className="mt-1 font-medium">{stage.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Timer className="h-4 w-4" />
                  {formatTime(elapsedSeconds)}
                </div>
              </div>

              {preferences.showAiThoughts ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <LoaderCircle className={`mt-0.5 h-4 w-4 shrink-0 text-violet-400 ${isFinished ? "" : "animate-spin"}`} />
                  <p className="text-sm leading-6 text-zinc-200">
                    {isFinished ? "Ranking final concluído. As melhores oportunidades já estão disponíveis." : currentActivity}
                    {!isFinished ? <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-violet-400 align-middle" /> : null}
                  </p>
                </div>
              </div>
              ) : null}

              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Progresso da análise</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-6 grid grid-cols-5 gap-2">
                {stageDefinitions.map((item, index) => {
                  const Icon = item.icon;
                  const completed = isFinished || index < activeStage;
                  const running = !isFinished && index === activeStage;
                  return (
                    <div key={item.label} className="min-w-0 text-center">
                      <div
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                          running
                            ? "border-violet-400/40 bg-violet-500/20 text-violet-200"
                            : completed
                              ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
                              : "border-white/10 bg-white/5 text-zinc-600"
                        }`}
                      >
                        {completed ? <Check className="h-4 w-4" /> : <Icon className={`h-4 w-4 ${running ? "animate-pulse" : ""}`} />}
                      </div>
                      <p className={`mt-2 truncate text-[11px] ${running ? "text-white" : "text-zinc-500"}`}>
                        {item.short}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <FocusMetric label="Atividades" value={String(visibleActivities)} icon={Bot} />
              <FocusMetric label="Leads liberados" value={String(visibleCompanies)} icon={Building2} />
              <FocusMetric label="Agente atual" value={`${activeStage + 1}/5`} icon={Zap} />
              <FocusMetric label="Tempo" value={formatTime(elapsedSeconds)} icon={Clock3} />
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative min-h-[340px] overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] p-5">
              <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:38px_38px]" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Radar comercial</p>
                  <h2 className="mt-1 text-lg font-medium">{mission?.city ?? "Brasil"}</h2>
                </div>
                <Badge className="border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
                  <ActivityPulse />
                  <span className="ml-2">Varrendo região</span>
                </Badge>
              </div>

              <div className="relative mx-auto mt-5 aspect-square max-h-[245px] max-w-[245px]">
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-[18%] rounded-full border border-white/10" />
                <div className="absolute inset-[36%] rounded-full border border-white/10" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
                <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
                <div className="absolute inset-[46%] z-20 flex items-center justify-center rounded-full bg-violet-500 shadow-[0_0_35px_rgba(139,92,246,.55)]">
                  <MapPin className="h-4 w-4" />
                </div>
                {!isFinished && preferences.animationsEnabled ? (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                    <div className="leadflow-radar-sweep absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-bottom-left bg-gradient-to-r from-transparent via-violet-400/10 to-violet-300/35" />
                  </div>
                ) : null}
                {radarPoints.map((point, index) => (
                  <span
                    key={`${point.left}-${point.top}`}
                    className={`absolute z-10 h-2.5 w-2.5 rounded-full shadow-[0_0_12px_rgba(52,211,153,.65)] transition-[opacity,transform] duration-500 ${
                      progress > 12 + index * 11 ? "scale-100 bg-emerald-400 opacity-100" : "scale-0 opacity-0"
                    }`}
                    style={{ left: point.left, top: point.top, transitionDelay: point.delay }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Leads descobertos</p>
                  <p className="mt-1 text-sm text-zinc-300">Aparecem assim que são qualificados.</p>
                </div>
                <span className="text-2xl font-semibold">{visibleCompanies}</span>
              </div>
              <div className="mt-4 space-y-2">
                {companies.slice(0, visibleCompanies).map((company, index) => (
                  <div key={company.id} className="animate-in slide-in-from-right-3 fade-in flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.06] p-3 duration-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{company.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">#{index + 1} · oportunidade liberada</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600" />
                  </div>
                ))}
                {visibleCompanies === 0 ? (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-zinc-500">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Aguardando primeira qualificação...</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeadToast({
  name,
  animationsEnabled,
  onClose,
}: {
  name: string;
  animationsEnabled: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`fixed right-6 top-24 z-[110] ${animationsEnabled ? "animate-in slide-in-from-right-4 fade-in duration-300" : ""}`}>
      <div className="w-[320px] rounded-2xl border border-emerald-500/20 bg-zinc-950 px-4 py-3 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Novo lead qualificado</p>
            <p className="mt-1 truncate text-sm font-medium">{name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar notificação de novo lead"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function MissionCompleteToast({
  companies,
  potential,
  soundEnabled,
  onClose,
}: {
  companies: number;
  potential: number;
  soundEnabled: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed right-6 top-24 z-[110] animate-in slide-in-from-right-4 fade-in duration-500">
      <div className="w-[340px] rounded-2xl border border-emerald-500/25 bg-zinc-950 p-4 text-white shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
            <Bell className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Missão concluída</p>
              <div className="flex items-center gap-1">
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-zinc-500" /> : <VolumeX className="h-3.5 w-3.5 text-zinc-600" />}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Fechar notificação"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              {companies} oportunidades liberadas · potencial de {formatCurrency(potential)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MissionPreferencesPanel({ preferences, onChange, onClose, dark = false }: { preferences: MissionPreferences; onChange: (preferences: MissionPreferences) => void; onClose: () => void; dark?: boolean }) {
  const surface = dark ? "border-white/10 bg-zinc-900 text-white" : "border bg-background";
  const muted = dark ? "text-zinc-400" : "text-muted-foreground";

  function update<K extends keyof MissionPreferences>(key: K, value: MissionPreferences[K]) {
    onChange({ ...preferences, [key]: value });
  }

  return (
    <Card className={`rounded-3xl p-5 shadow-xl ${surface}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-violet-500" />
            <h2 className="font-semibold">Preferências da missão</h2>
          </div>
          <p className={`mt-1 text-sm ${muted}`}>O som começa desligado para não atrapalhar os testes.</p>
        </div>
        <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label="Fechar preferências">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <PreferenceToggle
          dark={dark}
          label="Som ao concluir"
          description="Um toque discreto apenas no fim."
          checked={preferences.soundEnabled}
          onChange={(checked) => update("soundEnabled", checked)}
        />
        <PreferenceToggle
          dark={dark}
          label="Animações"
          description="Radar, pulsos e transições."
          checked={preferences.animationsEnabled}
          onChange={(checked) => update("animationsEnabled", checked)}
        />
        <PreferenceToggle
          dark={dark}
          label="Tela cheia"
          description="Abre o modo ao vivo ao iniciar."
          checked={preferences.focusModeEnabled}
          onChange={(checked) => update("focusModeEnabled", checked)}
        />
        <PreferenceToggle
          dark={dark}
          label="Pensamento da IA"
          description="Mostra a atividade atual do agente."
          checked={preferences.showAiThoughts}
          onChange={(checked) => update("showAiThoughts", checked)}
        />
      </div>

      <div className="mt-4">
        <label className={`text-sm font-medium ${dark ? "text-zinc-200" : ""}`} htmlFor="simulation-speed">Velocidade da simulação</label>
        <select
          id="simulation-speed"
          value={preferences.simulationSpeed}
          onChange={(event) => update("simulationSpeed", event.target.value as SimulationSpeed)}
          className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none md:max-w-xs ${dark ? "border-white/10 bg-black/20 text-white" : "bg-background"}`}
        >
          <option value="slow">Apresentação — lenta</option>
          <option value="normal">Normal</option>
          <option value="fast">Testes — rápida</option>
        </select>
      </div>
    </Card>
  );
}

function PreferenceToggle({ label, description, checked, onChange, dark }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; dark: boolean }) {
  return (
    <label className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-3 ${dark ? "border-white/10 bg-white/[0.035]" : "bg-muted/20"}`}>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className={`mt-1 block text-xs leading-5 ${dark ? "text-zinc-500" : "text-muted-foreground"}`}>{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-violet-600"
      />
    </label>
  );
}

export function HeroMetric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 truncate text-xl font-semibold">{value}</p>
    </div>
  );
}

function FocusMetric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function SummaryRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 px-3.5 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{value}</span>
    </div>
  );
}

export function ActivityPulse() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
    </span>
  );
}
