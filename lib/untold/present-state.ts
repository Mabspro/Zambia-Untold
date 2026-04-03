export interface UntoldPresentState {
  psi: {
    value: number | null;
    regime: string | null;
    updatedAt: string | null;
  };
  hydrology: {
    karibaPercent: number | null;
    status: "healthy" | "stressed" | "critical" | "unknown";
  };
  fx: {
    pair: "ZMW/USD";
    value: number | null;
    direction: "up" | "down" | "flat" | "unknown";
  };
  railHealth: {
    label: string;
    status: "healthy" | "degraded" | "stale" | "unknown";
  };
  sourceStatus: "live" | "fallback";
}

export const FALLBACK_PRESENT_STATE: UntoldPresentState = {
  psi: { value: null, regime: "Unavailable", updatedAt: null },
  hydrology: { karibaPercent: null, status: "unknown" },
  fx: { pair: "ZMW/USD", value: null, direction: "unknown" },
  railHealth: { label: "Signal unavailable", status: "unknown" },
  sourceStatus: "fallback",
};

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function toText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function deriveHydrologyStatus(
  percentFull: number | null
): UntoldPresentState["hydrology"]["status"] {
  if (percentFull === null) return "unknown";
  if (percentFull > 40) return "healthy";
  if (percentFull >= 20) return "stressed";
  return "critical";
}

export function deriveFxDirection(
  latest: number | null,
  previous: number | null
): UntoldPresentState["fx"]["direction"] {
  if (latest === null || previous === null || previous === 0) return "unknown";
  const changeRatio = (latest - previous) / previous;
  if (changeRatio > 0.005) return "up";
  if (changeRatio < -0.005) return "down";
  return "flat";
}

export function deriveRailHealth(label: string | null): UntoldPresentState["railHealth"]["status"] {
  if (!label) return "unknown";
  const normalized = label.toLowerCase();
  if (
    normalized.includes("healthy") ||
    normalized.includes("nominal") ||
    normalized.includes("stable") ||
    normalized.includes("operational")
  ) {
    return "healthy";
  }
  if (normalized.includes("stale")) return "stale";
  if (
    normalized.includes("degraded") ||
    normalized.includes("warn") ||
    normalized.includes("warning") ||
    normalized.includes("reduced") ||
    normalized.includes("delayed")
  ) {
    return "degraded";
  }
  return "unknown";
}

export function normalizePresentState(raw: unknown): UntoldPresentState {
  if (!raw || typeof raw !== "object") {
    return FALLBACK_PRESENT_STATE;
  }

  const candidate = raw as Partial<UntoldPresentState>;
  const psiValue = toFiniteNumber(candidate.psi?.value);
  const psiRegime = toText(candidate.psi?.regime) ?? FALLBACK_PRESENT_STATE.psi.regime;
  const psiUpdatedAt = toText(candidate.psi?.updatedAt);
  const karibaPercent = toFiniteNumber(candidate.hydrology?.karibaPercent);
  const hydrologyStatus =
    candidate.hydrology?.status && ["healthy", "stressed", "critical", "unknown"].includes(candidate.hydrology.status)
      ? candidate.hydrology.status
      : deriveHydrologyStatus(karibaPercent);
  const fxValue = toFiniteNumber(candidate.fx?.value);
  const fxDirection =
    candidate.fx?.direction && ["up", "down", "flat", "unknown"].includes(candidate.fx.direction)
      ? candidate.fx.direction
      : "unknown";
  const railLabel = toText(candidate.railHealth?.label) ?? FALLBACK_PRESENT_STATE.railHealth.label;
  const railStatus =
    candidate.railHealth?.status && ["healthy", "degraded", "stale", "unknown"].includes(candidate.railHealth.status)
      ? candidate.railHealth.status
      : deriveRailHealth(railLabel);

  return {
    psi: {
      value: psiValue,
      regime: psiRegime,
      updatedAt: psiUpdatedAt,
    },
    hydrology: {
      karibaPercent,
      status: hydrologyStatus,
    },
    fx: {
      pair: "ZMW/USD",
      value: fxValue,
      direction: fxDirection,
    },
    railHealth: {
      label: railLabel,
      status: railStatus,
    },
    sourceStatus: candidate.sourceStatus === "live" ? "live" : "fallback",
  };
}

export async function fetchUntoldPresentState(signal?: AbortSignal): Promise<UntoldPresentState> {
  try {
    const response = await fetch("/api/zambia-macro/state", {
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      return FALLBACK_PRESENT_STATE;
    }

    const json = (await response.json()) as unknown;
    return normalizePresentState(json);
  } catch {
    return FALLBACK_PRESENT_STATE;
  }
}
