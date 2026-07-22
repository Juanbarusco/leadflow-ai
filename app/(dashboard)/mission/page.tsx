"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  DollarSign,
  Globe2,
  LoaderCircle,
  Map,
  MapPin,
  MessageSquareText,
  Bell,
  Settings2,
  Volume2,
  VolumeX,
  Search,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  TriangleAlert,
  Users,
  X,
  Zap,
} from "lucide-react";

import type { Mission } from "@/lib/engines/mission-engine";
import { missionService } from "@/lib/services/mission.service";
import { CompanyOpportunityCard } from "@/components/mission/CompanyOpportunityCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stageDefinitions = [
  { label: "Google Agent", short: "Google", description: "Buscando empresas no Google Maps", icon: Map },
  { label: "Website Agent", short: "Website", description: "Analisando sites e conversão", icon: Globe2 },
  { label: "Instagram Agent", short: "Instagram", description: "Verificando presença social", icon: Camera },
  { label: "SEO Agent", short: "SEO", description: "Mapeando oportunidades orgânicas", icon: Search },
  { label: "IA Comercial", short: "Comercial", description: "Priorizando leads e abordagem", icon: Sparkles },
];

const activityMessages = [
  { stage: 0, text: "Conectando ao Google Maps de São Carlos..." },
  { stage: 0, text: "Cruzando segmento, reputação e localização." },
  { stage: 0, text: "Empresas compatíveis encontradas." },
  { stage: 1, text: "Sites enviados para análise técnica." },
  { stage: 1, text: "Velocidade, landing page e WhatsApp verificados." },
  { stage: 2, text: "Perfis do Instagram localizados." },
  { stage: 2, text: "Atividade e engajamento social analisados." },
  { stage: 3, text: "Sinais de SEO e presença orgânica consolidados." },
  { stage: 4, text: "Calculando score e chance de fechamento." },
  { stage: 4, text: "Preparando abordagem comercial personalizada." },
  { stage: 4, text: "Ranking de oportunidades atualizado." },
];

const radarPoints = [
  { left: "21%", top: "31%", delay: "0ms" },
  { left: "67%", top: "24%", delay: "180ms" },
  { left: "43%", top: "61%", delay: "360ms" },
  { left: "77%", top: "69%", delay: "540ms" },
  { left: "29%", top: "76%", delay: "720ms" },
  { left: "55%", top: "43%", delay: "900ms" },
];


type SimulationSpeed = "slow" | "normal" | "fast";

type MissionPreferences = {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  focusModeEnabled: boolean;
  showAiThoughts: boolean;
  simulationSpeed: SimulationSpeed;
};

const defaultPreferences: MissionPreferences = {
  soundEnabled: false,
  animationsEnabled: true,
  focusModeEnabled: true,
  showAiThoughts: true,
  simulationSpeed: "normal",
};


function loadMissionPreferences(): MissionPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  const saved = window.localStorage.getItem("leadflow-mission-preferences");
  if (!saved) return defaultPreferences;
  try {
    return { ...defaultPreferences, ...(JSON.parse(saved) as Partial<MissionPreferences>) };
  } catch {
    window.localStorage.removeItem("leadflow-mission-preferences");
    return defaultPreferences;
  }
}

const speedMultiplier: Record<SimulationSpeed, number> = {
  slow: 1.45,
  normal: 1,
  fast: 0.55,
};

function playCompletionSound() {
  const AudioContextClass = window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
  gain.connect(context.destination);

  [659.25, 880].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.09);
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.09);
    oscillator.stop(context.currentTime + 0.28 + index * 0.09);
  });

  window.setTimeout(() => void context.close(), 700);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function normalizeExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

export default function MissionPage() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(2);
  const [activeStage, setActiveStage] = useState(0);
  const [visibleActivities, setVisibleActivities] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [runId, setRunId] = useState(24);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(true);
  const [preferences, setPreferences] = useState<MissionPreferences>(loadMissionPreferences);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);
  const completionSoundPlayed = useRef(false);
  const leadToastTimerRef = useRef<number | null>(null);
  const previousVisibleCompaniesRef = useRef(0);

  useEffect(() => {
    window.localStorage.setItem("leadflow-mission-preferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    let mounted = true;

    async function executeMission() {
      try {
        const result = await missionService.createMission("Encontrar clínicas odontológicas em São Carlos");
        if (!mounted) return;
        setMission(result);
      } catch (missionError) {
        if (!mounted) return;
        setError(
          missionError instanceof Error ? missionError.message : "Não foi possível executar a missão.",
        );
      }
    }

    void executeMission();
    return () => {
      mounted = false;
    };
  }, [runId]);

  useEffect(() => {
    if (error || isFinished) return;
    const timer = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [error, isFinished]);

  useEffect(() => {
    if (!mission || error || isFinished) return;

    const multiplier = speedMultiplier[preferences.simulationSpeed];

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        const increment = current < 28 ? 3 : current < 72 ? 2 : 1;
        const next = Math.min(100, current + increment);
        if (next >= 100) {
          setIsFinished(true);
          setActiveStage(stageDefinitions.length - 1);
        }
        return next;
      });
    }, Math.round(460 * multiplier));

    const stageTimer = window.setInterval(() => {
      setActiveStage((current) => Math.min(stageDefinitions.length - 1, current + 1));
    }, Math.round(3100 * multiplier));

    const activityTimer = window.setInterval(() => {
      setVisibleActivities((current) => Math.min(activityMessages.length, current + 1));
    }, Math.round(1250 * multiplier));

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(stageTimer);
      window.clearInterval(activityTimer);
    };
  }, [mission, error, isFinished, runId, preferences.simulationSpeed]);

  const visibleCompanies = useMemo(() => {
    if (!mission || mission.companies.length === 0) return 0;
    const unlockThresholds = mission.companies.map((_, index) =>
      Math.round(42 + (index * 48) / Math.max(1, mission.companies.length - 1)),
    );
    return unlockThresholds.filter((threshold) => progress >= threshold).length;
  }, [mission, progress]);

  useEffect(() => {
    if (!mission || visibleCompanies <= previousVisibleCompaniesRef.current) return;
    const unlocked = mission.companies[visibleCompanies - 1];
    const timer = window.setTimeout(() => {
      previousVisibleCompaniesRef.current = visibleCompanies;
      setJustUnlocked(unlocked?.name ?? null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [mission, visibleCompanies]);

  useEffect(() => {
    if (!justUnlocked) return;

    if (leadToastTimerRef.current !== null) {
      window.clearTimeout(leadToastTimerRef.current);
    }

    leadToastTimerRef.current = window.setTimeout(() => {
      setJustUnlocked(null);
      leadToastTimerRef.current = null;
    }, 2400);

    return () => {
      if (leadToastTimerRef.current !== null) {
        window.clearTimeout(leadToastTimerRef.current);
        leadToastTimerRef.current = null;
      }
    };
  }, [justUnlocked]);

  useEffect(() => {
    if (!isFinished) return;

    if (preferences.soundEnabled && !completionSoundPlayed.current) {
      completionSoundPlayed.current = true;
      playCompletionSound();
    }

    const showToastTimeout = window.setTimeout(() => setShowCompletionToast(true), 0);
    const focusTimeout = window.setTimeout(() => setFocusMode(false), 1800);
    const toastTimeout = window.setTimeout(() => setShowCompletionToast(false), 4000);

    return () => {
      window.clearTimeout(showToastTimeout);
      window.clearTimeout(focusTimeout);
      window.clearTimeout(toastTimeout);
    };
  }, [isFinished, preferences.soundEnabled]);

  const companies = mission?.companies ?? [];
  const shownCompanies = companies.slice(0, visibleCompanies);
  const currentActivity = activityMessages[Math.min(visibleActivities - 1, activityMessages.length - 1)];

  const stats = useMemo(() => {
    const analyzed = shownCompanies.length;
    const qualified = shownCompanies.filter((company) => company.websiteAnalysis.opportunityScore >= 70).length;
    const discarded = Math.max(0, analyzed - qualified);
    const hot = shownCompanies.filter(
      (company) => company.websiteAnalysis.opportunityPriority === "high",
    ).length;
    const potential = shownCompanies.reduce(
      (total, company) => total + company.websiteAnalysis.estimatedSaleMax,
      0,
    );

    return { analyzed, qualified, discarded, hot, potential };
  }, [shownCompanies]);

  function restartMission() {
    setMission(null);
    setError(null);
    setProgress(2);
    setActiveStage(0);
    setVisibleActivities(1);
    previousVisibleCompaniesRef.current = 0;
    setElapsedSeconds(0);
    setIsFinished(false);
    if (leadToastTimerRef.current !== null) {
      window.clearTimeout(leadToastTimerRef.current);
      leadToastTimerRef.current = null;
    }
    setJustUnlocked(null);
    setShowCompletionToast(false);
    completionSoundPlayed.current = false;
    setFocusMode(preferences.focusModeEnabled);
    setRunId((value) => value + 1);
  }

  function openWebsite(company: Mission["companies"][number]) {
    if (company.website) {
      window.open(normalizeExternalUrl(company.website), "_blank", "noopener,noreferrer");
    }
  }

  function openInstagram(company: Mission["companies"][number]) {
    const url = company.instagramAnalysis?.profileUrl;
    if (url) window.open(normalizeExternalUrl(url), "_blank", "noopener,noreferrer");
  }

  function openMaps(company: Mission["companies"][number]) {
    const query = encodeURIComponent(`${company.name}, ${company.address}, ${company.city}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function generateOutreach(company: Mission["companies"][number]) {
    const problem =
      company.websiteAnalysis.commercialProblems[0] ??
      company.instagramAnalysis?.commercialProblems[0] ??
      "há oportunidades de melhoria na presença digital";

    const text = [
      "Olá! Tudo bem?",
      "",
      `Analisei rapidamente a presença digital da ${company.name} e percebi que ${problem.toLowerCase()}.`,
      "",
      "Identifiquei oportunidades para melhorar a geração de contatos e o aproveitamento das pessoas que já procuram pela empresa.",
      "",
      "Posso te mostrar esse diagnóstico rapidamente, sem compromisso?",
    ].join("\n");

    void navigator.clipboard
      .writeText(text)
      .then(() => window.alert(`Abordagem da ${company.name} copiada.`))
      .catch(() => window.alert(text));
  }

  return (
    <div className="space-y-6 pb-12">
      {focusMode && !error ? (
        <MissionFocusOverlay
          mission={mission}
          runId={runId}
          progress={progress}
          activeStage={activeStage}
          elapsedSeconds={elapsedSeconds}
          visibleActivities={visibleActivities}
          visibleCompanies={visibleCompanies}
          currentActivity={currentActivity?.text ?? "Inicializando agentes..."}
          companies={companies}
          isFinished={isFinished}
          preferences={preferences}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((value) => !value)}
          onPreferencesChange={setPreferences}
          onClose={() => setFocusMode(false)}
        />
      ) : null}

      <section className="relative overflow-hidden rounded-[30px] border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
                {error ? (
                  <TriangleAlert className="mr-1.5 h-3.5 w-3.5 text-red-400" />
                ) : isFinished ? (
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <CircleDot className="mr-1.5 h-3.5 w-3.5 animate-pulse text-emerald-400" />
                )}
                {error ? "Falha na missão" : isFinished ? "Missão concluída" : "Missão em execução"}
              </Badge>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <span>LeadFlow AI · Missão #{String(runId).padStart(3, "0")}</span>
                <span className="text-zinc-700">•</span>
                <span>São Carlos</span>
                <span className="text-zinc-700">•</span>
                <span>Odontologia</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                {mission?.prompt ?? "Preparando inteligência comercial..."}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Agentes cruzam presença digital, reputação e intenção comercial para liberar os melhores leads.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[560px]">
              <HeroMetric icon={Users} label="Analisadas" value={String(stats.analyzed)} />
              <HeroMetric icon={Target} label="Qualificadas" value={String(stats.qualified)} />
              <HeroMetric icon={TrendingUp} label="Leads quentes" value={String(stats.hot)} />
              <HeroMetric icon={DollarSign} label="Potencial" value={formatCurrency(stats.potential)} />
              <Button
                type="button"
                variant="outline"
                onClick={restartMission}
                className="col-span-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:col-span-3"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Executar nova missão
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSettingsOpen((value) => !value)}
                className="col-span-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:col-span-1"
                aria-label="Configurações da missão"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 text-zinc-300">
                {isFinished ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <LoaderCircle className="h-4 w-4 animate-spin text-violet-400" />
                )}
                <span>{isFinished ? "Análise finalizada" : stageDefinitions[activeStage].description}</span>
              </div>
              <span className="font-medium text-white">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {settingsOpen ? (
        <MissionPreferencesPanel
          preferences={preferences}
          onChange={setPreferences}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}

      {isFinished && showCompletionToast ? (
        <MissionCompleteToast
          companies={stats.qualified}
          potential={stats.potential}
          soundEnabled={preferences.soundEnabled}
          onClose={() => setShowCompletionToast(false)}
        />
      ) : justUnlocked ? (
        <LeadToast
          name={justUnlocked}
          animationsEnabled={preferences.animationsEnabled}
          onClose={() => setJustUnlocked(null)}
        />
      ) : null}

      {error ? (
        <Card className="rounded-3xl border-red-500/20 bg-red-500/5 p-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 text-red-500" />
            <div>
              <h2 className="font-semibold">A missão não pôde ser executada</h2>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-6">
            <Card className="overflow-hidden rounded-[28px] border shadow-sm">
              <div className="border-b bg-muted/20 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-violet-500" />
                      <h2 className="text-lg font-semibold">Execução dos agentes</h2>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Cada etapa libera novos dados para a inteligência comercial.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isFinished ? (
                      <Button size="sm" variant="outline" onClick={() => setFocusMode(true)}>
                        <Zap className="mr-2 h-3.5 w-3.5" />
                        Ver execução ao vivo
                      </Button>
                    ) : null}
                    <Badge variant="outline" className="w-fit">
                      <Timer className="mr-1.5 h-3.5 w-3.5" />
                      {formatTime(elapsedSeconds)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
                {stageDefinitions.map((stage, index) => {
                  const Icon = stage.icon;
                  const completed = isFinished || index < activeStage;
                  const running = !isFinished && index === activeStage;

                  return (
                    <div
                      key={stage.label}
                      className={`rounded-2xl border p-4 transition-all ${
                        running
                          ? "border-violet-500/30 bg-violet-500/5 shadow-sm"
                          : completed
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "bg-muted/20 opacity-65"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl border bg-background p-2">
                          <Icon className="h-4 w-4" />
                        </div>
                        {completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : running ? (
                          <LoaderCircle className="h-4 w-4 animate-spin text-violet-500" />
                        ) : (
                          <Clock3 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold">{stage.label}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {completed ? "Etapa concluída" : running ? "Processando agora" : "Aguardando dados"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Oportunidades liberadas
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">Empresas priorizadas pela IA</h2>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {visibleCompanies} de {companies.length} empresas
                </Badge>
              </div>

              {shownCompanies.length === 0 ? (
                <Card className="rounded-3xl p-8 text-center">
                  <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-violet-500" />
                  <p className="mt-3 font-medium">Aguardando os primeiros resultados...</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Os cards serão exibidos conforme cada empresa for qualificada.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {shownCompanies.map((company, index) => (
                    <div key={company.id} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                      <CompanyOpportunityCard
                        company={company}
                        rank={index + 1}
                        isBestOpportunity={index === 0}
                        onOpenWebsite={openWebsite}
                        onOpenInstagram={openInstagram}
                        onOpenMaps={openMaps}
                        onGenerateOutreach={generateOutreach}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
            <Card className="overflow-hidden rounded-[26px] border border-zinc-800 bg-zinc-950 text-white shadow-xl">
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center gap-2">
                  <ActivityPulse />
                  <h3 className="font-semibold">Raciocínio dos agentes</h3>
                </div>
                <p className="mt-1 text-sm text-zinc-400">Decisões e descobertas em tempo real.</p>
              </div>
              <div className="max-h-[410px] space-y-2 overflow-auto p-3">
                {activityMessages.slice(0, visibleActivities).map((activity, index) => {
                  const latest = index === visibleActivities - 1 && !isFinished;
                  const stage = stageDefinitions[activity.stage];
                  return (
                    <div key={`${activity.stage}-${activity.text}`} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                          {stage.label}
                        </span>
                        {latest ? (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-violet-400" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                      </div>
                      <p className={`text-sm leading-5 ${latest ? "text-white" : "text-zinc-400"}`}>
                        {activity.text}
                        {latest ? <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-violet-400 align-middle" /> : null}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="rounded-[26px] p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-violet-500" />
                <h3 className="font-semibold">Resumo da missão</h3>
              </div>
              <div className="mt-5 space-y-3">
                <SummaryRow label="Cidade" value={mission?.city ?? "São Carlos"} />
                <SummaryRow label="Segmento" value={mission?.niche ?? "Odontologia"} />
                <SummaryRow label="Analisadas" value={String(stats.analyzed)} />
                <SummaryRow label="Qualificadas" value={String(stats.qualified)} accent />
                <SummaryRow label="Descartadas" value={String(stats.discarded)} />
                <SummaryRow label="Potencial" value={formatCurrency(stats.potential)} accent />
                <SummaryRow label="Tempo" value={formatTime(elapsedSeconds)} />
              </div>
            </Card>

            <Card className="rounded-[26px] border-violet-500/20 bg-violet-500/5 p-5">
              <div className="flex items-start gap-3">
                <MessageSquareText className="mt-0.5 h-5 w-5 text-violet-500" />
                <div>
                  <h3 className="font-semibold">Próxima ação sugerida</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Comece pelo lead #1 e use a abordagem personalizada gerada pela IA.
                  </p>
                </div>
              </div>
              <Button
                className="mt-4 w-full rounded-xl"
                disabled={shownCompanies.length === 0}
                onClick={() => shownCompanies[0] && generateOutreach(shownCompanies[0])}
              >
                Gerar abordagem do melhor lead
              </Button>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}

function MissionFocusOverlay({
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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-zinc-950/95 px-4 py-5 text-white backdrop-blur-xl sm:px-6 sm:py-8">
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
              <p className="mt-1 text-sm text-zinc-300">São Carlos · Clínicas odontológicas</p>
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
              {preferences.soundEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
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
                  <h2 className="mt-1 text-lg font-medium">São Carlos</h2>
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
                {!isFinished && preferences.animationsEnabled ? <div className="absolute inset-0 animate-ping rounded-full border border-violet-400/20 [animation-duration:2.8s]" /> : null}
                {radarPoints.map((point, index) => (
                  <span
                    key={`${point.left}-${point.top}`}
                    className={`absolute z-10 h-2.5 w-2.5 rounded-full transition-all duration-700 ${
                      progress > 12 + index * 11 ? "scale-100 bg-emerald-400 opacity-100" : "scale-0 opacity-0"
                    }`}
                    style={{ left: point.left, top: point.top, transitionDelay: point.delay }}
                  >
                    {preferences.animationsEnabled ? <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40" /> : null}
                  </span>
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

function LeadToast({
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

function MissionCompleteToast({
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

function MissionPreferencesPanel({ preferences, onChange, onClose, dark = false }: { preferences: MissionPreferences; onChange: (preferences: MissionPreferences) => void; onClose: () => void; dark?: boolean }) {
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

function HeroMetric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
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

function SummaryRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 px-3.5 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{value}</span>
    </div>
  );
}

function ActivityPulse() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
    </span>
  );
}
