"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Mission } from "@/lib/engines/mission-engine";
import { missionService } from "@/lib/services/mission.service";
import { activityMessages, missionPrompt, stageDefinitions } from "@/lib/mission/config";
import type { MissionPreferences, MissionStats } from "@/lib/mission/types";
import { normalizeExternalUrl, playCompletionSound } from "@/lib/mission/utils";

const speedMultiplier = { slow: 1.45, normal: 1, fast: 0.55 } as const;

export function useMissionExecution(preferences: MissionPreferences) {
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);
  const completionSoundPlayed = useRef(false);
  const leadToastTimerRef = useRef<number | null>(null);
  const previousVisibleCompaniesRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    void missionService
      .createMission(missionPrompt)
      .then((result) => {
        if (mounted) setMission(result);
      })
      .catch((missionError: unknown) => {
        if (!mounted) return;
        setError(missionError instanceof Error ? missionError.message : "Não foi possível executar a missão.");
      });

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
  }, [mission, error, isFinished, preferences.simulationSpeed]);

  const companies = useMemo(() => mission?.companies ?? [], [mission]);

  const visibleCompanies = useMemo(() => {
    if (companies.length === 0) return 0;
    const unlockThresholds = companies.map((_, index) =>
      Math.round(42 + (index * 48) / Math.max(1, companies.length - 1)),
    );
    return unlockThresholds.filter((threshold) => progress >= threshold).length;
  }, [companies, progress]);

  const shownCompanies = useMemo(
    () => companies.slice(0, visibleCompanies),
    [companies, visibleCompanies],
  );

  const currentActivity = activityMessages[Math.min(visibleActivities - 1, activityMessages.length - 1)];

  const stats = useMemo<MissionStats>(() => {
    const analyzed = shownCompanies.length;
    const qualified = shownCompanies.filter((company) => company.websiteAnalysis.opportunityScore >= 70).length;
    const discarded = Math.max(0, analyzed - qualified);
    const hot = shownCompanies.filter((company) => company.websiteAnalysis.opportunityPriority === "high").length;
    const potential = shownCompanies.reduce((total, company) => total + company.websiteAnalysis.estimatedSaleMax, 0);
    return { analyzed, qualified, discarded, hot, potential };
  }, [shownCompanies]);

  useEffect(() => {
    if (!mission || visibleCompanies <= previousVisibleCompaniesRef.current) return;
    const unlocked = mission.companies[visibleCompanies - 1];
    previousVisibleCompaniesRef.current = visibleCompanies;
    setJustUnlocked(unlocked?.name ?? null);
  }, [mission, visibleCompanies]);

  useEffect(() => {
    if (!justUnlocked) return;
    if (leadToastTimerRef.current !== null) window.clearTimeout(leadToastTimerRef.current);
    leadToastTimerRef.current = window.setTimeout(() => {
      setJustUnlocked(null);
      leadToastTimerRef.current = null;
    }, 2400);
    return () => {
      if (leadToastTimerRef.current !== null) window.clearTimeout(leadToastTimerRef.current);
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

  function restartMission() {
    setMission(null);
    setError(null);
    setProgress(2);
    setActiveStage(0);
    setVisibleActivities(1);
    previousVisibleCompaniesRef.current = 0;
    setElapsedSeconds(0);
    setIsFinished(false);
    if (leadToastTimerRef.current !== null) window.clearTimeout(leadToastTimerRef.current);
    setJustUnlocked(null);
    setShowCompletionToast(false);
    completionSoundPlayed.current = false;
    setFocusMode(preferences.focusModeEnabled);
    setRunId((value) => value + 1);
  }

  function openWebsite(company: Mission["companies"][number]) {
    if (company.website) window.open(normalizeExternalUrl(company.website), "_blank", "noopener,noreferrer");
  }

  function openInstagram(company: Mission["companies"][number]) {
    const url = company.instagramAnalysis?.profileUrl;
    if (url) window.open(normalizeExternalUrl(url), "_blank", "noopener,noreferrer");
  }

  function openMaps(company: Mission["companies"][number]) {
    const query = encodeURIComponent(`${company.name}, ${company.address}, ${company.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
  }

  function generateOutreach(company: Mission["companies"][number]) {
    const problem = company.websiteAnalysis.commercialProblems[0] ??
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

  return {
    mission, error, progress, activeStage, visibleActivities, elapsedSeconds, isFinished, runId,
    justUnlocked, focusMode, settingsOpen, showCompletionToast, companies, visibleCompanies,
    shownCompanies, currentActivity, stats, restartMission, openWebsite, openInstagram, openMaps,
    generateOutreach, setJustUnlocked, setFocusMode, setSettingsOpen, setShowCompletionToast,
  };
}
