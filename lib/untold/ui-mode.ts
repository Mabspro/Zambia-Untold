import { type EntryRoute } from "@/lib/untold/entry-routes";

export type UntoldMode =
  | "deep-time"
  | "historical"
  | "living"
  | "archive"
  | "future";

type ResolveModeInput = {
  activePanel: string | null;
  selectedMarkerId: string | null;
  scrubYear: number;
  observatoryIntent: boolean;
};

export function resolveUntoldMode({
  activePanel,
  selectedMarkerId,
  scrubYear,
  observatoryIntent,
}: ResolveModeInput): UntoldMode {
  if (activePanel === "contribute") return "archive";
  if (activePanel === "spaceMission") return "living";
  if (activePanel === "calendar" || activePanel === "folkTales") return "historical";
  if (activePanel === "deepTime") return "deep-time";
  if (observatoryIntent) return "living";
  if (selectedMarkerId) {
    return scrubYear < 1000 ? "deep-time" : "historical";
  }
  return scrubYear < 1000 ? "deep-time" : "historical";
}

export function getModeLabel(mode: UntoldMode): string {
  switch (mode) {
    case "deep-time":
      return "Deep Time";
    case "historical":
      return "Historical Zambia";
    case "living":
      return "Living Zambia";
    case "archive":
      return "Community Archive";
    case "future":
      return "Future Zambia";
    default:
      return "Deep Time";
  }
}

export function getModeDescription(mode: UntoldMode): string {
  switch (mode) {
    case "deep-time":
      return "Begin with geology, early settlement, and the oldest substrate beneath the nation.";
    case "historical":
      return "You are moving through kingdoms, extraction, liberation, and the modern Zambian state.";
    case "living":
      return "Present-day signals belong here because the current era is part of the archive, not outside it.";
    case "archive":
      return "The living archive gathers approved community memory so Zambia can narrate itself from within.";
    case "future":
      return "Future mode will connect sovereign compute, native AI, and national infrastructure ambition.";
    default:
      return "Begin with deep time.";
  }
}

export function getPreferredRouteForMode(mode: UntoldMode): EntryRoute {
  switch (mode) {
    case "living":
      return "live-zambia";
    case "archive":
      return "archive";
    default:
      return "deep-time";
  }
}
