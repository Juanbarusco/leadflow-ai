"use client";

import {
  Bot,
  CheckCircle2,
  CircleDot,
  Clock3,
  DollarSign,
  LoaderCircle,
  MessageSquareText,
  Settings2,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";

import { CompanyOpportunityCard } from "@/components/mission/CompanyOpportunityCard";
import {
  LeadToast,
  MissionCompleteToast,
  MissionFocusOverlay,
  MissionPreferencesPanel,
  HeroMetric,
  SummaryRow,
  ActivityPulse,
} from "@/components/mission/runtime/MissionRuntime";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActiveMissionBrief } from "@/hooks/mission/use-active-mission-brief";
import { useMissionExecution } from "@/hooks/mission/use-mission-execution";
import { useMissionPreferences } from "@/hooks/mission/use-mission-preferences";
import { stageDefinitions } from "@/lib/mission/config";
import { formatCurrency, formatTime } from "@/lib/mission/utils";

export default function MissionPage() {
  const { preferences, setPreferences } = useMissionPreferences();
  const { brief } = useActiveMissionBrief();
  const {
    mission,
    error,
    progress,
    activeStage,
    visibleActivities,
    elapsedSeconds,
    isFinished,
    runId,
    justUnlocked,
    focusMode,
    settingsOpen,
    showCompletionToast,
    companies,
    visibleCompanies,
    shownCompanies,
    currentActivity,
    stats,
    restartMission,
    openWebsite,
    openInstagram,
    openMaps,
    generateOutreach,
    setJustUnlocked,
    setFocusMode,
    setSettingsOpen,
    setShowCompletionToast,
    activityMessages,
  } = useMissionExecution(preferences, brief);

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
              <div className="flex flex-wrap items-center gap-2">
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
                {mission ? (
                  <Badge className={mission.dataSource === "google_places" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/10" : "border-amber-400/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/10"}>
                    {mission.dataSource === "google_places" ? "Dados reais · Google Places" : "Modo demonstração"}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <span>LeadFlow AI · Missão #{String(runId).padStart(3, "0")}</span>
                <span className="text-zinc-700">•</span>
                <span>{mission?.city ?? "Preparando região"}</span>
                <span className="text-zinc-700">•</span>
                <span>{mission?.niche ?? brief.segment}</span>
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
                Executar novamente
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

          {mission ? (
            <div className={`mt-7 rounded-2xl border px-4 py-3 text-sm ${mission.dataSource === "google_places" ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-100" : "border-amber-400/15 bg-amber-400/[0.06] text-amber-100"}`}>
              <strong>{mission.dataSource === "google_places" ? "Fonte ativa:" : "Ambiente de preparação:"}</strong> {mission.dataNotice}
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
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

            <section id="opportunities" className="scroll-mt-28 space-y-4">
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

            <Card id="mission-summary" className="scroll-mt-28 rounded-[26px] p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-violet-500" />
                <h3 className="font-semibold">Resumo da missão</h3>
              </div>
              <div className="mt-5 space-y-3">
                <SummaryRow label="Região" value={mission?.city ?? "Preparando região"} />
                <SummaryRow label="Segmento" value={mission?.niche ?? brief.segment} />
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


