"use client";

import { useEffect, useState } from "react";
import type { MissionPreferences } from "@/lib/mission/types";

const STORAGE_KEY = "leadflow-mission-preferences";

const defaultPreferences: MissionPreferences = {
  soundEnabled: false,
  animationsEnabled: true,
  focusModeEnabled: true,
  showAiThoughts: true,
  simulationSpeed: "normal",
};

function loadPreferences(): MissionPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultPreferences;

  try {
    return { ...defaultPreferences, ...(JSON.parse(saved) as Partial<MissionPreferences>) };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return defaultPreferences;
  }
}

export function useMissionPreferences() {
  const [preferences, setPreferences] = useState<MissionPreferences>(loadPreferences);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  return { preferences, setPreferences };
}
