export type PublicSourceStatus = "live" | "fallback";

type SatelliteInterpretation = {
  category: string;
  detail: string;
};

function normalizedName(name: string) {
  return name.trim().toLowerCase();
}

export function getSatelliteConfidenceLabel(status: PublicSourceStatus): string {
  return status === "live" ? "Live propagated" : "Fallback model";
}

export function getSatelliteSignalNote(status: PublicSourceStatus): string {
  return status === "live"
    ? "Estimated from current public orbital elements, not live camera footage."
    : "Estimated from a reduced orbital sample while live propagation is unavailable.";
}

export function getSatelliteInterpretation(name: string): SatelliteInterpretation {
  const value = normalizedName(name);

  if (value === "iss" || value.includes("space station")) {
    return {
      category: "Crewed research station",
      detail: "A human-tended laboratory that helps users anchor orbital awareness in something familiar.",
    };
  }

  if (
    value.includes("sentinel") ||
    value.includes("landsat") ||
    value.includes("aqua") ||
    value.includes("terra") ||
    value.includes("metop") ||
    value.includes("noaa") ||
    value.includes("saocom") ||
    value.includes("cosmo") ||
    value.includes("planet")
  ) {
    return {
      category: "Earth observation satellite",
      detail: "Used for imaging, environmental monitoring, or remote sensing.",
    };
  }

  if (value.includes("gps") || value.includes("galileo") || value.includes("glonass") || value.includes("beidou")) {
    return {
      category: "Navigation satellite",
      detail: "Supports positioning, timing, and route systems that power daily infrastructure.",
    };
  }

  if (value.includes("skynet") || value.includes("ufo") || value.includes("intelsat") || value.includes("inmarsat")) {
    return {
      category: "Communications satellite",
      detail: "Supports broadcast, relay, or communications networks moving through orbital infrastructure.",
    };
  }

  if (value.includes("calsphere")) {
    return {
      category: "Historic calibration satellite",
      detail: "A legacy object used for calibration and scientific reference work.",
    };
  }

  return {
    category: "Tracked orbital object",
    detail: "Visible in public orbital models, though its public role is not cleanly classified here yet.",
  };
}
