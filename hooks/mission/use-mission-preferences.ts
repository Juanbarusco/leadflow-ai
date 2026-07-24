"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { MissionPreferences } from "@/lib/mission/types";

const STORAGE_KEY = "leadflow-mission-preferences";

const defaultPreferences: MissionPreferences = {
  soundEnabled: false,
  animationsEnabled: true,
  focusModeEnabled: true,
  showAiThoughts: true,
  simulationSpeed: "normal",
};

const defaultSnapshot = JSON.stringify(defaultPreferences);
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? defaultSnapshot;
}

function getServerSnapshot() {
  return defaultSnapshot;
}

function parsePreferences(snapshot: string): MissionPreferences {
  try {
    return { ...defaultPreferences, ...(JSON.parse(snapshot) as Partial<MissionPreferences>) };
  } catch {
    return defaultPreferences;
  }
}

export function useMissionPreferences() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const preferences = useMemo(() => parsePreferences(snapshot), [snapshot]);

  const setPreferences = useCallback(
    (next: MissionPreferences | ((current: MissionPreferences) => MissionPreferences)) => {
      const current = parsePreferences(getSnapshot());
      const value = typeof next === "function" ? next(current) : next;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      listeners.forEach((listener) => listener());
    },
    [],
  );

  return { preferences, setPreferences };
}
