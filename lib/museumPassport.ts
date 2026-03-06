import type { DeepTimeZone } from "./deepTime";

const PASSPORT_STORAGE_KEY = "zambia-untold:museum-passport";
const MISSION_PROGRESS_STORAGE_KEY = "zambia-untold:mission-progress";

export type MuseumPassport = {
  lastYear: number;
  lastZone: DeepTimeZone;
  visitedMarkers: string[];
  visitedZones: DeepTimeZone[];
  lastVisitedAt: string;
};

export type MissionProgress = {
  completedSteps: string[];
  completedMissions: string[];
  earnedBadges: string[];
  lastActiveMission: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadMuseumPassport(): MuseumPassport | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MuseumPassport;
    if (!parsed || typeof parsed.lastYear !== "number" || !parsed.lastZone) {
      return null;
    }
    return {
      ...parsed,
      visitedMarkers: Array.isArray(parsed.visitedMarkers) ? parsed.visitedMarkers : [],
      visitedZones: Array.isArray(parsed.visitedZones) ? parsed.visitedZones : [],
      lastVisitedAt:
        typeof parsed.lastVisitedAt === "string" ? parsed.lastVisitedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveMuseumPassport(passport: MuseumPassport): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(passport));
}

export function loadMissionProgress(): MissionProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(MISSION_PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MissionProgress;
    return {
      completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
      completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
      earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : [],
      lastActiveMission:
        typeof parsed.lastActiveMission === "string" ? parsed.lastActiveMission : "substrate",
    };
  } catch {
    return null;
  }
}

export function saveMissionProgress(progress: MissionProgress): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(MISSION_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}
