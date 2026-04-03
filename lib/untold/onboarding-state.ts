import { type EntryRoute, isEntryRoute } from "@/lib/untold/entry-routes";

const RETURNING_USER_HINTS_KEY = "zambia-untold:returning-user-hints";

export interface ReturningUserHints {
  lastEntryRoute?: EntryRoute;
  dismissedIntro?: boolean;
  lastViewedLiveStateAt?: string;
}

function sanitizeHints(value: unknown): ReturningUserHints | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const hints: ReturningUserHints = {};

  if (typeof candidate.lastEntryRoute === "string" && isEntryRoute(candidate.lastEntryRoute)) {
    hints.lastEntryRoute = candidate.lastEntryRoute;
  }

  if (typeof candidate.dismissedIntro === "boolean") {
    hints.dismissedIntro = candidate.dismissedIntro;
  }

  if (typeof candidate.lastViewedLiveStateAt === "string" && candidate.lastViewedLiveStateAt.trim()) {
    hints.lastViewedLiveStateAt = candidate.lastViewedLiveStateAt;
  }

  return Object.keys(hints).length > 0 ? hints : null;
}

export function loadReturningUserHints(): ReturningUserHints | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(RETURNING_USER_HINTS_KEY);
    if (!raw) return null;
    return sanitizeHints(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveReturningUserHints(hints: ReturningUserHints): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(RETURNING_USER_HINTS_KEY, JSON.stringify(hints));
  } catch {
    // Ignore storage failures; the app should remain usable.
  }
}

export function mergeReturningUserHints(next: Partial<ReturningUserHints>): ReturningUserHints {
  const merged = { ...(loadReturningUserHints() ?? {}), ...next };
  saveReturningUserHints(merged);
  return merged;
}
