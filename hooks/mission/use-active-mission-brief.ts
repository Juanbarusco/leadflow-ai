"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"

import {
  DEFAULT_MISSION_BRIEF,
  normalizeMissionBrief,
  type MissionBrief,
} from "@/lib/mission/brief"

const STORAGE_KEY = "leadflow-active-mission-brief"
const defaultSnapshot = JSON.stringify(DEFAULT_MISSION_BRIEF)
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? defaultSnapshot
}

function getServerSnapshot() {
  return defaultSnapshot
}

function parseBrief(snapshot: string) {
  try {
    return normalizeMissionBrief(JSON.parse(snapshot) as Partial<MissionBrief>)
  } catch {
    return DEFAULT_MISSION_BRIEF
  }
}

export function persistMissionBrief(brief: MissionBrief) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brief))
  listeners.forEach((listener) => listener())
}

export function useActiveMissionBrief() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const brief = useMemo(() => parseBrief(snapshot), [snapshot])

  const setBrief = useCallback((next: MissionBrief) => {
    persistMissionBrief(next)
  }, [])

  return { brief, setBrief }
}
