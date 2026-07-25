"use client"

import { useEffect, useMemo, useSyncExternalStore } from "react"

import type { Mission } from "@/lib/engines/mission-engine"

const STORAGE_KEY = "leadflow-last-mission"
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
  return window.localStorage.getItem(STORAGE_KEY) ?? ""
}

function getServerSnapshot() {
  return ""
}

function persistSnapshot(mission: Mission) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mission))
  listeners.forEach((listener) => listener())
}

export function useLastMission() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    let active = true

    void fetch("/api/workspace/missions/latest", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null
        return (await response.json()) as { mission?: Mission | null }
      })
      .then((payload) => {
        if (active && payload?.mission) persistSnapshot(payload.mission)
      })
      .catch(() => {
        // Local storage remains the offline/demo fallback.
      })

    return () => {
      active = false
    }
  }, [])

  return useMemo(() => {
    if (!snapshot) return null

    try {
      return JSON.parse(snapshot) as Mission
    } catch {
      return null
    }
  }, [snapshot])
}
